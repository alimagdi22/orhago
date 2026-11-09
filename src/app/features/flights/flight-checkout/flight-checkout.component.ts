import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, AfterViewChecked, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input-gg';
import { FlightCheckoutService, FlightResultService, HomePageService , selectedFlight } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { IMainButton } from '../../../shared/models/flights/mainButton.model';
import { SharedService } from '../../../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { CheckoutDateAdapter } from './checkout-date-ltr.directive';

@Component({
  standalone: false,
  selector: 'app-flight-checkout',
  templateUrl: './flight-checkout.component.html',
  styleUrl: './flight-checkout.component.scss',
  providers: [{ provide: DateAdapter, useClass: CheckoutDateAdapter }],
})
export class FlightCheckoutComponent implements OnInit, AfterViewChecked, OnDestroy {
  translate = inject(TranslateService);
  sharedService = inject(SharedService);
  flightCheckoutService = inject(FlightCheckoutService);
  flightResultService = inject(FlightResultService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  homePageService = inject(HomePageService);
  viewportScroller = inject(ViewportScroller);

  subscription = new Subscription();
  leaveCity: string = '';
  departDate: Date = new Date();
  returnDate: Date = new Date();
  arrivalCity: string = '';
  flightType: string = '';
  sessionExpired: boolean = false;
  isPhoneNumberInvalid = false;

  passportExpiryDate = new Date();
  maxAdultBirthDate = new Date();
  minChildBirthDate = new Date();
  maxChildBirthDate = new Date();
  minInfantBirthDate = new Date();
  maxInfantBirthDate = new Date();

  genderOptions = ['Male', 'Female'];
  selectedGender: string = '';
  countryList = ['USA', 'Canada', 'Mexico'];
  selectedCountry: string = '';
  expiryDate: Date | null = null;
  CountryISO = CountryISO;

  nextButton: IMainButton = {
    height: '48px',
    width: '248px',
    borderRadius: '12px',
    backgroundColor: '#213567',
    color:'white'
  };

  previousButton: IMainButton = {
    height: '48px',
    width: '248px',
    borderRadius: '12px',
  };

  brandedFareId = 0;
  wegoClickId = '';

  selectedFlight: selectedFlight | null = null;
  private platformId = inject(PLATFORM_ID);
  private loadedFlightKey = '';
  private scrolledToContact = false;
  private scrolledToBrands = false;
  private scrolledToPayment = false;
  private paymentScrollTimer: ReturnType<typeof setTimeout> | null = null;
  private paymentAlignTimer: ReturnType<typeof setTimeout> | null = null;
  private contactScrollTimer: ReturnType<typeof setTimeout> | null = null;
  private brandScrollTimer: ReturnType<typeof setTimeout> | null = null;
  private brandAlignTimer: ReturnType<typeof setTimeout> | null = null;
  private stopHoldingPayment: (() => void) | null = null;
  private previousScrollRestoration: ScrollRestoration | null = null;

  ngOnInit(): void {
    if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
      this.previousScrollRestoration = history.scrollRestoration;
      history.scrollRestoration = 'manual';
    }

    this.homePageService.getCountries('en');

    this.subscription.add(
      this.flightResultService.brandedFareNotifier.asObservable().subscribe({
        next: () => {
          if (this.brandedFareId) {
            this.sharedService.applyBrandFareId(this.brandedFareId);
          }
        },
      }),
    );

    this.subscription.add(
      this.flightCheckoutService.selectedFlightLang.subscribe({
        next: () => {
          const flight = this.flightCheckoutService.selectedFlight;
          if (!flight) return;

          this.selectedFlight = flight;
          const language = String(flight.searchCriteria?.language || '').toLowerCase().startsWith('ar')
            ? 'ar'
            : 'en';
          if (language !== this.translate.currentLang) {
            this.translate.use(language);
          }
          this.applyFlightCurrency(flight.searchCriteria?.currency);
        },
      }),
    );

    this.subscription.add(
      this.route.queryParams.subscribe((params) => {
        const providerKey = params['providerKey'] || params['pkey'] || params['PKey']  || params['pKey']  || params['Pkey'];
        const flightKey = `${params['sid']}|${params['sequenceNum']}|${providerKey}`;
        this.wegoClickId = params['wego_click_id'] || params['Wego_click_id'] || '';
        this.brandedFareId = params['brandFareId'];

        if (this.brandedFareId) {
          this.sharedService.applyBrandFareId(this.brandedFareId);
        }

        if (this.loadedFlightKey === flightKey) {
          return;
        }
        this.loadedFlightKey = flightKey;

        this.flightCheckoutService.getSelectedFlightData(
          String(params['sid']).split('_')[0],
          +params['sequenceNum'],
          providerKey,
          false,
          String(params['sid']).split('_')[1],
        );

        if (this.homePageService.pointOfSale?.country) {
          this.flightCheckoutService.getAllOfflineServices(
            String(params['sid']).split('_')[0],
            this.homePageService.pointOfSale.country,
            true,
          );
        } else {
          this.flightCheckoutService.getAllOfflineServices(String(params['sid']).split('_')[0], 'KW', true);
        }

        this.flightCheckoutService.pcc = String(params['sid']).split('_')[1];

        this.wegoClickId = params['wego_click_id'] || '';

        if (this.wegoClickId) {
          const searchId = String(params['sid']).split('_')[0];
          if (searchId && searchId !== 'undefined') {
            this.flightResultService.searchID = searchId;
          }

          if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.setItem('click_id', this.wegoClickId);
          }


        }

        this.brandedFareId = params['brandFareId'];

        if (this.wegoClickId) {
          this.flightResultService.getBrandedFares(
            String(params['sid']).split('_')[0],
            params['sequenceNum'],
            providerKey || '0',
            String(params['sid']).split('_')[1] ?? '0',
          );
        }
      }),
    );

