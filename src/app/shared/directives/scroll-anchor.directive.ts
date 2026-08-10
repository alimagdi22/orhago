import { Directive, Host, HostListener, Input, Optional } from '@angular/core';
import { ScrollManagerDirective } from './scroll-manager.directive';

@Directive({
  standalone: false,
  selector: '[appScrollAnchor]',
})
export class ScrollAnchorDirective {
  @Input('appScrollAnchor') id: string | number = '';

  constructor(@Optional() @Host() private manager: ScrollManagerDirective) {}

  @HostListener('click')
  scroll() {
    this.manager.scroll(this.id);
  }
}
