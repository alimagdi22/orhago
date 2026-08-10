import { Component, inject } from '@angular/core';
import { SharedService } from '../../../../../shared/shared.service';
import { FlightResultService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-filter-panal',
  templateUrl: './filter-panal.component.html',
  styleUrl: './filter-panal.component.scss',
})
export class FilterPanalComponent {
  sharedService = inject(SharedService);
  flightResultService = inject(FlightResultService);
}
