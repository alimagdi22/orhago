import { Component, inject } from '@angular/core';
import { FormArray } from '@angular/forms';
import { FlightResultService } from 'rp-travel-ui';
import { SharedService } from '../../../../../shared/shared.service';

@Component({
  standalone: false,
  selector: 'app-filter-panal',
  templateUrl: './filter-panal.component.html',
  styleUrl: './filter-panal.component.scss',
})
export class FilterPanalComponent {
  sharedService = inject(SharedService);
  flightResultService = inject(FlightResultService);

  clearAll(): void {
    const form = this.flightResultService.filterForm;
    if (!form) {
      return;
    }

    const airlines = form.get('airline.airlines') as FormArray | null;
    airlines?.controls.forEach((control) => control.setValue(false, { emitEvent: false }));

    form.patchValue({
      stopsForm: { noStops: false, oneStop: false, twoAndm: false },
      flexibleTickets: { refund: false, nonRefund: false },
      sameAirline: false,
      minpriceSlider: this.flightResultService.minPriceValueForSlider,
      maxpriceSlider: this.flightResultService.maxPriceValueForSlider,
      goingFlightScheduleDepart: { startTime: '', endTime: '' },
      goingFlightScheduleArrival: { startTime: '', endTime: '' },
      returnFlightScheduleDepart: { startTime: '', endTime: '' },
      returnFlightScheduleArrival: { startTime: '', endTime: '' },
    });
  }
}
