import { Directive, Injectable, Provider } from '@angular/core';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

@Injectable()
export class PassportExpiryDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const month = date.getMonth() + 1;
      const year = date.getFullYear().toString().slice(-2);
      return `${month < 10 ? '0' + month : month}/${year}`;
    }
    return super.format(date, displayFormat);
  }

  override parse(value: string): Date | null {
    if (value) {
      const [month, year] = value.split('/');
      return new Date(+`20${year}`, +month - 1, 1);
    }
    return null;
  }
}

export const PASSPORT_EXPIRY_DATE_FORMATS = {
  parse: {
    dateInput: 'MM/YY',
  },
  display: {
    dateInput: 'input',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Directive({
  standalone: false,
  selector: '[appPassportExpiryDate]',
  providers: [
    { provide: DateAdapter, useClass: PassportExpiryDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PASSPORT_EXPIRY_DATE_FORMATS },
  ],
})
export class PassportExpiryDateDirective {}
