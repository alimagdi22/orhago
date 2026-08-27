import { Component, inject, OnInit } from '@angular/core';
import { IMainButton } from '../../../../models/flights/mainButton.model';
import { SharedService } from '../../../../shared.service';
import { FlightResultService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-flight-details-header',
  templateUrl: './flight-details-header.component.html',
  styleUrl: './flight-details-header.component.scss',
})
export class FlightDetailsHeaderComponent {
  sharedService = inject(SharedService);
  flightResultService = inject(FlightResultService);

  selectButton: IMainButton = {
    height: '48px',
    width: '100%',
    borderRadius: '6px',
    backgroundColor: '#213567',
    color:'white'
  };

  onClickExit() {
    this.sharedService.isFlightDetailsShowed = false;
  }

  onClickSelect() {
    this.sharedService.showBrandedFares(this.sharedService.selectedFlightItinerary);
  }
}
