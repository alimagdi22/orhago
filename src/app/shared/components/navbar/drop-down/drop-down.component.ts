import { animate, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { UserProfileService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [style({ opacity: 0 }), animate('150ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('150ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class DropDownComponent {
  alertTrigger = false;
  userProfileService = inject(UserProfileService);
  private document = inject(DOCUMENT);

  get userName() {
    return this.userProfileService.user.firstName + ' ' + this.userProfileService.user.lastName;
  }

  get menuXPosition(): 'before' | 'after' {
    return this.document.documentElement.dir === 'rtl' ? 'after' : 'before';
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) this.alertTrigger = false;
  }
}
