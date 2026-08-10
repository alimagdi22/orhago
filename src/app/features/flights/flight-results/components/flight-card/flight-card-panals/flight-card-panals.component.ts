import { Component, Input } from '@angular/core';
import { AIR_ITINERARIES_DEFAULT, IAirItinerary } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-flight-card-panals',
  templateUrl: './flight-card-panals.component.html',
  styleUrl: './flight-card-panals.component.scss',
})
export class FlightCardPanalsComponent {
  @Input() airItinerary: IAirItinerary = AIR_ITINERARIES_DEFAULT;
}
