import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FlightCheckoutService } from 'rp-travel-ui';
import { SharedService } from '../../shared.service';

@Component({
  standalone: false,
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrl: './payment-view.component.scss',
})
export class PaymentViewComponent implements OnInit {
  @ViewChild('paymentIframe') paymentIframe!: ElementRef;
  public flightCheckoutService = inject(FlightCheckoutService);

  sharedService = inject(SharedService);

  iframeLoader = true;

  ngOnInit() {
    window.addEventListener('message', (event) => {
      if (event.data && event.data.message === 'loader_ended') {
        // Handle loader end in the Traveling Project
        this.sharedService.showPayment = true;
        this.sharedService.isIframeLoading = false;
        // Perform actions like enabling buttons, showing messages, etc.
      } else if (event.data && event.data.message === 'error') {
        this.sharedService.isPaymentModalShowed = true;
      }
    });
  }
}
