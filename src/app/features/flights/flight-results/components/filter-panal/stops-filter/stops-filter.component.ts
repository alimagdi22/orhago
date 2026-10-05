import { Component, inject } from '@angular/core';
import { FlightResultService, IAirItinerary } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-stops-filter',
  templateUrl: './stops-filter.component.html',
  styleUrl: './stops-filter.component.scss',
})
export class StopsFilterComponent {
  flightResultService = inject(FlightResultService);

  stopsFilter = [
    {
      title: 'Non-Stop',
      formControlName: 'noStops',
    },
    {
      title: '1 Stop',
      formControlName: 'oneStop',
    },
    {
      title: '2 Stops',
      formControlName: 'twoAndm',
    },
  ];

  count(control: string): number | null {
    const flights = this.flightResultService.response?.airItineraries;
    if (!flights?.length) {
      return null;
    }

    return flights.filter((flight) => this.matches(flight, control)).length;
  }

  private matches(flight: IAirItinerary, control: string): boolean {
    const stops = flight.allJourney?.flights?.[0]?.stopsNum ?? 0;
    if (control === 'noStops') {
      return stops <= 0;
    }
    if (control === 'oneStop') {
      return stops === 1;
    }
    return stops >= 2;
  }
}
