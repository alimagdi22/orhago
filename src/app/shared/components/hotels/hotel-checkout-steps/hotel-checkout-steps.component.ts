import { Component, inject, Input } from '@angular/core';
import { SharedService } from '../../../shared.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-hotel-checkout-steps',
  templateUrl: './hotel-checkout-steps.component.html',
  styleUrl: './hotel-checkout-steps.component.scss',
})
export class HotelCheckoutStepsComponent {
  @Input() isScrolled = false;
  sharedService = inject(SharedService);
  translateService = inject(TranslateService);

  get step(): number {
    if (this.sharedService.isSegmentPresent(['hotels-confirmation', 'hotel-confirmation'])) {
      return 3;
    }
    if (this.sharedService.isSegmentPresent(['hotels-checkout', 'hotel-checkout'])) {
      return 2;
    }
    if (this.sharedService.isSegmentPresent(['hotels-rooms', 'hotel-rooms'])) {
      return 1;
    }
    return 1;
  }
}
