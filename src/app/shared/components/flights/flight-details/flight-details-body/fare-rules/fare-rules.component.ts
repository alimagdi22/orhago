import { Component, inject } from '@angular/core';
import { FlightCheckoutService, FlightResultService } from 'rp-travel-ui';
import { SharedService } from '../../../../../shared.service';

@Component({
  standalone: false,
  selector: 'app-fare-rules',
  templateUrl: './fare-rules.component.html',
  styleUrl: './fare-rules.component.scss',
})
export class FareRulesComponent {
  flightResultService = inject(FlightResultService);
  flightCheckoutService = inject(FlightCheckoutService);
  sharedService = inject(SharedService);

  get farePassengers() {
    const brandPassengers = this.selectedBrand?.passengerFareBreakDowns;
    if (brandPassengers?.length) {
      return brandPassengers;
    }

    return this.fallbackItinerary?.passengerFareBreakDownDTOs ?? [];
  }

  get fareAdminCharges() {
    if (!this.selectedBrand?.passengerFareBreakDowns?.length) return [];
    return this.selectedBrand.adminCharges ?? [];
  }

  get firstPassenger() {
    return this.farePassengers[0];
  }

  private get selectedBrand() {
    const brands = this.flightResultService.currentSelectedBrands;
    if (!brands?.length) return null;

    return brands[this.sharedService.selectedBrandedIndex] ?? brands[0] ?? null;
  }

  private get fallbackItinerary() {
    if (this.sharedService.isSegmentPresent(['flight-checkout'])) {
      return (
        this.flightCheckoutService.selectedFlight?.airItineraryDTO ??
        this.sharedService.selectedFlightItinerary
      );
    }

    return this.sharedService.selectedFlightItinerary;
  }

  getTotelBaseFare() {
    return this.farePassengers.reduce((total, passenger) => {
      const fares = passenger.flightFaresDTOs ?? [];
      return total + (fares[0]?.fareAmount || 0) * (passenger.passengerQuantity || 0) + (fares[1]?.fareAmount || 0);
    }, 0);
  }

  getTotelTaxFare() {
    return this.farePassengers.reduce((total, passenger) => {
      return total + (passenger.flightFaresDTOs?.[1]?.fareAmount || 0);
    }, 0);
  }

  getCancellationPrice() {
    return this.farePassengers.reduce((total, passenger) => {
      return total + (passenger.cancelPenaltyDTOs?.[0]?.price || 0);
    }, 0);
  }

  getChangePrice() {
    return this.farePassengers.reduce((total, passenger) => {
      return total + (passenger.changePenaltyDTOs?.[0]?.price || 0);
    }, 0);
  }
}
