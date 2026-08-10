import { Component, inject, Input } from '@angular/core';
import { FlightCheckoutService, FlightResultService, IBaggageInformation, ISearchCriteria } from 'rp-travel-ui';
import { SharedService } from '../../../../../shared.service';
@Component({
  standalone: false,
  selector: 'app-baggage-details',
  templateUrl: './baggage-details.component.html',
  styleUrl: './baggage-details.component.scss',
})
export class BaggageDetailsComponent {
  sharedService = inject(SharedService);
  flightCheckoutService = inject(FlightCheckoutService)
   public flightResultService = inject(FlightResultService);
  baggageInfo: IBaggageInformation = this.sharedService.selectedFlightItinerary.baggageInformation[0];
  @Input() searchCriteria?: ISearchCriteria;

  get normalBaggage() {
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage[1] === 'Kilograms') {
      return Math.floor(parseInt(baggage[0]) / 7);
    }

    return baggage[0];
  }

  get getUnit() {
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage[1] === 'Kilograms') {
      return 'KGs';
    }

    return 'PCs';
  }

  adultBaggage() {
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage[1] === 'Kilograms') {
      return Math.floor(parseInt(baggage[0]) / 7);
    }

    return baggage[0];
  }

  childBaggage() {
    const baggage = this.baggageInfo.childBaggage?.split(' ');

    if(baggage) {
      if (baggage[1] === 'Kilograms') {
        return Math.floor(parseInt(baggage[0]) / 7);
      }

      return baggage[0];
    }

    return 'N/A';
  }

  infantBaggage() {
    const baggage = this.baggageInfo.infantBaggage?.split(' ');

    if(baggage) {
      if (baggage[1] === 'Kilograms') {
        return Math.floor(parseInt(baggage[0]) / 7);
      }

      return baggage[0];
    }

    return 'N/A';
  }


   getBaggageCountOnlyOrRaw(baggage: string): string {
    if (!baggage) return '';

    const [countStr, unit] = baggage.split(' ');

    const isPieceUnit = ['Piece', 'Pieces', 'PC', 'Pcs'].includes(unit);

    if (isPieceUnit) {
      const count = parseInt(countStr, 10);
      if (count === 0) {
        return '0 PCs';
      }
      return `${count} x 23KG`;
    }

    return baggage;
  }
}
