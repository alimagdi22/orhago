import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightResultsRoutingModule } from './flight-results-routing.module';
import { SharedModule } from '../../../shared/shared.module';

import { FlightResultsComponent } from './flight-results.component';
import { FilterPanalComponent } from './components/filter-panal/filter-panal.component';
import { PriceComponent } from './components/filter-panal/price/price.component';
import { SchedulesComponent } from './components/filter-panal/schedules/schedules.component';
import { MaxMinPriceComponent } from './components/filter-panal/price/max-min/max-min-price.component';
import { ScheduleTabComponent } from './components/filter-panal/schedules/schedule-tab/schedule-tab.component';
import { ScheduleOptionComponent } from './components/filter-panal/schedules/schedule-option/schedule-option.component';
import { SortingPanalComponent } from './components/sorting-panal/sorting-panal.component';
import { SortItemComponent } from './components/sorting-panal/sort-item/sort-item.component';
import { FlightCardComponent } from './components/flight-card/flight-card.component';
import { FlightMainInfoComponent } from './components/flight-card/flight-main-info/flight-main-info.component';
import { DestinationInfoComponent } from './components/flight-card/destination-info/destination-info.component';
import { StopsInfoComponent } from './components/flight-card/stops-info/stops-info.component';
import { NumberOfStopsComponent } from './components/flight-card/stops-info/number-of-stops/number-of-stops.component';
import { FlightCardPanalsComponent } from './components/flight-card/flight-card-panals/flight-card-panals.component';
import { PricePanalComponent } from './components/flight-card/flight-card-panals/price-panal/price-panal.component';
import { BaggagePanalComponent } from './components/flight-card/flight-card-panals/baggage-panal/baggage-panal.component';
import { RefundabilityComponent } from './components/flight-card/flight-main-info/refundability/refundability.component';
import { BaggageInfoComponent } from './components/flight-card/flight-card-panals/baggage-panal/baggage-info/baggage-info.component';
import { AirlinesFilterComponent } from './components/filter-panal/airlines-filter/airlines-filter.component';
import { RefundabilityFilterComponent } from './components/filter-panal/refundability-filter/refundability-filter.component';
import { StopsFilterComponent } from './components/filter-panal/stops-filter/stops-filter.component';
import { NoFlightsComponent } from './components/no-flights/no-flights.component';
import { FlexFareComponent } from './components/flex-fare/flex-fare.component';
import { FlexFareCardComponent } from './components/flex-fare/flex-fare-card/flex-fare-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HourMinutePipe } from '../../../shared/pipes/hourMinute.pipe';
import { SortingPanalAppComponent } from './components/sorting-panal-app/sorting-panal-app.component';
import { SortingItemAppComponent } from './components/sorting-panal-app/sorting-item-app/sorting-item-app.component';
import { FlightCardAppComponent } from './components/flight-card-app/flight-card-app.component';
import { DestinationInfoAppComponent } from './components/destination-info-app/destination-info-app.component';


@NgModule({
  declarations: [
    FlightResultsComponent,
    FilterPanalComponent,
    PriceComponent,
    SchedulesComponent,
    MaxMinPriceComponent,
    ScheduleTabComponent,
    ScheduleOptionComponent,
    SortingPanalComponent,
    SortItemComponent,
    FlightCardComponent,
    FlightMainInfoComponent,
    DestinationInfoComponent,
    StopsInfoComponent,
    NumberOfStopsComponent,
    FlightCardPanalsComponent,
    PricePanalComponent,
    BaggagePanalComponent,
    RefundabilityComponent,
    BaggageInfoComponent,
    AirlinesFilterComponent,
    RefundabilityFilterComponent,
    StopsFilterComponent,
    FlexFareComponent,
    FlexFareCardComponent,
    HourMinutePipe,
    SortingPanalAppComponent,
    SortingItemAppComponent,
    FlightCardAppComponent,
    DestinationInfoAppComponent,




  ],
  imports: [CommonModule, FlightResultsRoutingModule, SharedModule,MatTooltipModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class FlightResultsModule {}
