import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  standalone: false,
  name: 'currencyLabel',
  pure: false,
})
export class CurrencyLabelPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(code: string | null | undefined): string {
    if (!code) return '';

    const value = String(code).trim();
    if (this.translate.currentLang !== 'ar') return value;

    const key = `currencies.${value}`;
    const translated = this.translate.instant(key);
    return translated && translated !== key ? translated : value;
  }
}
