import { Component, inject } from '@angular/core';
import { IMainButton } from '../../../../models/flights/mainButton.model';
import { SharedService } from '../../../../shared.service';
import { FlightResultService } from 'rp-travel-ui';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flight-details-header-app',
  templateUrl: './flight-details-header-app.component.html',
  styleUrl: './flight-details-header-app.component.scss'
})
export class FlightDetailsHeaderAppComponent {
  sharedService = inject(SharedService);
  flightResultService = inject(FlightResultService);
      translate = inject(TranslateService)


  selectButton: IMainButton = {
    height: '48px',
    width: '100%',
    borderRadius: '12px',
  };

  onClickExit() {
    this.sharedService.isFlightDetailsShowed = false;
  }

  onClickSelect() {
    this.sharedService.showBrandedFares(this.sharedService.selectedFlightItinerary);
  }
}
