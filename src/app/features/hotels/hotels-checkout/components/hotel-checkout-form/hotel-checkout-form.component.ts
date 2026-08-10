import { SharedService } from './../../../../../shared/shared.service';
import { Component, inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { CountryISO } from 'ngx-intl-tel-input-gg';
import { HotelCheckoutService } from 'rp-hotels-ui';

@Component({
  standalone: false,
  selector: 'app-hotel-checkout-form',
  templateUrl: './hotel-checkout-form.component.html',
  styleUrl: './hotel-checkout-form.component.scss',
  host: {
    style: 'background-color: #FAFAFA; border-radius: 12px'
  }
})
export class HotelCheckoutFormComponent {
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
