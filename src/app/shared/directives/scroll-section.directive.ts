import { Directive, ElementRef, Host, Input, Optional } from '@angular/core';
import { ScrollManagerDirective } from './scroll-manager.directive';

@Directive({
  standalone: false,
  selector: '[appScrollSection]',
})
export class ScrollSectionDirective {
  @Input('appScrollSection') id: string | number = '';

  constructor(
    private host: ElementRef<HTMLElement>,
    @Optional() @Host() private manager: ScrollManagerDirective,
  ) {}

  ngOnInit() {
    this.manager.register(this);
  }

  ngOnDestroy() {
    this.manager.remove(this);
  }

  scroll() {
    this.host.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
