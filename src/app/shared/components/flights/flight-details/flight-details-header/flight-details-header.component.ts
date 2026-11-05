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

  get flightTypeLabel(): string {
    const type =
      this.normalizeFlightType(this.flightResultService.response?.searchCriteria?.flightType) ||
      this.normalizeFlightType(this.sharedService.flightType) ||
      this.flightTypeFromJourney();

    if (type === 'oneway') return 'flightDetails.flightType.oneWay';
    if (type === 'roundtrip') return 'flightDetails.flightType.roundtrip';
    return 'flightDetails.flightType.multicity';
  }

  private normalizeFlightType(value: unknown): string {
    const text = String(value ?? '').trim().toLowerCase();
    if (!text) return '';
    return text.replace(/[\s_-]+/g, '');
  }

  private flightTypeFromJourney(): string {
    const count = this.sharedService.selectedFlightItinerary?.allJourney?.flights?.length || 0;
    if (count <= 1) return 'oneway';
    if (count === 2) return 'roundtrip';
    return 'multicity';
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
