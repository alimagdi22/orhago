import { Component, ElementRef, Inject, inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FlightResultService, FlightSearchService } from 'rp-travel-ui';
import { SharedService } from '../../../shared.service';
import { Validators } from '@angular/forms';
import { FlightSearchInputsComponent } from './flight-search-inputs/flight-search-inputs.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flight-search-box',
  templateUrl: './flight-search-box.component.html',
  styleUrls: ['./flight-search-box.component.scss'],
})
export class FlightSearchBoxComponent implements OnInit {
  @Input() airlineLogo?: string;
  public flightSearchService = inject(FlightSearchService);
  private flightResultService = inject(FlightResultService);
  private router = inject(Router);
  sharedService = inject(SharedService);
  lang = inject(TranslateService)
  private platformId = inject(PLATFORM_ID);
  public isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('roundTripRadio') roundTripRadio!: ElementRef;
  @ViewChild(FlightSearchInputsComponent) flightSearchInputs?: FlightSearchInputsComponent;

  ngOnInit(): void {
    console.log(this.airlineLogo);
    
    let form: any = null;
    let flightType: string | null = null;

    if (this.isBrowser) {
      try {
        // form = JSON.parse(localStorage.getItem('form') as string);
        flightType = localStorage.getItem('flightType');
      } catch (e) {}
    }

    // if (form && this.isBrowser) {
    //   let cityPattern = form.Flights?.[0]?.departing;
    //   let pattern = /,/;
    //   if (cityPattern && !pattern.test(cityPattern)) {
    //     localStorage.removeItem('form');
    //     form = null;
    //   }
    // }

    this.flightSearchService.initSearchForm(form);

    if (!form && !flightType) {
      this.selectFlightType('RoundTrip');
    }

    if (flightType) {
      this.flightSearchService.searchFlight?.get('flightType')?.setValue(flightType);
    }

    if (this.router.url.includes('flight-results')) {
      this.applyResponseDates();
    }
  }

  private applyResponseDates(): void {
    const criteriaFlights = this.flightResultService.response?.searchCriteria?.flights || [];
    const itineraryFlights =
      this.flightResultService.orgnizedResponce?.[0]?.[0]?.allJourney?.flights || [];
    const searchedDates = criteriaFlights
      .map((flight) => flight?.departingOnDate)
      .filter((date): date is string => !!date);

    if (!searchedDates.length) {
      itineraryFlights.forEach((flight) => {
        const date = flight?.flightDTO?.[0]?.departureDate;
        if (date) searchedDates.push(date);
      });
    } else if (searchedDates.length === 1 && itineraryFlights.length > 1) {
      const returnDate = itineraryFlights[itineraryFlights.length - 1]?.flightDTO?.[0]?.departureDate;
      if (returnDate) searchedDates.push(returnDate);
    }

    if (!searchedDates.length) return;

    const flightType =
      this.normalizeFlightType(
        this.flightResultService.response?.searchCriteria?.flightType || this.sharedService.flightType,
      ) || (searchedDates.length > 2 ? 'MultiCity' : searchedDates.length > 1 ? 'RoundTrip' : 'OneWay');
    this.selectFlightType(flightType);

    const departure = this.toInputDate(searchedDates[0]);
    if (departure) {
      this.flightSearchService.flightsArray.at(0)?.get('departingD')?.setValue(departure);
    }

    if (flightType === 'RoundTrip' && searchedDates[1]) {
      const returning = this.toInputDate(searchedDates[1]);
      if (returning) {
        this.flightSearchService.searchFlight?.get('returnDate')?.setValue(returning);
      }
    }

    if (flightType === 'MultiCity') {
      while (
        this.flightSearchService.flightsArray.length < searchedDates.length &&
        this.flightSearchService.flightsArray.length < 4
      ) {
        this.flightSearchService.addFlight();
      }

      searchedDates.forEach((date, index) => {
        const parsed = this.toInputDate(date);
        if (parsed) {
          this.flightSearchService.flightsArray.at(index)?.get('departingD')?.setValue(parsed);
        }
      });
    }
  }

  private normalizeFlightType(flightType: string): 'OneWay' | 'RoundTrip' | 'MultiCity' | null {
    const value = String(flightType || '').toLowerCase().replace(/[\s_-]/g, '');
    if (value === 'oneway') return 'OneWay';
    if (value === 'roundtrip') return 'RoundTrip';
    if (value === 'multicity') return 'MultiCity';
    return null;
  }

  private toInputDate(value: string): Date | null {
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  selectFlightType(flightType: 'OneWay' | 'RoundTrip' | 'MultiCity') {
    this.flightSearchService.changeFlightType(flightType);

    switch (flightType) {
      case 'OneWay':
      case 'MultiCity':
        this.flightSearchService.searchFlight?.get('returnDate')?.clearValidators();
        break;
      case 'RoundTrip':
        this.flightSearchService.searchFlight?.get('returnDate')?.setValidators(Validators.required);
        break;
    }

    this.flightSearchService.searchFlight?.get('returnDate')?.updateValueAndValidity();

    if (this.isBrowser) {
      localStorage.setItem('flightType', flightType);
    }
  }

  onAddReturnClicked() {
    this.selectFlightType('RoundTrip');
    this.sharedService.isAddReturnClicked = true;
  }

  onSubmit() {
    this.flightSearchInputs?.onSubmit();
  }
}
