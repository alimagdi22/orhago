import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  standalone: false,
  name: 'hourminutee'
})
export class HourMinutePipe implements PipeTransform {
constructor(private translate: TranslateService) {}

transform(value: number): string {
  const lang = this.translate.currentLang === 'ar' ? 'ar' : 'en';
  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  return lang === 'ar' ? `${hours}س ${minutes}د` : `${hours}h ${minutes}m`;
}
}
