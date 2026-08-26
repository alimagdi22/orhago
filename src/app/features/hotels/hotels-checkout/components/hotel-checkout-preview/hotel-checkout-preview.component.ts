import { Component, inject, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HotelCheckoutService } from 'rp-hotels-ui';
import { SharedService } from '../../../../../shared/shared.service';

@Component({
  standalone: false,
  selector: 'app-hotel-checkout-preview',
  templateUrl: './hotel-checkout-preview.component.html',
  styleUrl: './hotel-checkout-preview.component.scss',
  host: {
    class: 'row',
    style: 'background-color: #FAFAFA; border-radius: 12px'
  }
})
export class HotelCheckoutPreviewComponent implements OnInit {
  @Input({ required: true }) nights: string | number = 0;

  private hotelCheckoutService = inject(HotelCheckoutService);
  private translateService = inject(TranslateService);
  public sharedService = inject(SharedService);

  ngOnInit(): void {
    const isCurrentLangEnglish = this.translateService.currentLang === 'en';

    this.nights = +this.nights > 1 ?
    `${this.nights} ${isCurrentLangEnglish ? 'nights' : 'ليالي'}` :
    `${this.nights} ${isCurrentLangEnglish ? 'night' : 'ليله'}`;
  }

  get hotelResults() {
    return this.hotelCheckoutService.HotelResult;
  }

  get hotel() {
    return this.hotelCheckoutService.RequiredHotel;
  }

  get rooms() {
    return this.hotelCheckoutService.HotelResult;
  }

  get cancellationRules(): any[] {
    const room0 = this.hotel?.Package?.Rooms?.[0] as any;
    if (!room0) return [];
    return (
      room0.cancellationRules ||
      room0.CancellationRules ||
      room0.CancelPolicies ||
      room0.cancelPolicies ||
      (this.hotel?.Package as any)?.cancellationRules ||
      (this.hotel?.Package as any)?.CancellationRules ||
      []
    );
  }

  isFreeCancellation(rule: any): boolean {
    if (!rule) return true;
    const price = rule.Price ?? rule.price;
    const cost = rule.Cost ?? rule.cost;
    if ((price !== undefined && price !== null && +price > 0) || (cost !== undefined && cost !== null && +cost > 0) || rule.IsCancelRestricted) {
      return false;
    }
    return true;
  }
}
