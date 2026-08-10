import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IFlight } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-confirmation-flight-path',
  templateUrl: './flight-path.component.html',
  styleUrl: './flight-path.component.scss',
})
export class FlightPathComponent {
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

  translate = inject(TranslateService);
}
