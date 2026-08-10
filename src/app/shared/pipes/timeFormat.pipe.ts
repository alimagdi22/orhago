import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const [hours, minutes] = value.split(':').map(Number);
    return `${hours}h ${minutes}m`;
  }
}
