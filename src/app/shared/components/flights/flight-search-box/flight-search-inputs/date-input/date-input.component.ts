import { Component, ElementRef, inject, Input, OnChanges, OnInit, output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { FlightSearchService } from 'rp-travel-ui';
import { SharedService } from '../../../../../shared.service';
import { AbstractControl } from '@angular/forms';
import { MobileViewDateInputComponent } from './mobile-view-date-input/mobile-view-date-input.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.scss'
})
export class DateInputComponent implements OnChanges, OnInit {
  @Input({required: true}) flightType = '';
  @Input({required: true}) index = -1;
  @Input({required: true}) isReturnDateSelected = false;
  @Input() openCalendar = 0;

  openRoundTripCalendar = output<void>();
  openCabinMenu = output<void>();

  @ViewChild('calenderTrigger') calenderTrigger!: ElementRef;
  @ViewChild('datePicker') datePicker?: NgbDatepicker;

  calendar = inject(NgbCalendar);
  flightSearchService = inject(FlightSearchService);
  sharedService = inject(SharedService);
  translate = inject(TranslateService);
  
  minDate = this.calendar.getToday();
  departDate: NgbDate | null = null;
  calendarStart: NgbDate = this.calendar.getToday();

  startDateValue: any;
  endDateValue: Date = new Date(2023, 9, 30);
  hoveredDate: NgbDate | null = null;

  constructor(private dialog: MatDialog) {}
  
  ngOnInit(): void {
    this.refreshCalendarBounds();
  }
  
  ngOnChanges(simpleChanges: SimpleChanges): void {
    if(this.openCalendar && !simpleChanges['openCalendar']?.firstChange && this.flightType !== 'multi-city') {
      this.refreshCalendarBounds();
      this.calenderTrigger.nativeElement?.click();
    }
  }

  prepareCalendar(): void {
    this.refreshCalendarBounds();
  }

  onCalendarOpened(): void {
    if (!this.isReturnDateSelected || !this.departDate) return;
    setTimeout(() => this.datePicker?.navigateTo(this.departDate!));
  }
  
  closeCalendar(e: Event) {
    e.stopPropagation();
    this.calenderTrigger.nativeElement?.click();
  }

    onDateSelection(date: NgbDate, index: number) {
      if (this.isDayDisabled(date)) return;

      if (this.isReturnDateSelected) {
        this.flightSearchService.searchFlight.get('returnDate')?.setValue(new Date(date.year, date.month - 1, date.day));
        this.openCabinMenu.emit();
        return;
      }
  
      this.flightSearchService.flightsArray
        .at(index)
        .get('departingD')
        ?.setValue(new Date(date.year, date.month - 1, date.day));
  
      this.departDate = this.generateCalendarDate(
        this.flightSearchService.flightsArray.at(index).get('departingD')?.value,
      );

      this.hoveredDate = null;
  
      if (this.flightType === 'one-way') {
        this.openCabinMenu.emit();
      }
  
      if (this.flightType === 'round-trip') {
        this.flightSearchService.searchFlight.get('returnDate')?.setValue(null);
        this.openRoundTripCalendar.emit();
      }

      if (this.flightType === 'multi-city') {
        this.multiCityDateChecker(index);
        // this.openCabinMenu.emit();
      };
    }

    generateCalendarDate(dateArg: string | Date | null | undefined): NgbDate | null {
      return this.toNgbDate(dateArg);
    }

    private refreshCalendarBounds(): void {
      const raw =
        this.flightSearchService.flightsArray.at(0)?.get('departingD')?.value ??
        this.flightSearchService.flightsArray.at(this.index)?.get('departingD')?.value;
      const departure = this.toNgbDate(raw);
      this.departDate = departure;
      this.calendarStart = this.isReturnDateSelected && departure ? departure : departure || this.calendar.getToday();
    }

    private toNgbDate(value: unknown): NgbDate | null {
      if (!value) return null;
      const date = value instanceof Date ? value : new Date(value as string);
      if (Number.isNaN(date.getTime())) return null;
      return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    multiCityDateChecker(curIndex: number) {
      let isDateInvalide = false;
  
      for (let i = 0; i < this.flightSearchService.flightsArray.length; i++) {
        if (isDateInvalide) {
          this.flightSearchService.flightsArray.at(i).get('departingD')?.setValue('');
          this.flightSearchService.flightsArray.at(i).get('departingD')?.markAsTouched();
          continue;
        }
  
        let preDate: string | Date = '';
        let curDate: string | Date = this.flightSearchService.flightsArray.at(i).get('departingD')?.value;
        let nxtDate: string | Date = '';
  
        if (i) {
          preDate = this.flightSearchService.flightsArray.at(i - 1).get('departingD')?.value;
        } else {
          preDate = 'value';
        }
  
        if (i !== this.flightSearchService.flightsArray.length - 1) {
          nxtDate = this.flightSearchService.flightsArray.at(i + 1).get('departingD')?.value;
        } else {
          nxtDate = 'value';
        }
  
        if (!preDate && i <= curIndex) {
          i--;
          isDateInvalide = true;
          this.sharedService.showErrorSheet('You should select previous date');
          continue;
        }
  
        curDate = new Date(curDate);
        nxtDate = new Date(nxtDate);
  
        if (curDate >= nxtDate) {
          this.sharedService.showErrorSheet('Can not select date before last trip');
          isDateInvalide = true;
        }
      }
    }

    isDepartSelected(date: NgbDate, index: number) {
      const departingDate = this.generateCalendarDate(
        this.flightSearchService.flightsArray.at(index).get('departingD')?.value,
      );
      if (!departingDate) return false;

      return date.equals(departingDate);
    }

    isDayDisabled(date: NgbDate): boolean {
      if (this.isReturnDateSelected && this.departDate) {
        return date.before(this.departDate);
      }
      return date.before(this.minDate);
    }

    isHovered(date: NgbDate) {
      return this.startDateValue && date.after(this.startDateValue) && date.before(this.startDateValue);
    }
  
    isRange(date: NgbDate) {
      const departingDate = this.generateCalendarDate(
        this.flightSearchService.flightsArray.at(0).get('departingD')?.value,
      );
      if (!departingDate || !this.hoveredDate) return false;

      return date.after(departingDate) && date.before(this.hoveredDate);
    }
  
    isReturnSelected(date: NgbDate) {
      const returnDate = this.generateCalendarDate(this.flightSearchService.searchFlight.get('returnDate')?.value);
      if (!returnDate) return false;

      return date.equals(returnDate);
    }

      onClickInput(index: number) {
        if(this.sharedService.screenWidth >= 1200) {
          return
        }
        
        this.dialog.open(MobileViewDateInputComponent, {
          data: {
            dismiss: () => this.dialog.closeAll(),
            isReturnDate: this.isReturnDateSelected,
            flightType: this.flightType,
            index
          },
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          hasBackdrop: true
        });
      }
}
