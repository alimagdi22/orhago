import { SharedService } from './../../../../../shared/shared.service';
import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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
