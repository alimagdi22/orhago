import { Component, EventEmitter, inject, Output } from '@angular/core';
import { IMainButton } from '../../models/flights/mainButton.model';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../shared.service';
import { FlightResultService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrl: './session-timeout.component.scss',
})
export class SessionTimeoutComponent {
  @Output() sessionTimeoutClosed = new EventEmitter<null>();

  route = inject(ActivatedRoute);
  sharedService = inject(SharedService);
  flightResultService = inject(FlightResultService);

  updateSeachButton: IMainButton = {
    height: '48px',
    width: '248px',
    borderRadius: '12px',
  };

  backToHomeButton: IMainButton = {
    height: '48px',
    width: '248px',
    borderRadius: '6px',
  };

  onClickUpdateSearchButton() {
    let lang = this.route.snapshot.params['language'];
    let currency = this.route.snapshot.params['currency'];
    let pointOfReservation = this.route.snapshot.params['SearchPoint'];
    let flightType = this.route.snapshot.params['flightType'];
    let flightsInfo = this.route.snapshot.params['flightInfo'];

    let serachId = this.route.snapshot.params['searchId'];
    let passengers = this.route.snapshot.params['passengers'];
    let Cclass = this.route.snapshot.params['Cclass'];
    let destinationType = this.route.snapshot.params['destinationType'];
    let showDirect: boolean = this.route.snapshot.params['directOnly'] !== 'false';

    this.sharedService.flightType = flightType?.toLowerCase() || '';

    this.flightResultService.getDataFromUrl(
      lang,
      currency,
      pointOfReservation,
      flightType,
      flightsInfo,
      serachId,
      passengers,
      Cclass,
      showDirect,
      destinationType || 'Airport_Airport',
      5,
      2,
    );

    this.sharedService.isSessionTimeoutModalShowed = false;
    this.sessionTimeoutClosed.emit(null);
  }
}
