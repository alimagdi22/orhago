import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IFlightDTO } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-flight-info-dest',
  templateUrl: './flight-info-dest.component.html',
  styleUrl: './flight-info-dest.component.scss',
})
export class FlightInfoDestComponent {
  @Input() flightSegment: IFlightDTO | null = null;
  @Input() isDepart = false;

  translate = inject(TranslateService);
}
