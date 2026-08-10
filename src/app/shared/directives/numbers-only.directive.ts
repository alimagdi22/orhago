import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  standalone: false,
  selector: '[numbersOnly]',
})
export class NumbersOnlyDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    const numericValue = input.value.replace(/[^0-9]/g, '');
    if (input.value !== numericValue) {
      this.ngControl.control?.setValue(numericValue);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Allow navigation keys
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (allowedKeys.includes(event.key)) {
      return;
    }
    // Block non-numeric input
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
