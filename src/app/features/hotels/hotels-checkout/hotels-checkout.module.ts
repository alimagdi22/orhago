import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotelsCheckoutRoutingModule } from './hotels-checkout-routing.module';
import { HotelsCheckoutComponent } from './hotels-checkout.component';
import { SharedModule } from '../../../shared/shared.module';
import { HotelCheckoutPreviewComponent } from './components/hotel-checkout-preview/hotel-checkout-preview.component';
import { HotelCheckoutFormComponent } from './components/hotel-checkout-form/hotel-checkout-form.component';
import { HotelsCheckoutFormAppComponent } from './components/hotels-checkout-form-app/hotels-checkout-form-app.component';import { HotelsRoomsModule } from '../hotels-rooms/hotels-rooms.module';


@NgModule({
  declarations: [
    HotelsCheckoutComponent,
    HotelCheckoutPreviewComponent,
    HotelCheckoutFormComponent,
    HotelsCheckoutFormAppComponent
  ],
  imports: [
    CommonModule,
    HotelsCheckoutRoutingModule,
    SharedModule,
    HotelsRoomsModule
  ]
})
export class HotelsCheckoutModule { }
