import { Component, inject, Input, OnChanges } from '@angular/core';
import { Brand } from 'rp-travel-ui';
import { SharedService } from '../../../../shared/shared.service';

interface FareLine {
  included: boolean;
  key: string;
  params?: Record<string, string>;
}

@Component({
  standalone: false,
  selector: 'app-fare-option-card',
  templateUrl: './fare-option-card.component.html',
  styleUrl: './fare-option-card.component.scss',
})
export class FareOptionCardComponent implements OnChanges {
  @Input({ required: true }) brand!: Brand;
  @Input() sequenceNum = 0;
  @Input() pcc = '';
  @Input() providerKey = '';

  sharedService = inject(SharedService);
  lines: FareLine[] = [];

  ngOnChanges(): void {
    this.lines = this.buildLines();
  }

  choose(): void {
    this.sharedService.onSelectFlight(this.sequenceNum, this.pcc, this.providerKey, this.brand.brandId);
  }

  private buildLines(): FareLine[] {
    const lines: FareLine[] = [];
    const details = this.brand?.baggageAllowances?.[0]?.baggageAllowanceDetails || [];
    const carry = details.find((detail) => detail.baggage === 'CarryOn');
    const checked = details.find((detail) => detail.baggage !== 'CarryOn');

    lines.push(this.bagLine(carry, true));
    lines.push(this.bagLine(checked, false));

    const changePrice = Number(this.brand?.passengerFareBreakDowns?.[0]?.changePenaltyDTOs?.[0]?.price);
    const cancelPrice = Number(this.brand?.passengerFareBreakDowns?.[0]?.cancelPenaltyDTOs?.[0]?.price);

    lines.push({
      included: !(changePrice > 0),
      key: changePrice > 0 ? 'flightResults.changeFeeApplies' : 'flightResults.changeFeeNotApplies',
    });
    lines.push({
      included: !(cancelPrice > 0),
      key: cancelPrice > 0 ? 'flightResults.cancellationFeeApplies' : 'flightResults.cancellationFeeNotApplies',
    });

    const seen = new Set<string>();
    for (const service of this.brand?.optionalServices || []) {
      const type = String(service.type || '').toLowerCase();
      if (type === 'mealorbeverage' || type === 'baggage') {
        continue;
      }
      const text = service.serviceInfo?.description?.[0];
      if (!text || seen.has(text) || lines.length >= 7) {
        continue;
      }
      seen.add(text);
      // lines.push({ included: true, key: text });
    }

    return lines;
  }

  private bagLine(detail: { baggageAllowanceInfo?: { size?: string; unit?: string } } | undefined, carry: boolean): FareLine {
    const size = String(detail?.baggageAllowanceInfo?.size || '');
    const included = !!size && size !== '0';
    if (!included) {
      return { included: false, key: carry ? 'results.fares.noCabinBag' : 'results.fares.noCheckedBag' };
    }

    const rawUnit = String(detail?.baggageAllowanceInfo?.unit || '');
    const unit = rawUnit.toLowerCase() === 'kilogram' || rawUnit.toUpperCase() === 'KG' ? 'kg' : rawUnit;
    return {
      included: true,
      key: carry ? 'results.fares.cabinBag' : 'results.fares.checkedBag',
      params: { detail: `${size}${unit}` },
    };
  }
}
