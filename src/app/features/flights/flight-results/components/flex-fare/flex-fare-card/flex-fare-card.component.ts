import { Component, inject, Input, OnInit } from '@angular/core';
import { IMainButton } from '../../../../../../shared/models/flights/mainButton.model';
import { SharedService } from '../../../../../../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Brand } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-flex-fare-card',
  templateUrl: './flex-fare-card.component.html',
  styleUrl: './flex-fare-card.component.scss',
})
export class FlexFareCardComponent implements OnInit {
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
      dValue: 0,
      mValue: 0,
    },
    passengerFareBreakDowns: [],
    optionalServices: [],
  };

  optionalServices: string[] = [];

  @Input() isActive = true;
  @Input() totalPassengers = 0;

  translate = inject(TranslateService);

  ngOnInit(): void {
    this.getOptionalServices();
  }
  sharedService = inject(SharedService);

  selectButton: IMainButton = {
    height: '36px',
    width: '100%',
    borderRadius: '6px',
    backgroundColor: '#213567',
    color:'white'
  };

  onClickSelect() {
    this.sharedService.onSelectFlight(
      this.sharedService.selectedFlightItinerary.sequenceNum,
      this.sharedService.selectedFlightItinerary.pcc,
      this.sharedService.selectedFlightItinerary.pKey,
      this.brand.brandId,
    );
    this.sharedService.isBrandedFaresShowed = false;
  }

  getOptionalServices() {
    const optionalServices = this.brand.optionalServices.filter((service) => {
      return service.type.toLocaleLowerCase() !== 'mealorbeverage' && service.type.toLocaleLowerCase() !== 'baggage';
    });

    const uniqueServices = optionalServices.map((service) => {
      return service.serviceInfo.description[0];
    });

    this.optionalServices = [...new Set(uniqueServices)];
  }
}
