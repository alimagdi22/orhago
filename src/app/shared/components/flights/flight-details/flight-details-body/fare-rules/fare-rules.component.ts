import { Component, inject, OnInit } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';
import { SharedService } from '../../../../../shared.service';

@Component({
  standalone: false,
  selector: 'app-fare-rules',
  templateUrl: './fare-rules.component.html',
  styleUrl: './fare-rules.component.scss',
})
export class FareRulesComponent {
  flightResultService = inject(FlightResultService);
  sharedService = inject(SharedService);

  getTotelBaseFare() {
    let totalBaseFare = 0;

    this.flightResultService.currentSelectedBrands[
      this.sharedService.selectedBrandedIndex
    ].passengerFareBreakDowns.forEach((e) => {
      totalBaseFare += e.flightFaresDTOs[0].fareAmount * e.passengerQuantity;
      totalBaseFare += e.flightFaresDTOs[1].fareAmount;
    });

    return totalBaseFare;
  }

  getTotelTaxFare() {
    let totalTaxFare = 0;

    this.flightResultService.currentSelectedBrands[
      this.sharedService.selectedBrandedIndex
    ].passengerFareBreakDowns.forEach((e) => {
      totalTaxFare += e.flightFaresDTOs[1].fareAmount;
    });

    return totalTaxFare;
  }

  getCancellationPrice() {
    let totalCancellation = 0;

    this.flightResultService.currentSelectedBrands[
      this.sharedService.selectedBrandedIndex
    ].passengerFareBreakDowns.forEach((e) => {
      totalCancellation += e.cancelPenaltyDTOs[0].price;
    });

    return totalCancellation;
  }

  getChangePrice() {
    let totalCancellation = 0;

    this.flightResultService.currentSelectedBrands[
      this.sharedService.selectedBrandedIndex
    ].passengerFareBreakDowns.forEach((e) => {
      totalCancellation += e.changePenaltyDTOs[0].price;
    });

    return totalCancellation;
  }
}
