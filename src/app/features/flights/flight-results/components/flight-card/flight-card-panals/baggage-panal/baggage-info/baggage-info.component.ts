import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { BAGGAGE_INFORMATION_DEFAULT, IBaggageInformation } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-baggage-info',
  templateUrl: './baggage-info.component.html',
  styleUrl: './baggage-info.component.scss',
})
export class BaggageInfoComponent  {
  @Input() baggageInfo: IBaggageInformation = BAGGAGE_INFORMATION_DEFAULT;
  @ViewChild('icon') icon!: ElementRef;
  @ViewChild('baggageInfoTrigger') baggageInfoTrigger!: MatMenuTrigger;

  normalBaggage() {
    const baggage = this.baggageInfo?.baggage?.split(' ');

    if (baggage[1] === 'Kilograms') {
      return Math.floor(parseInt(baggage[0]) / 7);
    }

    return baggage[0];
  }

  childBaggage() {
    const baggage = this.baggageInfo?.childBaggage?.split(' ');

    if(baggage) {
      if (baggage[1] === 'Kilograms') {
        return Math.floor(parseInt(baggage[0]) / 7);
      }

      return baggage[0];
    }

    return 'N/A';
  }

  infantBaggage() {
    const baggage = this.baggageInfo?.infantBaggage?.split(' ');

    if(baggage) {
      if (baggage[1] === 'Kilograms') {
        return Math.floor(parseInt(baggage[0]) / 7);
      }

      return baggage[0];
    }

    return 'N/A';
  }

  openBaggageInfo() {
    this.baggageInfoTrigger.openMenu();
  }

  onClickDone() {
    if (this.baggageInfoTrigger) {
      this.baggageInfoTrigger.closeMenu();
    }
  }
  shouldShowBaggageNote(baggageInfo: any): boolean {
    return ['baggage', 'childBaggage', 'infantBaggage'].some((key) =>
      baggageInfo[key]?.toLowerCase().includes('piece')
    );
  }

  isMobile() {
    return window.innerWidth < 1080;
  }

getBaggageCountOnlyOrRaw(baggage: string | number): string {
  if (!baggage) return '';

  const baggageStr = baggage.toString().trim();
  const [countStr, unitRaw] = baggageStr.split(' ');
  const unit = unitRaw?.toLowerCase();

  const isPieceUnit = ['piece', 'pieces', 'pc', 'pcs'].includes(unit);

  const count = parseInt(countStr, 10);

  if (isNaN(count)) return '';

  if (isPieceUnit) {
    return count === 0 ? '0 PCs' : `${count} x 23KG`;
  }

  if (unit === 'kilograms' || unit === 'kg') {
    return `${count} KG`;
  }



  return baggageStr;
}



}
