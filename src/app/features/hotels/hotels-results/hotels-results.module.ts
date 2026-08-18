import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { HotelsResultsRoutingModule } from './hotels-results-routing.module';
import { HotelsResultsComponent } from './hotels-results.component';
import { HotelsFilterComponent } from './components/hotels-filter/hotels-filter.component';
import { HotelsSortComponent } from './components/hotels-sort/hotels-sort.component';
import { HotelCardComponent } from './components/hotel-card/hotel-card.component';
import { HotelsTagsComponent } from './components/hotels-tags/hotels-tags.component';
import { InclusionComponent } from './components/hotels-filter/inclusion/inclusion.component';
import { LocationComponent } from './components/hotels-filter/location/location.component';
import { RateComponent } from './components/hotels-filter/rate/rate.component';
import { NameComponent } from './components/hotels-filter/name/name.component';
import { PriceComponent } from './components/hotels-filter/price/price.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { HotelCardAppComponent } from './components/hotel-card-app/hotel-card-app.component';
import { HotelsSortAppComponent } from './components/hotels-sort-app/hotels-sort-app.component';


@NgModule({
  declarations: [
    HotelsResultsComponent,
    HotelsFilterComponent,
    HotelsSortComponent,
    HotelCardComponent,
    HotelsTagsComponent,
    InclusionComponent,
    LocationComponent,
    RateComponent,
    NameComponent,
    PriceComponent,
    HotelCardAppComponent,
    HotelsSortAppComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HotelsResultsRoutingModule,
    MatChipsModule,
    MatIconModule,
  ]
})
export class HotelsResultsModule { }
