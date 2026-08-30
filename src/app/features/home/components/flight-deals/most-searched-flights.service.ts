import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, of, retry, take, timeout } from 'rxjs';
import { MostSearchedFlightsResponse, SearchCriteria } from './interfaces';
import { Router } from '@angular/router';
import { FlightSearchService, HomePageService } from 'rp-travel-ui';
import { SharedService } from '../../../../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MostSearchedFlightsService {
  public isLoading = false;
  public isError = false;
  public isEmpty = false;

  private translate = inject(TranslateService);
  private homePageService = inject(HomePageService);
  private flightSearchService = inject(FlightSearchService);
  private sharedService = inject(SharedService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private http = inject(HttpClient);
  private router = inject(Router);

  private _mostSearchedFlights: MostSearchedFlightsResponse[] = [];

  getMostSearchedFlights() {
    this.isLoading = true;

    if (this.isBrowser) {
      const mostSearchedFlights = sessionStorage.getItem('mostSearchedFlights');
      if (mostSearchedFlights) {
        try {
          this._mostSearchedFlights = JSON.parse(mostSearchedFlights);
          if (this._mostSearchedFlights.length) {
            this.isLoading = false;
            this.isEmpty = false;
            return;
          }
        } catch {
          // Fallback to fresh HTTP call if cache parse fails
        }
      }
    }

    this.http
      .get<MostSearchedFlightsResponse[]>('https://flightsearch.flytoall.com/api/GetCheapestFlights?resCount=5')
      .pipe(
        timeout(10000),
        retry(1),
        take(1),
        catchError(() => {
          return of([]);
        }),
      )
      .subscribe({
        next: (res) => {
          if (this.isBrowser && res && res.length) {
            sessionStorage.setItem('mostSearchedFlights', JSON.stringify(res));
          }

          this._mostSearchedFlights = res || [];
          this.isEmpty = !this._mostSearchedFlights.length;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.isError = true;
        },
      });
  }

  goToSearchResults(searchCriteria: SearchCriteria) {
    if (this.isBrowser) {
      localStorage.removeItem('form');
    }

    const currentLang = this.translate.currentLang || searchCriteria.language || 'en';
    this.translate.use(searchCriteria.language || currentLang);
    this.homePageService.getCountries(searchCriteria.language || currentLang);
    if ((this.sharedService as any).isFirstRequest !== undefined) {
      (this.sharedService as any).isFirstRequest = false;
    }

    const form: any = {
      flightType: '',
      Direct: false,
      Flights: [],
      returnDate: '',
      passengers: {
        adults: 1,
        child: 0,
        infant: 0,
      },
      class: '',
    };

    const departing: any[] = [];
    const landing: any[] = [];

    switch (searchCriteria.flightType) {
      case 'Oneway':
        form.flightType = 'OneWay';
        this.flightSearchService.searchFlight?.get('flightType')?.setValue('OneWay');
        break;
      case 'Roundtrip':
        form.flightType = 'RoundTrip';
        if (searchCriteria.flights?.[1]?.departingOnDate) {
          form.returnDate = searchCriteria.flights[1].departingOnDate;
        }
        this.flightSearchService.searchFlight?.get('flightType')?.setValue('RoundTrip');
        break;
      case 'Multicity':
        form.flightType = 'MultiCity';
        this.flightSearchService.searchFlight?.get('flightType')?.setValue('MultiCity');
        break;
    }

    form.passengers.adults = searchCriteria.adultNum;
    form.passengers.child = searchCriteria.childNum;
    form.passengers.infant = searchCriteria.infantNum;

    this.flightSearchService.searchFlight?.get('passengers.adults')?.setValue(searchCriteria.adultNum);
    this.flightSearchService.searchFlight?.get('passengers.child')?.setValue(searchCriteria.childNum);
    this.flightSearchService.searchFlight?.get('passengers.infant')?.setValue(searchCriteria.infantNum);

    form.class = searchCriteria.selectedFlightClass;

    let flights: string[] = [];
    form.Flights = [];

    if (searchCriteria.flights && searchCriteria.flights.length) {
      searchCriteria.flights.forEach((e: any) => {
        const departingOnDate = new Date(e.departingOnDate);

        const formattedDate = departingOnDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        });

        flights.push(e.departingFrom + '-' + e.arrivingTo + '-' + formattedDate);

        if (!e.arrivingAirport || !e.departingAirport) {
          return;
        }

        const langKey = this.sharedService.lang || 'en';

        form.Flights.push({
          isDepartingSelected: false,
          isLandingSelected: false,
          departing:
            (e.arrivingAirport[langKey]?.cityName || '') +
            ',' +
            (e.arrivingAirport[langKey]?.airportCode || ''),
          landing:
            (e.arrivingAirport[langKey]?.cityName || '') +
            ',' +
            (e.departingAirport[langKey]?.airportCode || ''),
          departingD: e.departingOnDate,
        });
        departing.push(e.departingAirport);
        landing.push(e.arrivingAirport);
      });
    }

    this.sharedService.scrollToTop();

    this.router.navigate(
      [
        'flight-results',
        searchCriteria.language || currentLang,
        searchCriteria.currency || 'AED',
        searchCriteria.pos || 'UAE',
        searchCriteria.flightType,
        flights.join('_'),
        searchCriteria.searchId,
        'A-' + searchCriteria.adultNum + '-C-' + searchCriteria.childNum + '-I-' + searchCriteria.infantNum,
        searchCriteria.selectedFlightClass,
        searchCriteria.selectDirectFlightsOnly,
        'Airport_Airport',
      ],
      {
        queryParams: {
          cheapestFlights: true,
        },
      },
    );
  }

  get mostSearchedFlights() {
    return this._mostSearchedFlights;
  }
}
