import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
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

  departingDate: NgbDate = new NgbDate(1999, 1, 9);
  returnDate: NgbDate = new NgbDate(1999, 1, 9);

  minDepartingDate: NgbDate = new NgbDate(1999, 1, 9);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { isReturnDate: boolean; index: number; dismiss: Function; flightType: string }) {}
  
  ngOnInit(): void {
    const departingDate = this.flightSearchService.flightsArray?.at(this.data.index).get('departingD')?.value;
    const returnDate = this.flightSearchService.searchFlight.get('returnDate')?.value;

    this.departingDate = this.parseNgBootstrapDate(this.departingDate, departingDate, false);
    this.returnDate = this.parseNgBootstrapDate(this.returnDate, returnDate, false);

    this.minDepartingDate = this.calendar.getToday();
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
    if (this.data.isReturnDate) {
      this.flightSearchService.searchFlight
        .get('returnDate')
        ?.setValue(`${date.year}-${date.month.toString().padStart(2, '0')}-${date.day}`);
    } else {
      this.flightSearchService.flightsArray
        .at(this.data.index)
        ?.get('departingD')
        ?.setValue(`${date.year}-${date.month.toString().padStart(2, '0')}-${date.day}`);
    }

    if (!this.data.isReturnDate) {
      this.flightSearchService.searchFlight.get('returnDate')?.setValue('');
    }

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('form', JSON.stringify(this.flightSearchService.searchFlight.value));
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
}
