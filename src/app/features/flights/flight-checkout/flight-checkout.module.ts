import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightCheckoutRoutingModule } from './flight-checkout-routing.module';
import { FlightCheckoutComponent } from './flight-checkout.component';
import { FlightInfoComponent } from './components/flight-info/flight-info.component';
import { FlightInfoDestComponent } from './components/flight-info/flight-info-dest/flight-info-dest.component';
import { FlightInfoPathComponent } from './components/flight-info/flight-info-path/flight-info-path.component';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { ContactNumberComponent } from './components/contact-info/contact-number/contact-number.component';
import { TravelerComponent } from './components/traveler/traveler.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CheckoutFooterComponent } from './components/checkout-footer/checkout-footer.component';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';

@NgModule({
  declarations: [
    FlightCheckoutComponent,
    FlightInfoComponent,
    FlightInfoDestComponent,
    FlightInfoPathComponent,
    ContactInfoComponent,
    ContactNumberComponent,
    TravelerComponent,
    CheckoutFooterComponent,
    PaymentModalComponent,
    PaymentMethodComponent,
  ],
  imports: [CommonModule, FormsModule, FlightCheckoutRoutingModule, SharedModule],
})
export class FlightCheckoutModule {}

