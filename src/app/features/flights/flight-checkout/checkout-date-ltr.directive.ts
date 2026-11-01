import { Directionality } from '@angular/cdk/bidi';
import { Directive, EventEmitter, Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹';

function latinDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit) % 10));
}

@Directive({
  selector: '[checkoutDateLtr]',
  standalone: false,
  providers: [{ provide: Directionality, useExisting: CheckoutDateLtrDirective }],
})
export class CheckoutDateLtrDirective extends Directionality {
  override readonly change = new EventEmitter<'ltr' | 'rtl'>();
  override value: 'ltr' | 'rtl' = 'ltr';
}

@Injectable()
export class CheckoutDateAdapter extends NativeDateAdapter {
  constructor() {
    super();
    this.setLocale('en-US-u-nu-latn');
  }

  override parse(value: unknown): Date | null {
    return super.parse(typeof value === 'string' ? latinDigits(value) : value);
  }

  override format(date: Date, displayFormat: object): string {
    return latinDigits(super.format(date, displayFormat));
  }
}
