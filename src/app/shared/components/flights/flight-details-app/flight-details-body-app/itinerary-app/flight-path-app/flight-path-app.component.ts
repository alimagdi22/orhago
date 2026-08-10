import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FLIGHT_DTO_DEFAULT, IFlightDTO } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-flight-path-app',
  templateUrl: './flight-path-app.component.html',
  styleUrl: './flight-path-app.component.scss'
})
export class FlightPathAppComponent {
@Input({ required: true }) flightSegment: IFlightDTO = FLIGHT_DTO_DEFAULT;

  @Input({ required: true }) airlineLogo = '';
  @Input({ required: true }) airlineName = '';
  @Input({ required: true }) cabinClass = '';
  @Input({required:true})terminal = ''

  translate = inject(TranslateService);
  deptDate = '';
  deptCityName = '';
  deptAirportName = '';

  landDate ='';
  arrivalCityName = '';
  arrivalAirportName = '';

  segmentDuration = 0;

  ngOnInit(): void {
    this.deptDate = this.flightSegment.departureDate;
    this.deptCityName = this.flightSegment.departureTerminalAirport.cityName;
    this.deptAirportName = this.flightSegment.departureTerminalAirport.airportName;

    this.landDate = this.flightSegment.arrivalDate;
    this.arrivalCityName = this.flightSegment.arrivalTerminalAirport.cityName;
    this.arrivalAirportName = this.flightSegment.arrivalTerminalAirport.airportName;

    this.segmentDuration = this.flightSegment.durationPerLeg;
  }
}
