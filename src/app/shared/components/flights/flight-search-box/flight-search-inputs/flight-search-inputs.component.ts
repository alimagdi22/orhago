import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FlightResultService, FlightSearchService, HomePageService } from 'rp-travel-ui';
import { ICity } from '../../../../models/flights/city.model';
import { IMainButton } from '../../../../models/flights/mainButton.model';
import { IResultLink } from '../../../../models/flights/resultLink.model';
import { SharedService } from '../../../../shared.service';
import { ISelectedDest } from '../../../../models/flights/selectedDest.model';
import { IAirPort } from '../../../../models/flights/airport.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IAirPortTranslated } from '../../../../../core/models/airport.model';

@Component({
  standalone: false,
  selector: 'app-flight-search-inputs',
  templateUrl: './flight-search-inputs.component.html',
  styleUrl: './flight-search-inputs.component.scss',
})
export class FlightSearchInputsComponent implements AfterViewInit, OnInit {
  @Input({ required: true }) flightType = '';
  @Output() addReturnClicked = new EventEmitter<null>();

  /* Start of Services */
  flightSearchService = inject(FlightSearchService);
  homePageService = inject(HomePageService);
  router = inject(Router);
  translate = inject(TranslateService);
  sharedService = inject(SharedService);
  private platformId = inject(PLATFORM_ID);
  public isBrowser = isPlatformBrowser(this.platformId);

  resultParams: IResultLink | null = null;
  openReturnDateCalendar = 0;

  /* Cabin Class Properties */
  cabinClassDoneButton: IMainButton = {
    height: '42px',
    width: '100%',
    borderRadius: '6px',
  };

  /* Button Properties */
  searchButton: IMainButton = {
    height: '56px',
    width: '100%',
    borderRadius: '12px',
  };

  addFlightButton: IMainButton = {
    height: '42px',
    width: '130px',
    borderRadius: '12px',
  };

  /* Input Activations Properties */
  openlandingDestinationInput = 0;
  openDepartingDateCalendar = 0;
  openCabinMenu = 0;

  public isSelectButtonLoading = false;
  public departingType: string = '';
  public landingType: string = '';
  public destinationType: string = 'Airport_Airport';

  ngOnInit(): void {
    for (let i = 0; i < this.flightSearchService.flightsArray.length; i++) {
      this.sharedService.selectedDestions[i] = {
        departingCity: null,
        landingCity: null,
      };
    }

    let form = this.isBrowser ? JSON.parse(localStorage.getItem('form') as string) : null;

    if (this.isBrowser) {
      this.restoreDestinationTypeFromCache();
    }
  }

  private restoreDestinationTypeFromCache() {
    if (!this.isBrowser) return;
    try {
      const departingSelections = JSON.parse(localStorage.getItem('departing') ?? '[]');
      const landingSelections = JSON.parse(localStorage.getItem('landing') ?? '[]');

      const departingType = this.getSelectionType(departingSelections?.[0]);
      const landingType = this.getSelectionType(landingSelections?.[0]);

      if (departingType) {
        this.departingType = departingType;
      }
      if (landingType) {
        this.landingType = landingType;
      }

      if (this.departingType && this.landingType) {
        this.destinationType = `${this.departingType}_${this.landingType}`;
        this.sharedService.destinationType = this.destinationType;
      }
    } catch (e) {}
  }

  private getSelectionType(selection: any): 'City' | 'Airport' | '' {
    if (!selection) return '';
    return selection._isCitySelection ? 'City' : 'Airport';
  }

  updateDestinationType(event: { dest: 'departing' | 'landing'; type: 'City' | 'Airport' }) {
    if (event.dest === 'departing') {
      this.departingType = event.type;
    } else if (event.dest === 'landing') {
      this.landingType = event.type;
    }

    if (this.departingType && this.landingType) {
      this.destinationType = `${this.departingType}_${this.landingType}`;
      this.sharedService.destinationType = this.destinationType;
    }
  }

  ngAfterViewInit(): void {
    if (this.sharedService.isAddReturnClicked) {
      this.openReturnDateCalendar = 1;
      this.sharedService.isAddReturnClicked = false;
    }
  }

  switchDestination(item: AbstractControl, index: number) {
    this.flightSearchService.switchDestination(item);

    const departingCity = this.sharedService.selectedDestions[index]?.departingCity;
    if (this.sharedService.selectedDestions[index]) {
      this.sharedService.selectedDestions[index].departingCity = this.sharedService.selectedDestions[index].landingCity;
      this.sharedService.selectedDestions[index].landingCity = departingCity;
    }

    if (this.isBrowser) {
      const landing = localStorage.getItem('landing');
      const departing = localStorage.getItem('departing');

      localStorage.setItem('departing', landing ?? '');
      localStorage.setItem('landing', departing ?? '');
    }

    item.markAllAsTouched();
  }

