import { Component, inject, Input } from '@angular/core';
import { SharedService } from '../../../../../../shared/shared.service';
import { FLIGHT_DEFAULT, IFlight } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-flight-main-info',
  templateUrl: './flight-main-info.component.html',
  styleUrl: './flight-main-info.component.scss',
})
export class FlightMainInfoComponent {
  @Input() flight: IFlight = FLIGHT_DEFAULT;
  @Input() totalDuration = 0;
  @Input() isRefundable = false;
  @Input() showRefundabilty = true;

  sharedService = inject(SharedService);

  get airlineCode(): string {
    return (this.flight?.flightAirline?.airlineCode || '').slice(0, 2).toUpperCase();
  }

  get flightNo(): string {
    const segment = this.flight?.flightDTO?.[0];
    const code = this.flight?.flightAirline?.airlineCode || '';
    const number = String(segment?.flightInfo?.flightNumber || '');
    const bare = number.toUpperCase().startsWith(code.toUpperCase())
      ? number.slice(code.length).trim()
      : number;
    return `${code} ${bare}`.trim();
  }

  get equipment(): string {
    return this.flight?.flightDTO?.[0]?.flightInfo?.equipmentNumber || '';
  }
}
