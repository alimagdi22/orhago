import { Component, inject } from '@angular/core';
import { FlightCheckoutService } from 'rp-travel-ui';
import { SharedService } from '../../../../../shared/shared.service';

@Component({
  standalone: false,
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss',
})
export class ContactInfoComponent {
  sharedService = inject(SharedService);
  flightCheckout = inject(FlightCheckoutService);
}
