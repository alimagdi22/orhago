import { Component, inject, OnInit } from '@angular/core';
import { FlightCheckoutService, IAirItinerary } from 'rp-travel-ui';
import { SharedService } from '../../../../../shared/shared.service';

@Component({
  standalone: false,
  selector: 'app-flight-info',
  templateUrl: './flight-info.component.html',
  styleUrl: './flight-info.component.scss',
})
export class FlightInfoComponent {
  flightCheckoutService = inject(FlightCheckoutService);
  sharedService = inject(SharedService);

  get isRoundTrip(): boolean {
    const flightType = String(this.flightCheckoutService.selectedFlight?.searchCriteria?.flightType || '')
      .toLowerCase()
      .replace(/[\s_-]/g, '');
    return flightType === 'roundtrip';
  }

  showFlightDetails(airItinerary: IAirItinerary | null, e: Event, index: number) {
    e.stopPropagation();
    this.sharedService.selectedItinerary = index;
    this.sharedService.showFlightDetails(airItinerary);
  }
}
