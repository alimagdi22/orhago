import { Component, Input } from '@angular/core';
import { IFlight } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-flight-info',
  templateUrl: './flight-info.component.html',
  styleUrl: './flight-info.component.scss',
})
export class FlightInfoComponent {
  @Input() flight: IFlight = {
    flightDTO: [],
    flightAirline: {
      airlineCode: '',
      airlineName: '',
      airlineLogo: '',
      alternativeBusinessName: null,
      passportDetailsRequired: false,
    },
    elapsedTime: 0,
    stopsNum: 0,
  };
}
