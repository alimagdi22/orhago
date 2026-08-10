import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
  resultParams: IResultLink | null = null;

  /* End of Services */

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

  ngOnInit(): void {
    for (let i = 0; i < this.flightSearchService.flightsArray.length; i++) {
      this.sharedService.selectedDestions[i] = {
        departingCity: null,
        landingCity: null,
      };
    }

    let form = JSON.parse((typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('form') : null) as string);

    if(form && this.sharedService.isSegmentPresent(['flight-results'])) {
      this.onSubmit();
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

    const departingCity = this.sharedService.selectedDestions[index].departingCity;

    this.sharedService.selectedDestions[index].departingCity = this.sharedService.selectedDestions[index].landingCity;
    this.sharedService.selectedDestions[index].landingCity = departingCity;

    item.markAllAsTouched();
  }

  onClickAddReturn() {
    this.addReturnClicked.emit(null);
  }

  onSubmit() {
    this.flightSearchService.flightsArray.at(0).markAllAsTouched();
    this.flightSearchService.searchFlight.get('returnDate')?.markAsTouched();

    const lang = 'en';
    const currency = this.homePageService.selectedCurrency.Currency_Code;
    const resultLink = this.flightSearchService.onSubmit(
      this.translate.currentLang,
      currency,
      this.homePageService.pointOfSale ? this.homePageService.pointOfSale.country! : 'EG',
      ',',
    );
    let splittedLink = resultLink.toString().split('/');

    if (typeof resultLink == 'object') {
      Object.entries(resultLink).forEach(([key, value], index) => {
        if (lang == 'en') {
          if (value.enMsg != '') {
            // this.tinyAlert(value.enMsg);
          }
        } else {
          if (value.arMsg != '') {
            // this.tinyAlert(value.arMsg);
          }
        }
      });
      this.flightSearchService.searchFlight.updateValueAndValidity();
    } else if (typeof resultLink == 'string' && resultLink != '') {
      // set land city from share service
      this.resultParams?.language;

      if (this.flightSearchService.searchFlight.valid) {
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
        };
        this.sharedService.scrollToTop();
        this.router.navigate(['/flight-results', ...splittedLink]);
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('form', JSON.stringify(this.flightSearchService.searchFlight.value));
        }
      } else {
        this.flightSearchService.searchFlight.markAllAsTouched();
        this.flightSearchService.searchFlight.get('returnDate')?.markAsTouched();
      }
    }
  }

  addFlight() {
    this.sharedService.selectedDestions.push({
      departingCity: this.sharedService.selectedDestions[this.sharedService.selectedDestions.length - 1].landingCity,
      landingCity: null,
    });

    let landingAirports = JSON.parse((typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('landing') : null) as string) as IAirPortTranslated[];
    let departingAirports = JSON.parse((typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('departing') : null) as string) as IAirPortTranslated[];
    
    departingAirports[this.sharedService.selectedDestions.length - 1] = landingAirports?.length < 2 ? landingAirports[this.sharedService.selectedDestions.length - 2] : this.sharedService.initialRecommendedAirports[1];
    localStorage.setItem('departing', JSON.stringify(departingAirports))

    this.flightSearchService.addFlight();
  }

  removeFlight(index: number) {
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