  onClickAddReturn() {
    this.addReturnClicked.emit(null);
  }

  onSubmit() {
    this.flightSearchService.flightsArray.at(0)?.markAllAsTouched();
    this.flightSearchService.searchFlight?.get('returnDate')?.markAsTouched();
    this.isSelectButtonLoading = true;

    const lang = this.translate.currentLang || 'en';
    const currency = this.homePageService.selectedCurrency?.Currency_Code || 'KWD';
    const resultLink = this.flightSearchService.onSubmit(
      lang,
      currency,
      this.homePageService.pointOfSale ? this.homePageService.pointOfSale.country! : 'KW',
      ',',
      this.sharedService.destinationType || this.destinationType,
    );
    let splittedLink = resultLink.toString().split('/');

    if (typeof resultLink == 'object') {
      this.flightSearchService.searchFlight?.updateValueAndValidity();
      this.isSelectButtonLoading = false;
    } else if (typeof resultLink == 'string' && resultLink != '') {
      if (this.flightSearchService.searchFlight?.valid) {
        this.sharedService.landCity = (<FormArray>this.flightSearchService.searchFlight?.get('Flights'))
          .at(0)
          .get('landing')
          ?.value.split(',')[0];

        this.resultParams = {
          language: splittedLink[0],
          currency: splittedLink[1],
          searchPoint: splittedLink[2],
          flightType: splittedLink[3],
          flightInfo: splittedLink[4],
          searchId: splittedLink[5],
          passengers: splittedLink[6],
          cabinClass: splittedLink[7],
          directOnly: splittedLink[8] === 'false' ? false : true,
          destinationType: splittedLink[9],
        };
        this.sharedService.scrollToTop();
        this.router
          .navigate(['/flight-results', ...splittedLink])
          .then(() => {
            this.isSelectButtonLoading = false;
          })
          .catch(() => {
            this.isSelectButtonLoading = false;
          });
        if (this.isBrowser) {
          localStorage.setItem('form', JSON.stringify(this.flightSearchService.searchFlight?.value));
        }
      } else {
        this.flightSearchService.searchFlight?.markAllAsTouched();
        this.flightSearchService.searchFlight?.get('returnDate')?.markAsTouched();
        this.isSelectButtonLoading = false;
      }
    }
  }

  addFlight() {
    if (this.isBrowser) {
      let landingAirports = JSON.parse(localStorage.getItem('landing') ?? '[]');
      let airport = landingAirports[this.flightSearchService.flightsArray?.['controls']?.length - 1];

      if (airport) {
        let departionAirports = JSON.parse(localStorage.getItem('departing') ?? '[]');
        departionAirports[this.flightSearchService.flightsArray?.['controls']?.length] = airport;
        localStorage.setItem('departing', JSON.stringify(departionAirports));
      }
    }

    if (this.sharedService.selectedDestions.length) {
      this.sharedService.selectedDestions.push({
        departingCity: this.sharedService.selectedDestions[this.sharedService.selectedDestions.length - 1].landingCity,
        landingCity: null,
      });
    }

    this.flightSearchService.addFlight();
  }

  removeFlight(index: number) {
    if (this.isBrowser) {
      let departionAirports = JSON.parse(localStorage.getItem('departing') ?? '[]');
      let landingAirports = JSON.parse(localStorage.getItem('landing') ?? '[]');

      departionAirports[index] = null;
      landingAirports[index] = null;

      localStorage.setItem('departing', JSON.stringify(departionAirports));
      localStorage.setItem('landing', JSON.stringify(landingAirports));
    }

    this.sharedService.selectedDestions.splice(index, 1);
    this.flightSearchService.removeFlight(index);
  }

  isDepartingNotValid(index: number) {
    return (
      !this.flightSearchService.flightsArray.at(index).get('isDepartingSelected')?.value &&
      this.flightSearchService.flightsArray.at(index).get('departing')?.touched
    );
  }

  isLandingNotValid(index: number) {
    return (
      !this.flightSearchService.flightsArray.at(index).get('isLandingSelected')?.value &&
      this.flightSearchService.flightsArray.at(index).get('landing')?.touched
    );
  }

  isCalanderNotValid(index: number) {
    if (this.flightType === 'round-trip') {
      return (
        (this.flightSearchService.flightsArray.at(index).get('departingD')?.invalid &&
          this.flightSearchService.flightsArray.at(index).get('departingD')?.touched) ||
        (!this.flightSearchService.searchFlight.get('returnDate')?.value &&
          this.flightSearchService.searchFlight.get('returnDate')?.touched)
      );
    }

    return (
      this.flightSearchService.flightsArray.at(index).get('departingD')?.invalid &&
      this.flightSearchService.flightsArray.at(index).get('departingD')?.touched
    );
  }
}
