import { Component, inject, Input } from '@angular/core';
import { SharedService } from '../../../../../shared.service';
import { FlightCheckoutService, FlightResultService, IBaggageInformation, ISearchCriteria } from 'rp-travel-ui';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-baggage-details-app',
  templateUrl: './baggage-details-app.component.html',
  styleUrl: './baggage-details-app.component.scss'
})
export class BaggageDetailsAppComponent {
sharedService = inject(SharedService);
  flightCheckoutService = inject(FlightCheckoutService)
   public flightResultService = inject(FlightResultService);
       translate = inject(TranslateService)

  baggageInfo: IBaggageInformation = this.sharedService.selectedFlightItinerary.baggageInformation[0];
  @Input() searchCriteria?: ISearchCriteria;
ngOnInit(): void {
    console.log(this.searchCriteria,'serach');
    console.log(this.flightResultService.response?.searchCriteria?.adultNum,'service');
}
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
