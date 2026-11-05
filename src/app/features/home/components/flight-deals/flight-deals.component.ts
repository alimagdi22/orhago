import { Component, inject } from '@angular/core';
import { MostSearchedFlightsService } from './most-searched-flights.service';

@Component({
  standalone: false,
  selector: 'app-flight-deals',
  templateUrl: './flight-deals.component.html',
  styleUrl: './flight-deals.component.scss',
})
export class FlightDealsComponent {
  private mostSearchedFlightsService = inject(MostSearchedFlightsService);

  get flights() {
    return this.mostSearchedFlightsService.mostSearchedFlights.slice(0, 4);
  }
}
