import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { IMainButton } from '../../models/flights/mainButton.model';

@Component({
  standalone: false,
  selector: 'app-secondary-button',
  templateUrl: './secondary-button.component.html',
  styleUrl: './secondary-button.component.scss',
})
export class SecondaryButtonComponent {
  @Input({ required: true }) title = 'Secondary Button';
  @Input({ required: true }) secondaryButtonInfo: IMainButton = {
    height: '20px',
    borderRadius: '6px',
    fontSize:'16px',
    padding:'10px'
  };
  @Input() isLoading = false;

  // Add mobile-specific styles input
  @Input() mobileStyles: Partial<IMainButton> = {};

  @Output() clickSecondaryButton = new EventEmitter<null>();

  isMobile = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  get computedStyles() {
    return this.isMobile
      ? { ...this.secondaryButtonInfo, ...this.mobileStyles }
      : this.secondaryButtonInfo;
  }

  onClick(e: Event) {
    e.preventDefault();
    this.clickSecondaryButton.emit(null);
  }
}
