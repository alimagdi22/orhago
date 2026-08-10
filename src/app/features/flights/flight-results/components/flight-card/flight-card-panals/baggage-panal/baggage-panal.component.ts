import { Component, Input } from '@angular/core';
import { BAGGAGE_INFORMATION_DEFAULT, IBaggageInformation } from 'rp-travel-ui';
@Component({
  standalone: false,
  selector: 'app-baggage-panal',
  templateUrl: './baggage-panal.component.html',
  styleUrl: './baggage-panal.component.scss',
})
export class BaggagePanalComponent {
  @Input() baggageInfo: IBaggageInformation = BAGGAGE_INFORMATION_DEFAULT;

  get normalBaggage() {
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage[1] === 'Kilograms') {
      return baggage[0];
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
  childBaggage() {
    const baggage = this.baggageInfo.childBaggage?.split(' ');

    if(baggage) {
      if (baggage[1] === 'Kilograms') {
        return baggage[0];
      }
  
      return baggage[0];
    }

    return 'N/A';
  }

  infantBaggage() {
    const baggage = this.baggageInfo.infantBaggage?.split(' ');

    if(baggage) {
      if (baggage[1] === 'Kilograms') {
        return baggage[0];
      }
  
      return baggage[0];
    }

    return 'N/A';
  }
}
