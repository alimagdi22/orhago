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
  @Input() isScrolled = false;
  toggle = output<void>();
  translate = inject(TranslateService);
  flightResultService = inject(FlightResultService);

  get flights(): IFlight[] {
    return this.flightResultService.orgnizedResponce?.[0]?.[0]?.allJourney?.flights || [];
  }

  get departingSegment(): IFlightDTO | null {
    return this.flights?.[0]?.flightDTO?.[0] || null;
  }

  get landingSegment(): IFlightDTO | null {
    const flightDTOs = this.flights?.[0]?.flightDTO;
    return flightDTOs ? flightDTOs[flightDTOs.length - 1] : null;
  }
}
