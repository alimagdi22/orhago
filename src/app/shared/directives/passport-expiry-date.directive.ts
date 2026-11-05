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

  constructor() {
    super();
    this.setLocale('en-US-u-nu-latn');
  }

  override parse(value: string): Date | null {
    if (value) {
      const normalized = value.replace(/[٠-٩۰-۹]/g, (digit) => {
        const arabic = '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹';
        return String(arabic.indexOf(digit) % 10);
      });
      const [month, year] = normalized.split('/');
      const parsedYear = Number(String(year).replace(/\D/g, ''));
      const fullYear = parsedYear < 100 ? 2000 + parsedYear : parsedYear;
      return new Date(fullYear, Number(month) - 1, 1);
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
