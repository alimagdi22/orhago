import { Component, inject } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrl: './price.component.scss',
})
export class PriceComponent {
  flightResultService = inject(FlightResultService);
}
