import { Component, inject } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-airlines-filter',
  templateUrl: './airlines-filter.component.html',
  styleUrl: './airlines-filter.component.scss',
})
export class AirlinesFilterComponent {
  flightResultService = inject(FlightResultService);
}
