import { Component, inject, Input, OnInit } from '@angular/core';
import { IMainButton } from '../../../../../../shared/models/flights/mainButton.model';
import { SharedService } from '../../../../../../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Brand, FlightCheckoutService, HomePageService } from 'rp-travel-ui';

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
  @Input() isActive = true;
  @Input() totalPassengers = 0;
  @Input() cardIndex = 0;
  translate = inject(TranslateService);
  flightCheckoutService = inject(FlightCheckoutService);
  homePageService = inject(HomePageService);
  optionalServices: string[] = [];

  ngOnInit(): void {
    this.getOptionalServices();
  }
  sharedService = inject(SharedService);

  selectButton: IMainButton = {
    height: '36px',
    width: '100%',
    borderRadius: '6px',
    backgroundColor: '#213567',
    color: 'white',
  };
  get priceDifference(): number {
    const flightFare =
      this.sharedService.selectedFlightItinerary?.itinTotalFare ||
      this.flightCheckoutService.selectedFlight?.airItineraryDTO?.itinTotalFare;
    const brandFare = this.brand?.itinTotalFare;
    const brandAmount = Number(brandFare?.amount);
    const flightAmount = Number(flightFare?.amount);
    if (!brandAmount || !flightAmount) return 0;

    const flightInBrandCurrency = this.convert(
      flightAmount,
      flightFare?.currencyCode || '',
      brandFare?.currencyCode || '',
    );
    if (flightInBrandCurrency == null) return 0;

    const diff = brandAmount - flightInBrandCurrency;
    return diff > 0 ? diff : 0;
  }

  private convert(amount: number, from: string, to: string): number | null {
    if (!from || !to || from === to) return amount;

    const fromRate = this.currencyRate(from);
    const toRate = this.currencyRate(to);
    if (!fromRate || !toRate) return null;

    return (amount / fromRate) * toRate;
  }

  private currencyRate(code: string): number {
    const found = Number(
      this.homePageService.allCurrency?.find((currency) => currency.Currency_Code === code)?.rate,
    );
    if (found > 0) return found;

    const selected = this.homePageService.selectedCurrency;
    if (code === selected?.Currency_Code && Number(selected.rate) > 0) {
      return Number(selected.rate);
    }

    return 0;
  }

  get sortedBaggageAllowanceDetails(): any[] {
    const details = this.brand?.baggageAllowances?.[0]?.baggageAllowanceDetails;
    if (!details) return [];
    return [...details].sort((a, b) => {
      if (a.baggage === 'CarryOn' && b.baggage !== 'CarryOn') return 1;
      if (a.baggage !== 'CarryOn' && b.baggage === 'CarryOn') return -1;
      return 0;
    });
  }


  onClickSelect(event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.sharedService.onSelectFlight(
      this.sharedService.selectedFlightItinerary.sequenceNum,
      this.sharedService.selectedFlightItinerary.pcc,
      this.sharedService.selectedFlightItinerary.pKey,
      this.brand.brandId,
    );
    this.sharedService.isBrandedFaresShowed = false;
  }

  getOptionalServices(): void {
    if (this.brand?.optionalServices) {
      const optionalServices = this.brand.optionalServices.filter((service) => {
        const type = service.type.toLocaleLowerCase();

        return type !== 'mealorbeverage' && type !== 'baggage';
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
