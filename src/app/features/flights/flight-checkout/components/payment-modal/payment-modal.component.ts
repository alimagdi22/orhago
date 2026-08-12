import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../../../../shared/shared.service';
import { FlightCheckoutService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.scss',
})
export class PaymentModalComponent {
  @Input({ required: true }) isSuccess = true;

  router = inject(Router);
  sharedService = inject(SharedService);
  flightCheckoutService = inject(FlightCheckoutService);

  closeModal() {
    this.sharedService.isPaymentModalShowed = false;
    this.flightCheckoutService.paymentError = false;
  }

  goToHomePage() {
    this.closeModal();
    this.router.navigate(['/']);
  }

  placeholder() {}
}
