import { ViewportScroller } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input-gg';
import { FlightCheckoutService, FlightResultService, HomePageService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { IMainButton } from '../../../shared/models/flights/mainButton.model';
import { SharedService } from '../../../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flight-checkout',
  templateUrl: './flight-checkout.component.html',
  styleUrl: './flight-checkout.component.scss',
})
export class FlightCheckoutComponent implements OnInit, OnDestroy {
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

  /* Start of Date Properties */

  passportExpiryDate = new Date();

  maxAdultBirthDate = new Date();

  minChildBirthDate = new Date();
  maxChildBirthDate = new Date();

  minInfantBirthDate = new Date();
  maxInfantBirthDate = new Date();

  genderOptions = ['Male', 'Female'];
  selectedGender: string = '';

  /* End of Date Properties */

  countryList = ['USA', 'Canada', 'Mexico'];
  selectedCountry: string = '';

  expiryDate: Date | null = null;
  CountryISO = CountryISO;

  nextButton: IMainButton = {
    height: '48px',
    width: '248px',
    borderRadius: '12px',
  };

  previousButton: IMainButton = {
    height: '48px',
    width: '248px',
    borderRadius: '12px',
  };

  brandedFareId = 0 ;

  ngOnInit(): void {
    this.homePageService.getCountries('en');

    this.subscription.add(
      this.flightResultService.brandedFareNotifier.asObservable().subscribe({
        next: () => {
          if (this.brandedFareId) {
            const brandIndex = this.flightResultService.currentSelectedBrands.findIndex(
              (brand) => {
                console.log(+brand.brandId, +this.brandedFareId)
                return +brand.brandId === +this.brandedFareId;
              },
            );


            if (brandIndex != -1) {
              this.sharedService.selectedBrandedIndex = brandIndex;
            }
          }
        },
      }),
    );

    this.subscription.add(
      this.route.queryParams.subscribe((params) => {
        this.flightCheckoutService.getSelectedFlightData(
          String(params['sid']).split('_')[0],
          +params['sequenceNum'],
          params['providerKey'] ? params['providerKey'] : params['pkey'],
          false,
          String(params['sid']).split('_')[1],
        );
        console.log(this.flightCheckoutService.selectedFlight);


        if(this.homePageService.pointOfSale?.country){
          this.flightCheckoutService.getAllOfflineServices(String(params["sid"]).split('_')[0],this.homePageService.pointOfSale.country,true)
        }else{
          this.flightCheckoutService.getAllOfflineServices(String(params["sid"]).split('_')[0],'KW',true)
        }

        this.flightCheckoutService.getAllOfflineServices(
          params['sid'].split('_')[0],
          this.homePageService.pointOfSale?.country || 'KW',
          true,
        );

        this.flightCheckoutService.pcc = String(params['sid']).split('_')[1];

        if (params['wego_click_id']) {
          if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            localStorage.setItem('click_id', params['wego_click_id']);
          }
        }

        this.brandedFareId = params['brandFareId'];

        this.flightResultService.getBrandedFares(
          String(params['sid']).split('_')[0],
          params['sequenceNum'],
          params['providerKey'] ?? '0',
          String(params['sid']).split('_')[1] ?? '0',
        );
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

            this.passportExpiryDate.setDate(arrivalDate.getDate() + 3);

            // Calculate Adult Birthdate Range
            this.maxAdultBirthDate = new Date(arrivalDate);
            this.maxAdultBirthDate.setFullYear(this.maxAdultBirthDate.getFullYear() - 12);

            // Calculate Child Birthdate Range
            this.maxChildBirthDate = new Date(arrivalDate);
            this.maxChildBirthDate.setFullYear(this.maxChildBirthDate.getFullYear() - 2);

            this.minChildBirthDate = new Date(this.maxAdultBirthDate);
            this.minChildBirthDate.setDate(this.minChildBirthDate.getDate() + 1);

            // Calculate Infant Birthdate Range
            this.maxInfantBirthDate = new Date(arrivalDate);

            this.minInfantBirthDate = new Date(this.maxChildBirthDate);
            this.minInfantBirthDate.setDate(this.minInfantBirthDate.getDate() + 1);
          }
        },
      }),
    );

    this.subscription.add(
      this.flightCheckoutService.paymentLink.asObservable().subscribe({
        next: (res) => {
          this.sharedService.setPaymentLink(res);
          this.sharedService.isIframeLoading = true;
        },
      }),
    );

    this.subscription.add(
      this.flightCheckoutService.paymentLinkFailure.asObservable().subscribe({
        next: () => {
          this.sharedService.isPaymentModalShowed = true;
        },
      }),
    );
  }

   countrySearchFields: SearchCountryField[] = [
    SearchCountryField.Name,
    SearchCountryField.Iso2,
    SearchCountryField.DialCode
  ];

  // Add this method to customize search behavior
  customSearchFn = (query: string, countries: any[]): any[] => {
    if (!query) return countries;

    const lowerQuery = query.toLowerCase();
    const exactMatches:any = [];
    const partialMatches:any = [];

    countries.forEach(country => {
      const matches = [
        country.name.toLowerCase(),
        country.iso2.toLowerCase(),
        `+${country.dialCode}`
      ].some(text => text.includes(lowerQuery));

      if (matches) {
        // Prioritize exact matches at the beginning
        if (country.name.toLowerCase().startsWith(lowerQuery) ||
            `+${country.dialCode}`.startsWith(lowerQuery)) {
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
    return user.get(formControllerName)!.touched && user.get(formControllerName)!.status == 'INVALID';
  }

  closeModal() {
    this.sharedService.isPaymentModalShowed = false;
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
    if (this.flightCheckoutService.usersArray.invalid) {
      for (var i = 0; i < this.flightCheckoutService.usersArray.length; i++) {
        this.flightCheckoutService.usersArray.at(i).markAllAsTouched();
      }
    } else {
      if (this.sharedService.checkoutSteps === 1) {
        this.flightCheckoutService.saveBooking(
          this.homePageService.selectedCurrency.Currency_Code,
          'notPremium',
          this.flightCheckoutService.pcc,
          this.brandedFareId,
        );
      }
      this.sharedService.goToNextCheckoutStep();
    }
  }

  scrollTo() {
    const element = document.getElementById('2');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  get getErrorMessage() {
    return this.flightCheckoutService.getErrorMessage;
  }

  get lang() {
    return this.translate.currentLang === 'en' ? 'en' : 'ar';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.sharedService.checkoutSteps = 0;
    this.sharedService.showPayment = false;
    this.sharedService.selectedBrandedIndex = 0;
    this.flightCheckoutService.destroyer();
    this.closeModal();
  }
}
