import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrl: './payment-modal.component.scss',
})
export class PaymentModalComponent {
  @Input({ required: true }) isSuccess = true;

  router = inject(Router);

  goToHomePage() {
    this.router.navigate(['/']);
  }

  placeholder() {}
}
