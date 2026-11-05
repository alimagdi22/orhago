import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

const UNIT_REPLACEMENTS: [RegExp, string][] = [
  [/\bkilograms?\b/gi, 'كجم'],
  [/(?<![a-zA-Z])kgs?\b/gi, 'كجم'],
  [/\bpieces?\b/gi, 'قطعة'],
  [/(?<![a-zA-Z])pcs?\b/gi, 'قطعة'],
  [/ساعات/g, 'س'],
  [/ساعة/g, 'س'],
  [/دقائق/g, 'د'],
  [/دقيقة/g, 'د'],
  [/(?<![a-zA-Z])h\b/gi, 'س'],
  [/(?<![a-zA-Z])m\b/gi, 'د'],
];

@Pipe({
  standalone: false,
  name: 'arabicNumber',
  pure: false,
})
export class ArabicNumberPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';

    let text = String(value);
    if (this.translate.currentLang !== 'ar') return text;

    UNIT_REPLACEMENTS.forEach(([pattern, unit]) => {
      text = text.replace(pattern, unit);
    });

    return text.replace(/\d/g, (digit) => ARABIC_DIGITS[Number(digit)]);
  }
}
