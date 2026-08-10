import { style } from '@angular/animations';
import { Component, inject, Input } from '@angular/core';
import { HomePageService } from 'rp-hotels-ui';
import { SharedService } from '../../../shared.service';

@Component({
  standalone: false,
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrl: './payment-summary.component.scss',
  host: {
    class: 'row',
  }
})
export class PaymentSummaryComponent {
  @Input({ required: true }) totalPrice = 0;
  public sharedService = inject(SharedService)
  private homeService = inject(HomePageService);

  get currency() {
    return this.homeService.selectedCurrency.Currency_Code;
  }
}
