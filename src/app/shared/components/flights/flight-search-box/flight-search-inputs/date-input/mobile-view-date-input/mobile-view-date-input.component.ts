import { Component, Inject, inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbCalendar, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FlightSearchService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-mobile-view-date-input',
  templateUrl: './mobile-view-date-input.component.html',
  styleUrl: './mobile-view-date-input.component.scss',
})
export class MobileViewDateInputComponent {
  public calendar = inject(NgbCalendar);
  public flightSearchService = inject(FlightSearchService);

  @ViewChild('datePicker') datePicker?: NgbDatepicker;

  departingDate: NgbDate = new NgbDate(1999, 1, 9);
  returnDate: NgbDate = new NgbDate(1999, 1, 9);
  previousDate: NgbDate | null = null;
  hoveredDate: NgbDate | null = null;

  minDepartingDate: NgbDate = new NgbDate(1999, 1, 9);
  maxDate: NgbDate = new NgbDate(1999, 1, 9);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { isReturnDate: boolean; index: number; dismiss: Function; flightType: string }) {}
  
  ngOnInit(): void {
    const departingDate = this.flightSearchService.flightsArray?.at(this.data.index).get('departingD')?.value;
    const returnDate = this.flightSearchService.searchFlight.get('returnDate')?.value;

    this.departingDate = this.parseNgBootstrapDate(this.departingDate, departingDate, false);
    this.returnDate = this.parseNgBootstrapDate(this.returnDate, returnDate, false);

    this.minDepartingDate = this.calendar.getToday();
    this.maxDate = new NgbDate(this.minDepartingDate.year + 1, this.minDepartingDate.month, this.minDepartingDate.day);

    if (this.data.flightType === 'multi-city' && this.data.index > 0) {
      const previous = this.flightSearchService.flightsArray?.at(this.data.index - 1)?.get('departingD')?.value;
      this.previousDate = previous ? this.parseNgBootstrapDate(new NgbDate(1999, 1, 9), previous, false) : null;
    }
  }

  parseNgBootstrapDate(ngbDate: NgbDate, date: string, addDay: boolean) {
    if (!date) {
      return this.calendar.getToday();
    }

    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const day = new Date(date).getDate();

    ngbDate.month = month + 1;
    ngbDate.year = year;

    if (addDay) {
      ngbDate.day = day + 1;
    } else {
      ngbDate.day = day;
    }

    return ngbDate;
  }

  onDateSelection(date: NgbDate) {
    if (this.isMobileDayDisabled(date)) return;
    if (this.data.isReturnDate && date.before(this.departingDate)) return;

    if (this.data.isReturnDate) {
      this.flightSearchService.searchFlight
        .get('returnDate')
        ?.setValue(`${date.year}-${date.month.toString().padStart(2, '0')}-${date.day}`);
      this.backToSearchBox();
      return;
    }

    this.flightSearchService.flightsArray
      .at(this.data.index)
      ?.get('departingD')
      ?.setValue(`${date.year}-${date.month.toString().padStart(2, '0')}-${date.day}`);
    this.flightSearchService.searchFlight.get('returnDate')?.setValue('');
    this.departingDate = new NgbDate(date.year, date.month, date.day);

    if (this.data.flightType === 'round-trip') {
      this.data.isReturnDate = true;
      setTimeout(() => this.datePicker?.navigateTo(this.departingDate));
      return;
    }

    this.backToSearchBox();
  }

  backToSearchBox() {
    this.data.dismiss();
  }

  isSelected(date: NgbDate) {
    return (
      (this.departingDate.equals(date) &&
        this.flightSearchService.flightsArray?.at(this.data.index).get('departingD')?.value) ||
      (this.returnDate.equals(date) &&
        this.data.flightType === 'round-trip' &&
        this.flightSearchService.searchFlight.get('returnDate')?.value)
    );
  }

  isInside(date: NgbDate) {
    return date.after(this.departingDate) && date.before(this.returnDate);
  }

  mobileMinDate(): NgbDate {
    if (this.data.isReturnDate && !this.departingDate.before(this.minDepartingDate)) return this.departingDate;
    if (this.data.flightType === 'multi-city' && this.previousDate && !this.previousDate.before(this.minDepartingDate)) {
      return this.previousDate;
    }
    return this.minDepartingDate;
  }

  isMobileDayDisabled(date: NgbDate): boolean {
    return date.after(this.maxDate) || date.before(this.mobileMinDate());
  }

  isPreviousSelected(date: NgbDate): boolean {
    return !!this.previousDate && this.previousDate.equals(date);
  }

  isHoverRange(date: NgbDate): boolean {
    if (!this.previousDate || !this.hoveredDate) return false;
    return date.after(this.previousDate) && date.before(this.hoveredDate);
  }
}
