import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-refundability',
  templateUrl: './refundability.component.html',
  styleUrl: './refundability.component.scss',
})
export class RefundabilityComponent {
  @Input({ required: true }) isRefundable = true;
}
