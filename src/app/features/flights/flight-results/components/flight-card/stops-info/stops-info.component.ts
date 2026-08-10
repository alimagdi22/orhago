import { Component, Input } from '@angular/core';
import { FLIGHT_DEFAULT, IFlight } from 'rp-travel-ui';


@Component({
  standalone: false,
  selector: 'app-stops-info',
  templateUrl: './stops-info.component.html',
  styleUrl: './stops-info.component.scss',
})
export class StopsInfoComponent {
  @Input() flight: IFlight = FLIGHT_DEFAULT;
  @Input() stopsNum = 1;
}
