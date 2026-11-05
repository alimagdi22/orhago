import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';
import { SharedService } from '../../../shared.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.scss',
})
export class FlightDetailsComponent implements OnInit, OnDestroy {
  sharedService = inject(SharedService);
  flightResultService = inject(FlightResultService);
  translate = inject(TranslateService);

  ngOnInit(): void {
    if (!this.sharedService.isSegmentPresent(['flight-checkout'])) {
      this.flightResultService.getBrandedFares(
        this.flightResultService.searchID,
        this.sharedService.selectedFlightItinerary.sequenceNum,
        this.sharedService.selectedFlightItinerary.pKey ?? '',
        this.sharedService.selectedFlightItinerary.pcc,
      );
    }
  }

  ngOnDestroy(): void {
    this.sharedService.selectedItinerary = -1;
  }
}
