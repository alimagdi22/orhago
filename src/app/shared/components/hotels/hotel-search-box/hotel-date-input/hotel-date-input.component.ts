import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { HotelSearchService } from 'rp-hotels-ui';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MobileDateInputComponent } from './mobile-date-input/mobile-date-input.component';
import { SharedService } from '../../../../shared.service';

@Component({
  standalone: false,
  selector: 'app-hotel-date-input',
  templateUrl: './hotel-date-input.component.html',
  styleUrls: ['./hotel-date-input.component.scss'],
  providers: [DatePipe]
})
export class HotelDateInputComponent implements OnInit {
  @ViewChild('dateGroupRef', { static: false }) dateGroupRef!: ElementRef<HTMLDivElement>;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  hotelSearchService = inject(HotelSearchService);
  translate = inject(TranslateService);
  datePipe = inject(DatePipe);
  dialog = inject(MatDialog);
  public sharedService = inject(SharedService);

  searchForm!: FormGroup;
  currentLang = this.translate.currentLang;
  showValidationErrors = false;
  dateTouched = false;
  currentCalendar: 'checkIn' | 'checkOut' = 'checkIn';

  today = new Date();
  minCheckoutDate = new Date();
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  // NgbDate versions of dates with proper initialization
  todayNgb: NgbDateStruct;
  minCheckoutDateNgb: NgbDateStruct;
  maxDateNgb: NgbDateStruct;
  checkInNgb: NgbDateStruct;
  checkOutNgb: NgbDateStruct;
  selectedCheckIn: NgbDateStruct;
  selectedCheckOut: NgbDateStruct;

  constructor() {
    this.todayNgb = this.convertToNgbDate(this.today);
    this.minCheckoutDateNgb = this.convertToNgbDate(this.minCheckoutDate);
    this.maxDateNgb = this.convertToNgbDate(this.maxDate);
    this.checkInNgb = this.todayNgb;
    this.checkOutNgb = this.minCheckoutDateNgb;
    this.selectedCheckIn = this.todayNgb;
    this.selectedCheckOut = this.minCheckoutDateNgb;
  }

  ngOnInit(): void {
    this.searchForm = this.hotelSearchService.HotelSearchForm;
    this.minCheckoutDate.setDate(this.today.getDate() + 1);
    this.minCheckoutDateNgb = this.convertToNgbDate(this.minCheckoutDate);
    this.setCachedDateInput();
  }

  setCachedDateInput(): void {
    const hotelForm = (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('hotelSearchFormData') : null);

    if (hotelForm) {
      try {
        const parsedForm = JSON.parse(hotelForm);

        if (parsedForm.checkIn) {
          const checkInDate = new Date(parsedForm.checkIn);
          this.checkInControl.setValue(checkInDate);
          this.checkInNgb = this.convertToNgbDate(checkInDate);
          this.selectedCheckIn = this.checkInNgb;
        }

        if (parsedForm.checkOut) {
          const checkOutDate = new Date(parsedForm.checkOut);
          this.checkOutControl.setValue(checkOutDate);
          this.checkOutNgb = this.convertToNgbDate(checkOutDate);
          this.selectedCheckOut = this.checkOutNgb;
        }
      } catch (e) {
        console.error('Error parsing cached data:', e);
      }
    }
  }

  get checkInControl(): FormControl {
    return this.searchForm.get('checkIn') as FormControl;
  }

  get checkOutControl(): FormControl {
    return this.searchForm.get('checkOut') as FormControl;
  }

