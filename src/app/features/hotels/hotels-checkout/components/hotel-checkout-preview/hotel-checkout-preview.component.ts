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
  public sharedService = inject(SharedService)
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
}
