import { Component, inject, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Brand } from 'rp-travel-ui';
import { SharedService } from '../../../shared.service';
import { IMainButton } from '../../../models/flights/mainButton.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-flex-fare-card-app',
  templateUrl: './flex-fare-card-app.component.html',
  styleUrl: './flex-fare-card-app.component.scss'
})
export class FlexFareCardAppComponent implements OnInit {
  @Input() brand: Brand = {
    brandName: 'ECONOMY BASIC',
    brandId: '000000',
    sequenceNumber: 1,
    cabinClasse: 'Economy',
    baggageAllowances: null,
    brandedFaresDTOs: [],
    adminCharges: [],
    itinTotalFare: {
      amount: 0,
      fareAmount: 0,
      promoCode: null,
      promoDiscount: 0,
      currencyCode: 'EGP',
      totalTaxes: 0,
      dName: 'Default Segment',
      mName: null,
      dValue: null,
      mValue: null
    },
    passengerFareBreakDowns: [],
    optionalServices: [],
  };

  optionalServices: string[] = [];

  @Input() isActive = true;
  @Input() totalPassengers = 0;
  @Input() cardIndex = 0;

  get priceDifference(): number {
    const basePrice = this.sharedService.selectedFlightItinerary?.itinTotalFare?.amount || 0;
    const currentPrice = this.brand?.itinTotalFare?.amount || 0;
    const diff = currentPrice - basePrice;
    return diff > 0 ? diff : 0;
  }

  translate = inject(TranslateService);
  sharedService = inject(SharedService);
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getOptionalServices();
  }

  selectButton: IMainButton = {
    height: '36px',
    width: '100%',
    borderRadius: '12px',
  };

  onClickSelect() {
    this.sharedService.onSelectFlight(
      this.sharedService.selectedFlightItinerary.sequenceNum,
      this.sharedService.selectedFlightItinerary.pcc,
      this.sharedService.selectedFlightItinerary.pKey,
      this.brand.brandId,
    );
    this.dialog.closeAll();
  }

  getOptionalServices() {
    if (this.brand?.optionalServices) {
      const optionalServices = this.brand.optionalServices.filter((service) => {
        return service.type.toLocaleLowerCase() !== 'mealorbeverage' && service.type.toLocaleLowerCase() !== 'baggage';
      });

      const uniqueServices = optionalServices.map((service) => {
        return service.serviceInfo.description[0];
      });

      this.optionalServices = [...new Set(uniqueServices)];
    } else {
      this.optionalServices = [];
    }
  }
}
