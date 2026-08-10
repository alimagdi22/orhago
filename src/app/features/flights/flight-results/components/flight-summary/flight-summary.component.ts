import { Component, inject, Input, output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FlightResultService, IFlight, IFlightDTO } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-flight-summary',
  templateUrl: './flight-summary.component.html',
  styleUrl: './flight-summary.component.scss'
})
export class FlightSummaryComponent {
  toggle = output<void>();
  translate = inject(TranslateService);
  flightResultService = inject(FlightResultService);

  landingSegment: IFlightDTO = this.flightResultService.orgnizedResponce[0][0].allJourney.flights[0].flightDTO[this.flightResultService.orgnizedResponce[0][0].allJourney.flights[0].flightDTO.length - 1];

  departingSegment: IFlightDTO = this.flightResultService.orgnizedResponce[0][0].allJourney.flights[0].flightDTO[0];
  
  flights: IFlight[] = this.flightResultService.orgnizedResponce[0][0].allJourney.flights;
  
  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
