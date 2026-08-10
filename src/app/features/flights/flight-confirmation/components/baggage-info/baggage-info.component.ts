import { Component, inject, Input } from '@angular/core';
import { SharedService } from '../../../../../shared/shared.service';
import { FlightResultService, IBaggageInformation, ISearchCriteria } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-baggage-info',
  templateUrl: './baggage-info.component.html',
  styleUrl: './baggage-info.component.scss',
})
export class BaggageInfoComponent {
    sharedService = inject(SharedService);
    public flightResultService = inject(FlightResultService);
    baggageInfo: IBaggageInformation = this.sharedService.selectedFlightItinerary.baggageInformation[0];
    @Input() searchCriteria?: ISearchCriteria;

  @Input() baggages: IBaggageInformation[] | null = [];



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
