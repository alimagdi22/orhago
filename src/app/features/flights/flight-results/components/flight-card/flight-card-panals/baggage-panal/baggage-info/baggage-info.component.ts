import { Component, ElementRef, Input, ViewChild, OnDestroy, inject } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { BAGGAGE_INFORMATION_DEFAULT, IBaggageInformation } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-baggage-info',
  templateUrl: './baggage-info.component.html',
  styleUrl: './baggage-info.component.scss',
})
export class BaggageInfoComponent implements OnDestroy {
  @Input() baggageInfo: IBaggageInformation = BAGGAGE_INFORMATION_DEFAULT;
  @ViewChild('icon') icon!: ElementRef;
  @ViewChild('baggageInfoTrigger') baggageInfoTrigger!: MatMenuTrigger;
  translate = inject(TranslateService);
  private closeTimer: any;
  isHoveringIcon = false;
  isHoveringContent = false;

  ngOnDestroy(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
  }

  normalBaggage() {
    const baggage = this.baggageInfo?.baggage?.split(' ');

    if (!baggage || baggage.length === 0) return '1';

    if (baggage[1] === 'Kilograms') {
      return Math.floor(parseInt(baggage[0]) / 7) || '1';
    }

    return baggage[0] || '1';
  }

  childBaggage() {
    const baggage = this.baggageInfo?.childBaggage?.split(' ');

    if (baggage) {
      if (baggage[1] === 'Kilograms') {
        return Math.floor(parseInt(baggage[0]) / 7);
      }

      return baggage[0];
    }

    return 'N/A';
  }

  infantBaggage() {
    const baggage = this.baggageInfo?.infantBaggage?.split(' ');

    if (baggage) {
      if (baggage[1] === 'Kilograms') {
        return Math.floor(parseInt(baggage[0]) / 7);
      }

      return baggage[0];
    }

    return 'N/A';
  }

  onIconMouseEnter() {
    this.isHoveringIcon = true;
    this.openBaggageInfo();
  }

  onIconMouseLeave() {
    this.isHoveringIcon = false;
    this.closeBaggageInfoWithDelay();
  }

  onContentMouseEnter() {
    this.isHoveringContent = true;
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
  }

  onContentMouseLeave() {
    this.isHoveringContent = false;
    this.closeBaggageInfoWithDelay();
  }

  openBaggageInfo() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
    if (this.baggageInfoTrigger) {
      this.baggageInfoTrigger.openMenu();
    }
  }

  closeBaggageInfoWithDelay() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
    this.closeTimer = setTimeout(() => {
      if (!this.isHoveringIcon && !this.isHoveringContent) {
        if (this.baggageInfoTrigger && this.baggageInfoTrigger.menuOpen) {
          this.baggageInfoTrigger.closeMenu();
        }
      }
    }, 300);
  }

  cancelCloseBaggageInfo() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
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
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }

  getBaggageCountOnlyOrRaw(baggage: string | number): string {
    if (!baggage) return '';

    const baggageStr = baggage.toString().trim();
    const [countStr, unitRaw] = baggageStr.split(' ');
    const unit = unitRaw?.toLowerCase();

    const isPieceUnit = ['piece', 'pieces', 'pc', 'pcs'].includes(unit);

    const count = parseInt(countStr, 10);

    if (isNaN(count)) return baggageStr;

    if (isPieceUnit) {
      return count === 0 ? '0 PCs' : `${count} x 23KG`;
    }

    if (unit === 'kilograms' || unit === 'kg') {
      return `${count} KG`;
    }

    return baggageStr;
  }
}