    this.subscription.add(
      this.flightCheckoutService.notify.asObservable().subscribe({
        next: (res) => {
          if (res === 1) {
            if (this.flightCheckoutService.selectedFlightError) {
              this.router.navigate(['/']);
            }

            let arrivalDate = new Date();
            const flightObj = this.flightCheckoutService.selectedFlight;

            if (flightObj) {
              if (this.wegoClickId && flightObj.airItineraryDTO) {
                const query = this.route.snapshot.queryParams;
                const itinerary = flightObj.airItineraryDTO;
                this.sharedService.selectedFlightItinerary = {
                  ...itinerary,
                  sequenceNum: itinerary.sequenceNum || +query['sequenceNum'],
                  pcc: itinerary.pcc || this.flightCheckoutService.pcc,
                  pKey: itinerary.pKey || query['providerKey'] || query['pkey'],
                };
              }

              const flights = flightObj.airItineraryDTO.allJourney.flights;
              const flightType = flightObj.searchCriteria.flightType.toLowerCase();

              switch (flightType) {
                case 'roundtrip':
                  arrivalDate = new Date(flights[1].flightDTO[flights[1].flightDTO.length - 1].arrivalDate);
                  break;
                case 'oneway':
                  arrivalDate = new Date(flights[0].flightDTO[flights[0].flightDTO.length - 1].arrivalDate);
                  break;
                case 'multicity':
                  arrivalDate = new Date(
                    flights[flights.length - 1].flightDTO[flights[flights.length - 1].flightDTO.length - 1].arrivalDate,
                  );
              }
            }

            const passportExpiry = new Date();
            passportExpiry.setDate(arrivalDate.getDate() + 3);
            this.passportExpiryDate = passportExpiry;

            this.maxAdultBirthDate = new Date(arrivalDate);
            this.maxAdultBirthDate.setFullYear(this.maxAdultBirthDate.getFullYear() - 12);

            this.maxChildBirthDate = new Date(arrivalDate);
            this.maxChildBirthDate.setFullYear(this.maxChildBirthDate.getFullYear() - 2);

            this.minChildBirthDate = new Date(this.maxAdultBirthDate);
            this.minChildBirthDate.setDate(this.minChildBirthDate.getDate() + 1);

            this.maxInfantBirthDate = new Date(arrivalDate);

            this.minInfantBirthDate = new Date(this.maxChildBirthDate);
            this.minInfantBirthDate.setDate(this.minInfantBirthDate.getDate() + 1);
          }
        },
      }),
    );

