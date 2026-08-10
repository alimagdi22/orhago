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
}
