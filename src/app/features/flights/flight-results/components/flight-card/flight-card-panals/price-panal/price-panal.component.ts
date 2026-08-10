import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AIR_ITINERARIES_DEFAULT, FlightResultService, IAirItinerary } from 'rp-travel-ui';
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
          if (!this.sharedService.isFlightDetailsShowed && this.isSelectedButtonLoading) {
            this.isSelectedButtonLoading = false;
            this.sharedService.showBrandedFares(this.airItinerary);
          }
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
