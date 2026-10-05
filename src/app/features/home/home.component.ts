import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, FlightSearchService, UserProfileService, VERIFY_TOKEN_STATUS } from 'rp-travel-ui';
import { MostSearchedFlightsService } from './components/flight-deals/most-searched-flights.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);
  public flightSearchService = inject(FlightSearchService);
  public mostSearchedFlightsService = inject(MostSearchedFlightsService);
  public sharedService = inject(SharedService);

  error = false;
  email = '';
  token = '';

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParamMap.subscribe((params) => {
        this.email = params.get('email') ?? '';
        this.token = params.get('token') ? decodeURIComponent(params.get('token')!) : '';

        if (this.email && this.token) {
          this.sharedService.isForgetPasswordSheetShowed = true;
          this.authService.verifyResetPasswordToken(this.token, this.email);
        }
      }),
    );

    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status: any) => {
          if (status === VERIFY_TOKEN_STATUS.faild) {
            console.error('Token is not valid');
            this.sharedService.isForgetPasswordSheetShowed = false;
          }
        },
      }),
    );

    this.subscription.add(
      this.userProfileService.notify.subscribe({
        next: () => {
          if (
            this.userProfileService.user?.email &&
            this.userProfileService.user.email.toLowerCase() !== this.email.toLowerCase() &&
            this.email.toLowerCase()
          ) {
            this.authService.removeToken();
            this.sharedService.isForgetPasswordSheetShowed = false;
          }
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