  convertToNgbDate(date: Date): NgbDateStruct {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  convertToDate(ngbDate: NgbDateStruct): Date {
    return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
  }

  openDatePicker(calendarType: 'checkIn' | 'checkOut', event: MouseEvent): void {
    event.stopPropagation();

    if (this.isMobile()) {
      this.openCalendarDialog(calendarType);
      return;
    }

    this.currentCalendar = calendarType;

    // Update selected dates from form controls
    if (this.checkInControl.value) {
      this.selectedCheckIn = this.convertToNgbDate(new Date(this.checkInControl.value));
    }
    if (this.checkOutControl.value) {
      this.selectedCheckOut = this.convertToNgbDate(new Date(this.checkOutControl.value));
    }

    // Update min checkout date
    if (this.checkInControl.value) {
      const checkInDate = new Date(this.checkInControl.value);
      const nextDay = new Date(checkInDate);
      nextDay.setDate(checkInDate.getDate() + 1);
      this.minCheckoutDate = nextDay;
      this.minCheckoutDateNgb = this.convertToNgbDate(nextDay);
    }

    // Open the menu if not already open
    if (!this.menuTrigger.menuOpen) {
      this.menuTrigger.openMenu();
    }
  }

  onMenuClosed(): void {
    // Reset to checkIn calendar when menu closes
    this.currentCalendar = 'checkIn';
  }

  openCalendarDialog(calendarType: 'checkIn' | 'checkOut'): void {
    const dialogRef = this.dialog.open(MobileDateInputComponent, {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      panelClass: 'calendar-dialog',
      data: {
        checkIn: this.checkInControl.value,
        checkOut: this.checkOutControl.value,
        today: this.today,
        minCheckoutDate: this.minCheckoutDate,
        maxDate: this.maxDate,
        calendarType: calendarType,
        currentLang: this.currentLang
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.checkIn) {
          this.checkInControl.setValue(result.checkIn);
        }
        if (result.checkOut) {
          this.checkOutControl.setValue(result.checkOut);
        }
        this.validateDates();
        this.showValidationErrors = true;
        this.dateTouched = true;
      }
    });
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  onDateSelect(pickerType: 'checkIn' | 'checkOut', date: NgbDate): void {
    const selectedDate = this.convertToDate(date);

    if (pickerType === 'checkIn') {
      this.checkInControl.setValue(selectedDate);
      this.checkInNgb = date;

      // Update min checkout date
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);
      this.minCheckoutDate = nextDay;
      this.minCheckoutDateNgb = this.convertToNgbDate(nextDay);

      // If current checkout is before new min date, update it
      if (this.checkOutControl.value && new Date(this.checkOutControl.value) < nextDay) {
        this.checkOutControl.setValue(nextDay);
        this.checkOutNgb = this.minCheckoutDateNgb;
        this.selectedCheckOut = this.minCheckoutDateNgb;
      }

      // Switch to check-out calendar
      this.currentCalendar = 'checkOut';
    } else {
      this.checkOutControl.setValue(selectedDate);
      this.checkOutNgb = date;

      // Close the menu after selection
      setTimeout(() => this.menuTrigger.closeMenu(), 300);
    }

    this.validateDates();
    this.showValidationErrors = true;
    this.dateTouched = true;
  }

  // Date highlighting methods with proper null checks
  isCheckInDate(date: NgbDateStruct): boolean {
      if (!this.checkInNgb) return false;
      const checkInDate = new NgbDate(this.checkInNgb.year, this.checkInNgb.month, this.checkInNgb.day);
      const currentDate = new NgbDate(date.year, date.month, date.day);
      return checkInDate.equals(currentDate);
  }

  isCheckOutDate(date: NgbDateStruct): boolean {
      if (!this.checkOutNgb) return false;
      const checkOutDate = new NgbDate(this.checkOutNgb.year, this.checkOutNgb.month, this.checkOutNgb.day);
      const currentDate = new NgbDate(date.year, date.month, date.day);
      return checkOutDate.equals(currentDate);
  }

  isSelectedDate(date: NgbDateStruct): boolean {
    return this.isCheckInDate(date) || this.isCheckOutDate(date);
  }

  isInRange(date: NgbDateStruct): boolean {
    if (!this.checkInNgb || !this.checkOutNgb) return false;

    const current = new Date(date.year, date.month - 1, date.day);
    const checkInDate = this.convertToDate(this.checkInNgb);
    const checkOutDate = this.convertToDate(this.checkOutNgb);

    return current > checkInDate && current < checkOutDate;
  }

  validateDates(): void {
    const checkIn = this.checkInControl.value ? new Date(this.checkInControl.value) : null;
    const checkOut = this.checkOutControl.value ? new Date(this.checkOutControl.value) : null;

    // Required validation
    if (!checkIn) {
      this.checkInControl.setErrors({ required: true });
    } else {
      this.checkInControl.setErrors(null);
    }

    if (!checkOut) {
      this.checkOutControl.setErrors({ required: true });
    } else {
      this.checkOutControl.setErrors(null);
    }

    // Date range validation
    if (checkIn && checkOut) {
      if (checkIn >= checkOut) {
        this.checkOutControl.setErrors({ invalidDateRange: true });
      } else if (this.checkOutControl.hasError('invalidDateRange')) {
        this.checkOutControl.setErrors(null);
      }
    }
  }

  get checkInInvalid(): boolean {
    return (this.checkInControl.invalid && (this.checkInControl.touched || this.showValidationErrors)) ||
           (this.dateTouched && !this.checkInControl.value);
  }

  get checkOutInvalid(): boolean {
    return (this.checkOutControl.invalid && (this.checkOutControl.touched || this.showValidationErrors)) ||
           (this.dateTouched && !this.checkOutControl.value);
  }
}
