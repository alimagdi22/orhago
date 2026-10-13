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
  get isCabinOnly(): boolean {
    const raw = (this.baggageInfo?.baggage || '').trim().toLowerCase();
    if (!raw) {
      return true;
    }
    const count = parseInt(raw, 10);
    return !Number.isNaN(count) && count === 0;
  }

  get checkedKg(): string {
    const raw = (this.baggageInfo?.baggage || '').trim();
    const match = raw.match(/^(\d+)\s*k(?:g|ilograms?)\b/i);
    return match?.[1] || '';
  }

  get pieceCount(): string {
    const raw = (this.baggageInfo?.baggage || '').trim();
    const match = raw.match(/^(\d+)\s*(?:piece|pieces|pc|pcs)\b/i);
    return match?.[1] || '';
  }

  get normalBaggage() {
    if (!this.baggageInfo?.baggage) return '1 x 23KG';
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage && baggage[1] === 'Kilograms') {
      return ' 1 x ' + baggage[0] + 'KGs'  ;
    }

    return baggage ? baggage[0] + 'x 23KG' : '1 x 23KG';
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
