import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AIR_ITINERARIES_DEFAULT, FlightResultService, IAirItinerary } from 'rp-travel-ui';
import { fareFlightFromItinerary, fareFlightStorageKey } from '../../../../../fare-selection/fare-flight';
import { IMainButton } from '../../../../../../../shared/models/flights/mainButton.model';
import { SharedService } from '../../../../../../../shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-price-panal',
  templateUrl: './price-panal.component.html',
  styleUrl: './price-panal.component.scss',
})
export class PricePanalComponent implements OnInit, OnDestroy {
  @Input() airItinerary: IAirItinerary = AIR_ITINERARIES_DEFAULT;
  @Input({ required: true }) isRefundable = false;
  sharedService = inject(SharedService);
  private router = inject(Router);
  subscription = new Subscription();

  flightResultService = inject(FlightResultService);

  isSelectedButtonLoading = false;

  selectButton: IMainButton = {
    height: '36px',
    width: '100%',
    borderRadius: '12px',
  };

  ngOnInit(): void {
    this.subscription.add(
      this.flightResultService.brandedFareNotifier.asObservable().subscribe({
        next: () => {
          if (this.sharedService.isFlightDetailsShowed || !this.isSelectedButtonLoading) {
            return;
          }
          this.isSelectedButtonLoading = false;
          this.afterBrandedFares();
        },
        error: () => {
          if (!this.isSelectedButtonLoading) {
            return;
          }
          this.isSelectedButtonLoading = false;
          this.goToCheckout();
        },
      }),
    );
  }

  onClickSelect() {
    this.isSelectedButtonLoading = true;

    this.flightResultService.getBrandedFares(
      this.flightResultService.searchID,
      this.airItinerary.sequenceNum,
      this.airItinerary.pKey ?? '',
      this.airItinerary.pcc?.toString() ?? '0',
    );
  }

  private afterBrandedFares(): void {
    const brands = this.flightResultService.currentSelectedBrands || [];
    if (brands.length > 1) {
      this.openFareSelection();
      return;
    }
    this.goToCheckout();
  }

  private openFareSelection(): void {
    const sid = this.flightResultService.searchID;
    const sequenceNum = this.airItinerary.sequenceNum;
    const providerKey = this.airItinerary.pKey ?? '';
    const pcc = this.airItinerary.pcc?.toString() ?? '0';
    const flight = fareFlightFromItinerary(this.airItinerary);

    this.sharedService.selectedFlightItinerary = this.airItinerary;
    this.sharedService.isBrandedFaresShowed = false;

    if (flight && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(fareFlightStorageKey(sid, sequenceNum, providerKey, pcc), JSON.stringify(flight));
    }

    this.router.navigate(['/flight-fares'], {
      queryParams: {
        sid,
        sequenceNum,
        providerKey,
        pcc,
        returnUrl: this.router.url,
      },
    });
  }

  private goToCheckout(): void {
    this.sharedService.onSelectFlight(
      this.airItinerary.sequenceNum,
      this.airItinerary.pcc,
      this.airItinerary.pKey,
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
