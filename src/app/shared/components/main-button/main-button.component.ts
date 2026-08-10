import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { IMainButton } from '../../models/flights/mainButton.model';
import { SharedService } from '../../shared.service';

@Component({
  standalone: false,
  selector: 'app-main-button',
  templateUrl: './main-button.component.html',
  styleUrl: './main-button.component.scss',
})
export class MainButtonComponent {
   sharedService = inject(SharedService);
  @Input({ required: true }) title = 'Main Button';
  @Input({ required: true }) mainButtonInfo: IMainButton = {
    height: '48px',
    width: '100%',
    borderRadius: '6px',
    padding:'0'
  };

  @Input() mobileStyles: Partial<IMainButton> = {};

  @Input() isLoading = false;
  @Input() isDisibled = false;

  @Output() clickMainButton = new EventEmitter<null>();

  isMobile = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  get computedStyles() {
    return this.isMobile
      ? { ...this.mainButtonInfo, ...this.mobileStyles }
      : this.mainButtonInfo;
  }

  onClick(e: Event) {
    e.stopPropagation();
    this.clickMainButton.emit(null);
  }
}
