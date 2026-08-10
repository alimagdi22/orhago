import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { FlightDealsComponent } from './components/flight-deals/flight-deals.component';
import { HotelDealsComponent } from './components/hotel-deals/hotel-deals.component';
import { AppAdComponent } from './components/app-ad/app-ad.component';
import { PopularCitiesComponent } from './components/popular-cities/popular-cities.component';
import { PopularAirlinesComponent } from './components/popular-airlines/popular-airlines.component';
import { SiteAdvantagesComponent } from './components/site-advantages/site-advantages.component';
import { FlightDealsCardComponent } from './components/flight-deals/flight-deals-card/flight-deals-card.component';
import { HotelDealsCardComponent } from './components/hotel-deals/hotel-deals-card/hotel-deals-card.component';
import { CalcDiscountPipe } from './components/flight-deals/calc-discount.pipe';

@NgModule({
  declarations: [
    HomeComponent,
    FlightDealsComponent,
    HotelDealsComponent,
    AppAdComponent,
    PopularCitiesComponent,
    PopularAirlinesComponent,
    SiteAdvantagesComponent,
    FlightDealsCardComponent,
    HotelDealsCardComponent,
    CalcDiscountPipe
  ],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class HomeModule {}
