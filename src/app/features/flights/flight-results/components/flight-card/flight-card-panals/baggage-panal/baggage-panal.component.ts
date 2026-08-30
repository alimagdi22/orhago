import { Component, Input, OnInit } from '@angular/core';
import { BAGGAGE_INFORMATION_DEFAULT, IBaggageInformation } from 'rp-travel-ui';
@Component({
  standalone: false,
  selector: 'app-baggage-panal',
  templateUrl: './baggage-panal.component.html',
  styleUrl: './baggage-panal.component.scss',
})
export class BaggagePanalComponent implements OnInit {
  @Input() baggageInfo: IBaggageInformation = BAGGAGE_INFORMATION_DEFAULT;
  ngOnInit(): void {
      console.log(this.baggageInfo,'baaaaaaagd');
      
  }
  get normalBaggage() {
    if (!this.baggageInfo?.baggage) return '1';
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage && baggage[1] === 'Kilograms') {
      return baggage[0];
    }

    return baggage ? baggage[0] : '1';
  }

  get getUnit() {
    if (!this.baggageInfo?.baggage) return 'PCs';
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage && baggage[1] === 'Kilograms') {
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
    if (!this.baggageInfo?.childBaggage) return 'N/A';
    const baggage = this.baggageInfo.childBaggage.split(' ');

    if (baggage) {
      if (baggage[1] === 'Kilograms') {
        return baggage[0];
      }
  
      return baggage[0];
    }

    return 'N/A';
  }

  infantBaggage() {
    if (!this.baggageInfo?.infantBaggage) return 'N/A';
    const baggage = this.baggageInfo.infantBaggage.split(' ');

    if (baggage) {
      if (baggage[1] === 'Kilograms') {
        return baggage[0];
      }
  
      return baggage[0];
    }

    return 'N/A';
  }
}
