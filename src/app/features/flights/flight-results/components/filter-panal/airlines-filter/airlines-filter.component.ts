import { Component, inject } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-airlines-filter',
  templateUrl: './airlines-filter.component.html',
  styleUrl: './airlines-filter.component.scss',
})
export class AirlinesFilterComponent {
  flightResultService = inject(FlightResultService);

  count(name: string): number | null {
    const flights = this.flightResultService.response?.airItineraries;
    if (!flights?.length) {
      return null;
    }

    return flights.filter((flight) =>
      flight.allJourney?.flights?.some((leg) => leg.flightAirline?.airlineName === name)
    ).length;
  }
}
