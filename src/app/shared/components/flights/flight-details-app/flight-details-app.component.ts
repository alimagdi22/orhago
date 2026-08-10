import { Component, inject, Input } from '@angular/core';
import { SharedService } from '../../../shared.service';
import { Brand, FlightResultService } from 'rp-travel-ui';
import { IMainButton } from '../../../models/flights/mainButton.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flight-details-app',
  templateUrl: './flight-details-app.component.html',
  styleUrl: './flight-details-app.component.scss'
})
export class FlightDetailsAppComponent {
 sharedService = inject(SharedService);
  flightResultService = inject(FlightResultService);
    translate = inject(TranslateService)

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


  ngOnInit(): void {
    if (!this.sharedService.isSegmentPresent(['flight-checkout'])) {
      this.flightResultService.getBrandedFares(
        this.flightResultService.searchID,
        this.sharedService.selectedFlightItinerary.sequenceNum,
        this.sharedService.selectedFlightItinerary.pKey ?? '',
        this.sharedService.selectedFlightItinerary.pcc,
      );
    }
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
      this.sharedService.isBrandedFaresShowed = false;
      this.sharedService.dialog.closeAll()
    }

  ngOnDestroy(): void {
    this.sharedService.selectedItinerary = -1;
  }
}
