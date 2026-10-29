import { Component, inject, OnInit } from '@angular/core';
import { IMainButton } from '../../../../models/flights/mainButton.model';
import { SharedService } from '../../../../shared.service';
import { FlightResultService } from 'rp-travel-ui';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flight-details-header',
  templateUrl: './flight-details-header.component.html',
  styleUrl: './flight-details-header.component.scss',
})
export class FlightDetailsHeaderComponent {
  sharedService = inject(SharedService);
  flightResultService = inject(FlightResultService);
  translate = inject(TranslateService);
  get fareAmount(): number {
    const brand = this.flightResultService.currentSelectedBrands?.[this.sharedService.selectedBrandedIndex];
    if (this.sharedService.selectedBrandedIndex !== -1 && brand?.itinTotalFare?.amount) {
      return brand.itinTotalFare.amount;
    }
    return this.sharedService.selectedFlightItinerary?.itinTotalFare?.amount || 0;
  }

  get fareCurrency(): string {
    const brand = this.flightResultService.currentSelectedBrands?.[this.sharedService.selectedBrandedIndex];
    return (
      brand?.itinTotalFare?.currencyCode ||
      this.sharedService.selectedFlightItinerary?.itinTotalFare?.currencyCode ||
      ''
    );
  }

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
