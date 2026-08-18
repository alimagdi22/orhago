import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    const travellers = this.hotelCheckoutService.Travellers;
    if (travellers && travellers.controls && travellers.controls.length > 0) {
      for (let i = 0; i < travellers.controls.length; i++) {
        const group = travellers.controls[i] as FormGroup;
        if (group && !group.contains('specialRequest')) {
          group.addControl('specialRequest', new FormControl(''), { emitEvent: false });
        }
        if (group && !group.contains('phonenum')) {
          group.addControl('phonenum', new FormControl(''), { emitEvent: false });
        }
      }
      return travellers.controls;
    }
    return [];
  }

  get hasPhonenumControl(): boolean {
    const travellers = this.hotelCheckoutService.Travellers;
    return !!(travellers && travellers.length > 0 && travellers.at(0)?.get('phonenum'));
  }

  get hotelForm() {
    return this.hotelCheckoutService.HotelForm;
  }

  get isHotelPhoneNumberInvalid() {
    return this.sharedService.isHotelPhoneNumberInvalid;
  }
}