    this.subscription.add(
      this.flightCheckoutService.paymentLinkFailure.asObservable().subscribe({
        next: () => {
          this.flightCheckoutService.saveBookingLoadeer = false;
          this.sharedService.isPaymentModalShowed = true;
        },
      }),
    );
    console.log(this.flightCheckoutService.usersArray.controls, 'users');
  }

  private applyFlightCurrency(code: string | undefined): void {
    const currencyCode = String(code || '').trim().toUpperCase();
    if (!currencyCode) return;

    const apply = () => {
      const match = this.homePageService.allCurrency.find(
        (currency) => currency.Currency_Code?.toUpperCase() === currencyCode,
      );
      if (!match) return false;
      this.homePageService.setSelectedCurrency(match);
      return true;
    };

    if (apply()) return;

    if (!this.homePageService.allCurrency.length && !this.homePageService.loader) {
      this.homePageService.getCurrency('AED');
    }

    const waitForCurrencies = this.homePageService.notify.subscribe(() => {
      if (apply()) waitForCurrencies.unsubscribe();
    });
    this.subscription.add(waitForCurrencies);
  }

  ngAfterViewChecked(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const brandsVisible =
      !!this.wegoClickId &&
      !this.sharedService.wegoBrandSelected &&
      this.flightResultService.currentSelectedBrands.length > 0;
    const checkoutReady = !this.flightCheckoutService.loader && !this.flightResultService.isBrandedFaresLoading;

    if (brandsVisible && !this.scrolledToBrands && checkoutReady && this.brandScrollTimer == null) {
      this.brandScrollTimer = setTimeout(() => this.scrollToBrands(), 150);
    }

    if (
      !brandsVisible &&
      !this.scrolledToContact &&
      checkoutReady &&
      this.contactScrollTimer == null
    ) {
      this.contactScrollTimer = setTimeout(() => this.scrollToContact(), 150);
    }

    if (!this.scrolledToPayment && this.sharedService.checkoutSteps >= 2 && this.paymentScrollTimer == null) {
      this.paymentScrollTimer = setTimeout(() => {
        this.paymentScrollTimer = null;
        const payment = document.getElementById('payment-card-container');
        if (!payment || typeof window === 'undefined') return;

        this.scrolledToPayment = true;
        const alignPayment = (behavior: ScrollBehavior) => {
          const headerHeight = Array.from(document.querySelectorAll('app-navbar .wrapper, app-navbar .top-nav'))
            .filter((element) => {
              const style = getComputedStyle(element);
              return style.display !== 'none' && style.position === 'fixed' && element.getBoundingClientRect().height > 0;
            })
            .reduce((height, element) => Math.max(height, element.getBoundingClientRect().height), 0);
          const offset = headerHeight + 16;
          const sectionTop = payment.getBoundingClientRect().top + window.scrollY;
          const fits = payment.offsetHeight <= window.innerHeight - offset;
          const top = fits ? sectionTop - offset : sectionTop - headerHeight - 8;
          window.scrollTo({ top: Math.max(top, 0), behavior });
        };
        alignPayment('smooth');
        this.paymentAlignTimer = setTimeout(() => {
          this.paymentAlignTimer = null;
          alignPayment('auto');
          this.holdPaymentInPlace(payment);
        }, 600);
      }, 80);
    }
  }


  private holdPaymentInPlace(payment: HTMLElement): void {
    this.stopHoldingPayment?.();

    const lockedTop = payment.getBoundingClientRect().top;
    let lastLayout = 0;
    let lastUserInput = 0;
    let correcting = false;

    const restore = () => {
      if (correcting || performance.now() - lastUserInput < 200) return;
      const delta = payment.getBoundingClientRect().top - lockedTop;
      if (Math.abs(delta) < 2) return;
      correcting = true;
      window.scrollTo({ top: Math.max(window.scrollY + delta, 0), behavior: 'auto' });
      correcting = false;
    };

    const onLayout = () => {
      lastLayout = performance.now();
      restore();
      requestAnimationFrame(restore);
    };

    const onScroll = () => {
      if (correcting || performance.now() - lastLayout > 1200) return;
      restore();
    };

    const markUser = () => {
      lastUserInput = performance.now();
    };

    const observer = new ResizeObserver(onLayout);
    observer.observe(payment);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', markUser, { passive: true });
    window.addEventListener('touchmove', markUser, { passive: true });

    let releaseTimer: ReturnType<typeof setTimeout>;
    const stop = () => {
      clearTimeout(releaseTimer);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', markUser);
      window.removeEventListener('touchmove', markUser);
      if (this.stopHoldingPayment === stop) this.stopHoldingPayment = null;
    };
    releaseTimer = setTimeout(stop, 12000);

    this.stopHoldingPayment = stop;
  }

  private scrollToBrands(): void {
    this.brandScrollTimer = null;
    const header = this.visibleFlexFareHeader();
    if (!header || typeof window === 'undefined') return;

    this.scrolledToBrands = true;
    this.sharedService.scrollElementToTop(header);

    this.brandAlignTimer = setTimeout(() => {
      this.brandAlignTimer = null;
      const current = this.visibleFlexFareHeader();
      if (!current) return;

      const delta = current.getBoundingClientRect().top - this.sharedService.fixedNavbarHeight();
      if (delta > 8) {
        window.scrollTo({ top: Math.max(window.scrollY + delta, 0), behavior: 'auto' });
      }
    }, 500);
  }

  private visibleFlexFareHeader(): HTMLElement | null {
    const headers = document.querySelectorAll<HTMLElement>(
      '#checkout-branded-fares app-flex-fare .mobile-header, #checkout-branded-fares app-flex-fare .desktop-header',
    );

    return (
      Array.from(headers).find((header) => {
        const style = getComputedStyle(header);
        return style.display !== 'none' && header.getBoundingClientRect().height > 0;
      }) ?? null
    );
  }

  private scrollToContact(): void {
    this.contactScrollTimer = null;
    const contact = document.getElementById('checkout-contact-group');
    if (!contact || typeof window === 'undefined') return;

    this.scrolledToContact = true;
    const top = contact.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }


  countrySearchFields: SearchCountryField[] = [
    SearchCountryField.Name,
    SearchCountryField.Iso2,
    SearchCountryField.DialCode,
  ];

  customSearchFn = (query: string, countries: any[]): any[] => {
    if (!query) return countries;

    const lowerQuery = query.toLowerCase();
    const exactMatches: any = [];
    const partialMatches: any = [];

    countries.forEach((country) => {
      const matches = [country.name.toLowerCase(), country.iso2.toLowerCase(), `+${country.dialCode}`].some((text) =>
        text.includes(lowerQuery),
      );

      if (matches) {
        if (country.name.toLowerCase().startsWith(lowerQuery) || `+${country.dialCode}`.startsWith(lowerQuery)) {
          exactMatches.push(country);
        } else {
          partialMatches.push(country);
        }
      }
    });

    return [...exactMatches, ...partialMatches];
  };

  getMinDate(passengerType: string) {
    switch (passengerType) {
      case 'CNN':
        return this.minChildBirthDate;
      case 'INF':
        return this.minInfantBirthDate;
    }
    return null;
  }

  getMaxDate(passengerType: string) {
    switch (passengerType) {
      case 'CNN':
        return this.maxChildBirthDate;
      case 'INF':
        return this.maxInfantBirthDate;
    }
    return this.maxAdultBirthDate;
  }

  assignCountries(event: any, index: number) {
    this.flightCheckoutService.usersArray.at(index).get('countryOfResidence')?.setValue(event.option.value);
    this.flightCheckoutService.usersArray.at(index).get('nationality')?.setValue(event.option.value);
    this.flightCheckoutService.usersArray.at(index).get('isIssuedCountrySelected')?.setValue(true);
  }

  onInputIssuedCountry(index: number) {
    this.flightCheckoutService.usersArray.at(index).get('isIssuedCountrySelected')?.setValue(false);
  }

  isInputValid(user: AbstractControl, formControllerName: string) {
    return user.get(formControllerName)!.touched && user.get(formControllerName)!.status === 'INVALID';
  }

  closeModal() {
    this.sharedService.isPaymentModalShowed = false;
    this.flightCheckoutService.paymentError = false;
    this.flightCheckoutService.saveBookingLoadeer = false;
  }

  checkPhoneNumberValidation() {
    let phone: FormGroup = <FormGroup>(<FormArray>this.flightCheckoutService.usersForm.get('users'))['controls'][0];

    if (phone.get('phoneNumber')!.invalid && (phone.get('phoneNumber')!.touched || phone.get('phoneNumber')!.dirty)) {
      this.isPhoneNumberInvalid = true;
    } else {
      this.isPhoneNumberInvalid = false;
    }
  }

  onClickNext() {
    if (this.sharedService.blockCheckoutWithoutBrand()) {
      return;
    }

    if (this.flightCheckoutService.usersArray.invalid) {
      for (var i = 0; i < this.flightCheckoutService.usersArray.length; i++) {
        this.flightCheckoutService.usersArray.at(i).markAllAsTouched();
      }
    } else {
      this.sharedService.goToNextCheckoutStep();
    }
  }

  get getErrorMessage() {
    return (control: AbstractControl, fieldName: string, lang: 'en' | 'ar') => {
      const message = this.flightCheckoutService.getErrorMessage(control, fieldName as never, lang);
      if (message) return message;
      if (
        control?.hasError('matDatepickerMin') ||
        control?.hasError('matDatepickerMax') ||
        control?.hasError('matDatepickerParse')
      ) {
        return lang === 'ar' ? 'يرجى اختيار تاريخ ضمن النطاق المسموح.' : 'Please choose a date within the allowed range.';
      }
      return '';
    };
  }

  get lang() {
    return this.translate.currentLang === 'en' ? 'en' : 'ar';
  }

  getPassengerNumber(index: number): number {
    const controls = this.flightCheckoutService.usersArray?.controls;
    if (!controls || index < 0 || index >= controls.length) {
      return index + 1;
    }

    const currentType = this.sharedService.getPassengerTypeName(controls[index].value?.PassengerType);
    let count = 0;
    for (let i = 0; i <= index; i++) {
      const type = this.sharedService.getPassengerTypeName(controls[i].value?.PassengerType);
      if (type === currentType) {
        count++;
      }
    }
    return count;
  }

  ngOnDestroy(): void {
    this.stopHoldingPayment?.();
    if (this.paymentScrollTimer != null) {
      clearTimeout(this.paymentScrollTimer);
    }
    if (this.paymentAlignTimer != null) {
      clearTimeout(this.paymentAlignTimer);
    }
    if (this.contactScrollTimer != null) {
      clearTimeout(this.contactScrollTimer);
    }
    if (this.brandScrollTimer != null) {
      clearTimeout(this.brandScrollTimer);
    }
    if (this.brandAlignTimer != null) {
      clearTimeout(this.brandAlignTimer);
    }
    if (this.previousScrollRestoration && typeof history !== 'undefined') {
      history.scrollRestoration = this.previousScrollRestoration;
    }
    this.subscription.unsubscribe();
    this.sharedService.checkoutSteps = 0;
    this.sharedService.showPayment = false;
    this.sharedService.selectedBrandedIndex = 0;
    this.sharedService.selectedBrandFareId = null;
    this.sharedService.wegoBrandSelected = false;
    this.sharedService.wegoBrandRequiredError = false;
    this.flightCheckoutService.destroyer();
    this.closeModal();
  }
}
