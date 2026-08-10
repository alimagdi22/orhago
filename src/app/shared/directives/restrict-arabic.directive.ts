import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  standalone: false,
  selector: '[restrictArabic]',
})
export class RestrictArabicDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filteredValue = input.value.replace(/[\u0600-\u06FF\u0750-\u077F]/g, ''); // Remove Arabic characters
    this.ngControl.control?.setValue(filteredValue);
  }
}
