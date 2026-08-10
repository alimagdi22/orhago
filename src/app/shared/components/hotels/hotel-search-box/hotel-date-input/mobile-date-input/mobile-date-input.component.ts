import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  standalone: false,
  selector: 'app-mobile-date-input',
  templateUrl: './mobile-date-input.component.html',
  styleUrls: ['./mobile-date-input.component.scss'],
  providers: [DatePipe]
})
export class MobileDateInputComponent implements OnInit {
  today = new Date();
  minCheckoutDate = new Date();
  maxDate = new Date();
  currentCalendar: 'checkIn' | 'checkOut' = 'checkIn';
  currentLang = 'en';

  todayNgb: NgbDateStruct;
  minCheckoutDateNgb: NgbDateStruct;
  maxDateNgb: NgbDateStruct;
  checkInNgb: NgbDateStruct;
  checkOutNgb: NgbDateStruct;
  selectedCheckIn: NgbDateStruct;
  selectedCheckOut: NgbDateStruct;

  constructor(
    public dialogRef: MatDialogRef<MobileDateInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe
  ) {
    this.today = data.today;
    this.minCheckoutDate = data.minCheckoutDate;
    this.maxDate = data.maxDate;
    this.currentCalendar = data.calendarType;
    this.currentLang = data.currentLang;

    this.todayNgb = this.convertToNgbDate(this.today);
    this.minCheckoutDateNgb = this.convertToNgbDate(this.minCheckoutDate);
    this.maxDateNgb = this.convertToNgbDate(this.maxDate);
    this.checkInNgb = this.convertToNgbDate(new Date(data.checkIn));
    this.checkOutNgb = this.convertToNgbDate(new Date(data.checkOut));
    this.selectedCheckIn = this.checkInNgb;
    this.selectedCheckOut = this.checkOutNgb;
  }

  ngOnInit(): void {
    const checkInDate = new Date(this.data.checkIn);
    const nextDay = new Date(checkInDate);
    nextDay.setDate(checkInDate.getDate() + 1);
    this.minCheckoutDate = nextDay;
    this.minCheckoutDateNgb = this.convertToNgbDate(nextDay);
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

  onDateSelect(pickerType: 'checkIn' | 'checkOut', date: NgbDate): void {
    const selectedDate = this.convertToDate(date);

    if (pickerType === 'checkIn') {
      this.checkInNgb = date;
      this.selectedCheckIn = date;

      // Update min checkout date
      const nextDay = new Date(selectedDate);
      nextDay.setDate(selectedDate.getDate() + 1);
      this.minCheckoutDate = nextDay;
      this.minCheckoutDateNgb = this.convertToNgbDate(nextDay);

      this.dialogRef.close({
        checkIn: this.convertToDate(this.checkInNgb),
        checkOut: this.convertToDate(this.checkOutNgb)
      });

    } else {
      this.checkOutNgb = date;
      this.selectedCheckOut = date;

      this.dialogRef.close({
        checkIn: this.convertToDate(this.checkInNgb),
        checkOut: this.convertToDate(this.checkOutNgb)
      });
    }
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
}
