import { Component, ElementRef, inject, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  public sharedService = inject(SharedService);
  private ngZone = inject(NgZone);

  index = 0;
  intervalId: any;

  error = false;
  email = '';
  token = '';
  images: string[] = [
    'assets/images/search-box/1.png',
    'assets/images/search-box/2.png',
    'assets/images/search-box/3.png',
    'assets/images/search-box/4.png',
    'assets/images/search-box/5.png',
    'assets/images/search-box/6.png',
    'assets/images/search-box/7.png',
  ];
  currentImage: string = this.images[0];

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.startImageRotation();
    }

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

  startImageRotation(): void {
    if (typeof window !== 'undefined') {
      // Run the interval OUTSIDE Angular's Zone so it doesn't block hydration (NG0506).
      // The state update (this.index) is brought back into Zone via ngZone.run().
      this.ngZone.runOutsideAngular(() => {
        this.intervalId = setInterval(() => {
          this.ngZone.run(() => {
            this.index = (this.index + 1) % this.images.length;
            this.currentImage = this.images[this.index];
          });
        }, 5000);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.subscription.unsubscribe();
  }
}
