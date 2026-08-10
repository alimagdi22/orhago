import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AIR_ITINERARIES_DEFAULT, EnvironmentService, FlightResultService, FlightSearchService, IAirItinerary } from 'rp-travel-ui';
import { Subscription, interval, Subject } from 'rxjs';
import { FlightDetailsComponent } from './components/flights/flight-details/flight-details.component';
import { IDestinationCard } from './models/flights/destinationCard.model';
import { ISelectedDest } from './models/flights/selectedDest.model';
import { initialRecommendedAirports } from '../core/constants/recommendedAirports';
import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormGroup } from '@angular/forms';
import { HotelCheckoutService } from 'rp-hotels-ui';
import { FlightDetailsAppComponent } from './components/flights/flight-details-app/flight-details-app.component';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  flightSearchService = inject(FlightSearchService);
  flightResultService = inject(FlightResultService);
  hotelCheckoutService = inject(HotelCheckoutService);

  selectedDestions: ISelectedDest[] = [];

  isBrandedFaresShowed = false;

  isFlightDetailsShowed = false;
  selectedItinerary = -1;
  selectedBrandedIndex = 0;
  selectedFlightItinerary: IAirItinerary = AIR_ITINERARIES_DEFAULT;

  isPaymentModalShowed = false;
  isSessionTimeoutModalShowed = false;
  flightType = 'oneway';
  showPayment = false;
  isIframeLoading = false;

  isAddReturnClicked = false;
  users: any = [];

  isErrorSheetShowed = false;
  errorSheetMessage = '';
  userManagementNotifier = new Subject<any>();

  isCitiesLoading = false;
  isHotelPhoneNumberInvalid = false;

  http = inject(HttpClient);
  environment = inject(EnvironmentService);
  router = inject(Router);
  sanitizer = inject(DomSanitizer);
  translate = inject(TranslateService);

  landCity: string = '';
  phonenumber: string = '';
  calenderClicked: boolean = false; //used when click round trip calender in searchbox one way component (+ sign)
  headerView: boolean = true;
  roundTripDatepickerMobileView: boolean = false;

  yesOrNoVaild?: boolean;
  packageVaild?: boolean;
  addbuttonVaild?: boolean;
  otpAccess = false;

  sessionExpired: boolean = false;
  sessionTimeLeft: string = '30:00';
  duration: number = 30 * 60; // 30 minutes in seconds
  minutes: number = 30;
  seconds: number = 0;
  timerSubscription!: Subscription;
  readonly TIMER_STORAGE_KEY = 'countdown_timer';

  checkoutSteps = 0;
  mySafeUrl: null | SafeResourceUrl = null;

  /* User Management */
  isLogInSheetShowed = false;
  isRegisterSheetShowed = false;
  isOTPShowed = false;
  isForgetPasswordSheetShowed = false;
  isResetPasswordSheetShowed = false;

  initialRecommendedAirports = initialRecommendedAirports;

  screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

  constructor(public dialog: MatDialog) {}

  public showFlightDetails(airItinerary: IAirItinerary | null): void {
    if (airItinerary) {
      this.selectedFlightItinerary = airItinerary;
    }

    if (this.screenWidth >= 1200) {
      this.isFlightDetailsShowed = true;
    } else {
      this.dialog.open(FlightDetailsComponent, {
        data: {
          dismiss: () => this.dialog.closeAll(),
        },
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        hasBackdrop: true
      });
    }
  }
  public showFlightDetailsApp(airItinerary: IAirItinerary | null): void {
    if (airItinerary) {
      this.selectedFlightItinerary = airItinerary;
    }

    if (this.screenWidth >= 1200) {
      this.isFlightDetailsShowed = true;
    } else {
      this.dialog.open(FlightDetailsAppComponent, {
        data: {
          dismiss: () => this.dialog.closeAll(),
        },
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        hasBackdrop: true
      });
    }
  }

  public showBrandedFares(airItinerary: IAirItinerary): void {
    if (airItinerary) {
      this.selectedFlightItinerary = airItinerary;
    }

    if (this.flightResultService.currentSelectedBrands.length > 1) {
      this.isBrandedFaresShowed = true;
    } else {
      this.onSelectFlight(airItinerary.sequenceNum, airItinerary.pcc, airItinerary.pKey);
    }

    if(this.screenWidth >= 1200) {
      this.isFlightDetailsShowed = false;
    } else {
      this.dialog.closeAll();
    }
  }

  public hideBrandedFares() {
    if (!this.flightResultService.isBrandedFaresLoading) {
      this.isBrandedFaresShowed = false;
    }
  }

  public showErrorSheet(msg: string) {
    this.isErrorSheetShowed = true;
    this.errorSheetMessage = msg;
  }

  public hideErrorSheet() {
    this.isErrorSheetShowed = false;
    this.errorSheetMessage = '';
  }

  setPaymentLink(url: string) {
    this.mySafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getTopDestination() {
    const Api = `${this.environment.searchflow}/api/FlightsTopDistinations/GetAll`;
    return this.http.get<IDestinationCard>(Api);
  }

  // Start or continue the timer
  startTimer() {
    this.sessionExpired = false;
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.duration > 0) {
        this.duration--;
        this.updateTime();
        this.saveTimer();
      } else {
        this.timerSubscription.unsubscribe();
        alert('Session Ended!');
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.removeItem(this.TIMER_STORAGE_KEY);
        } // Clear storage on timer end
        this.sessionExpired = true;
      }
    });
  }

  // Update the displayed time in minutes and seconds
  updateTime() {
    this.minutes = Math.floor(this.duration / 60);
    this.seconds = this.duration % 60;
    this.sessionTimeLeft = this.minutes + ':' + this.seconds;
  }

  // Save the remaining time to localStorage
  saveTimer() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.TIMER_STORAGE_KEY, this.duration.toString());
    }
  }

  // Load the remaining time from localStorage
  loadTimer() {
    const savedDuration = (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(this.TIMER_STORAGE_KEY) : null);
    if (savedDuration) {
      this.duration = parseInt(savedDuration, 10);
    } else {
      this.duration = 30 * 60; // If no saved time, start from 30 minutes
    }
    this.updateTime(); // Update the displayed time
  }

  isSegmentPresent(segments: string[]): boolean {
    for (let i = 0; i < segments.length; i++) {
      if (this.router.url.includes(segments[i])) {
        return true;
      }
    }
    return false;
  }

  convertTimeToDayAndHour(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);

    return `${hours}h ${minutes}m`;
  }

  onSelectFlight(sequenceNum: number, pcc: string, pKey?: string, brandFareId?: string) {
    this.scrollToTop();
    this.router.navigate(['/flight-checkout'], {
      queryParams: {
        sid: this.flightResultService.searchID + '_' + pcc,
        sequenceNum: sequenceNum,
        providerKey: pKey,
        brandFareId: brandFareId ?? '-1',
      },
    });
  }

  goToNextCheckoutStep() {
    if (this.checkoutSteps < 2) this.checkoutSteps++;
    this.scrollToTop();
  }

  goToPreviousCheckoutStep() {
    if (this.checkoutSteps > 0) this.checkoutSteps--;
  }

  getPassengerTypeName(passengerType: string) {
    switch (passengerType) {
      case 'CNN':
        return 'Child';
      case 'INF':
        return 'Infant';
    }

    return 'Adult';
  }

  scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  checkHotelPhoneNumberValidation() {
    let phone: FormGroup = <FormGroup>(this.hotelCheckoutService.HotelForm.get('Travellers') as any)['controls'][0];

    if (phone.get('phonenum')!.invalid && (phone.get('phonenum')!.touched || phone.get('phonenum')!.dirty)) {
      this.isHotelPhoneNumberInvalid = true;
    } else {
      this.isHotelPhoneNumberInvalid = false;
    }
  }

  get lang(): 'ar' | 'en' {
    const current = this.translate.currentLang || this.translate.defaultLang || 'en';
    return (current === 'ar' ? 'ar' : 'en') as 'ar' | 'en';
  }
}
