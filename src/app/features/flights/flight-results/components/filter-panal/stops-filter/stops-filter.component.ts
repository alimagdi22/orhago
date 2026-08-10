import { Component, inject } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-stops-filter',
  templateUrl: './stops-filter.component.html',
  styleUrl: './stops-filter.component.scss',
})
export class StopsFilterComponent {
  flightResultService = inject(FlightResultService);

  stopsFilter = [
    {
      title: 'Non-Stop',
      formControlName: 'noStops',
    },
    {
      title: '1 Stop',
      formControlName: 'oneStop',
    },
    {
      title: '2 Stops',
      formControlName: 'twoAndm',
    },
  ];
}
