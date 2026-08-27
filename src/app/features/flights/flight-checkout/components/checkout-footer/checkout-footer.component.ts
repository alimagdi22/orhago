import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FlightCheckoutService, FlightResultService } from 'rp-travel-ui';
import { IMainButton } from '../../../../../shared/models/flights/mainButton.model';
import { SharedService } from '../../../../../shared/shared.service';

@Component({
  standalone: false,
  selector: 'app-checkout-footer',
  templateUrl: './checkout-footer.component.html',
  styleUrl: './checkout-footer.component.scss',
})
export class CheckoutFooterComponent {
  @Output() choseService = new EventEmitter<null>();

  flightCheckoutService = inject(FlightCheckoutService);
  flightResultService = inject(FlightResultService);
  totalPrice = '';

  sharedService = inject(SharedService);

  /* Button Properties */
  payWithServiceButton: IMainButton = {
    height: '48px',
    width: 'none',
    borderRadius: '12px',
    backgroundColor:'#70e879'
  };

  payWithoutServiceButton: IMainButton = {
    height: '48px',
    width: 'none',
    borderRadius: '12px',
  };
  processToPayment: IMainButton = {
    height: '48px',
    width: 'none',
    borderRadius: '12px',
  };

  onClick(isWhatsappService: boolean) {
    if (this.flightCheckoutService.usersArray.invalid) {
      for (var i = 0; i < this.flightCheckoutService.usersArray.length; i++) {
        if (this.flightCheckoutService.usersArray.at(i)?.invalid) {
          const element = document.getElementById(i.toString());
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            element.click();
          }

          this.flightCheckoutService.usersArray.at(i).markAllAsTouched();
          this.choseService.emit(null);
          break;
        }
      }
    } else {
      if (this.flightCheckoutService.organizedOfllineServices.length) {
        this.flightCheckoutService.removeOfflineService(this.flightCheckoutService.organizedOfllineServices[2]);
      }

      if (isWhatsappService) {
        this.flightCheckoutService.addOfflineService(this.flightCheckoutService.organizedOfllineServices[2]);
      }

      this.sharedService.users = this.flightCheckoutService.usersArray.value;
      this.sharedService.goToNextCheckoutStep();
    }
  }
}
