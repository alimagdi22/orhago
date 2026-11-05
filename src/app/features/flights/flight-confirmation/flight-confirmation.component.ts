import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'rp-travel-ui';
import { IMainButton } from '../../../shared/models/flights/mainButton.model';

@Component({
  standalone: false,
  selector: 'app-flight-confirmation',
  templateUrl: './flight-confirmation.component.html',
  styleUrl: './flight-confirmation.component.scss',
})
export class FlightConfirmationComponent implements OnInit {
  public confirmationService = inject(ConfirmationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  todayDate = new Date();
  searchButton: IMainButton = {
    height: '48px',
    width: '220px',
    borderRadius: '8px',
    backgroundColor: '#213567',
    color: 'white',
  };

  ngOnInit(): void {
    console.log(this.route.snapshot.queryParamMap);
    if (this.route.snapshot.queryParamMap.has('sid') && this.route.snapshot.queryParamMap.has('HG')) {
      this.confirmationService.getConfirmationDate(
        this.route.snapshot.queryParamMap.get('sid') ?? '',
        this.route.snapshot.queryParamMap.get('HG') ?? '',
        this.route.snapshot.queryParamMap.get('tok') ?? '',
      );
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  public get flights() {
    return this.confirmationService.confirmationData.airItineraries[0].allJourney.flights;
    console.log(this.confirmationService.confirmationData);
  }

  public get airItineraries() {
    return this.confirmationService.confirmationData.airItineraries[0];
  }
  public get passangers() {
    return this.confirmationService.confirmationData.passengersDetails;
  }
}
