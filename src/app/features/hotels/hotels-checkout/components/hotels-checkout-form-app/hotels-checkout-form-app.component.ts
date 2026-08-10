import { Component, inject } from '@angular/core';
import { HotelCheckoutService } from 'rp-hotels-ui';
import { SharedService } from '../../../../../shared/shared.service';
import { CountryISO } from 'ngx-intl-tel-input-gg';

@Component({
  standalone: false,
  selector: 'app-hotels-checkout-form-app',
  templateUrl: './hotels-checkout-form-app.component.html',
  styleUrl: './hotels-checkout-form-app.component.scss',
    host: {
    style: 'background-color: #FAFAFA; border-radius: 12px'
  }
})
export class HotelsCheckoutFormAppComponent {
private hotelCheckoutService = inject(HotelCheckoutService);
  private sharedService = inject(SharedService);

  public titles = ['Mr', 'Ms', 'Mrs'];
  public CountryISO = CountryISO;

  checkHotelPhoneNumberValidation() {
    this.sharedService.checkHotelPhoneNumberValidation();
  }

  get guestsControllers() {
    return this.hotelCheckoutService.Travellers.controls;
  }

  get hotelForm() {
    return this.hotelCheckoutService.HotelForm;
  }

  get isHotelPhoneNumberInvalid() {
    return this.sharedService.isHotelPhoneNumberInvalid;
  }
}
