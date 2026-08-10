import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FLIGHT_DTO_DEFAULT, IFlightDTO } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-destination-info-app',
  templateUrl: './destination-info-app.component.html',
  styleUrl: './destination-info-app.component.scss'
})
export class DestinationInfoAppComponent {
  @Input() dest = 'dept';
  @Input() flightDTO: IFlightDTO = FLIGHT_DTO_DEFAULT;

  translate = inject(TranslateService);

  get date() {
    if (this.dest === 'dept') {
      return this.flightDTO.departureDate;
    }
    return this.flightDTO.arrivalDate;
  }

  get airportCode() {
    if (this.dest === 'dept') {
      return this.flightDTO.departureTerminalAirport.airportCode;
    }
    return this.flightDTO.arrivalTerminalAirport.airportCode;
  }
}
