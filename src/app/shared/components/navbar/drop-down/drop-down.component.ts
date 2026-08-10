import { animate, style, transition, trigger } from '@angular/animations';
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

  get userName() {
    return this.userProfileService.user.firstName + ' ' + this.userProfileService.user.lastName;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) this.alertTrigger = false;
  }
}
