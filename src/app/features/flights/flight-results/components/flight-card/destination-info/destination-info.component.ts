import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FLIGHT_DTO_DEFAULT, IFlightDTO } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-destination-info',
  templateUrl: './destination-info.component.html',
  styleUrl: './destination-info.component.scss',
})
export class DestinationInfoComponent {
  @Input() dest = 'dept';
  @Input() flightDTO: IFlightDTO = FLIGHT_DTO_DEFAULT;

  translate = inject(TranslateService);

  get date() {
    if (this.dest === 'dept') {
      return this.flightDTO.departureDate;
    }
    return this.flightDTO.arrivalDate;
  }

  get airportName() {
    const airport = this.dest === 'dept'
      ? this.flightDTO.departureTerminalAirport
      : this.flightDTO.arrivalTerminalAirport;

    if (!airport) return '';
    return airport.airportName || airport.cityName || airport.airportCode || '';
  }
}
