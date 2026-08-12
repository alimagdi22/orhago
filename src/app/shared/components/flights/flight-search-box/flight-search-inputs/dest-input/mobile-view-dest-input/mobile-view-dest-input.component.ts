import { Component, inject, Inject, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FlightSearchService } from 'rp-travel-ui';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, Subscription, switchMap } from 'rxjs';
import { IAirPortTranslated } from '../../../../../../../core/models/airport.model';
import { SharedService } from '../../../../../../shared.service';
import { TDestinations } from '../dest-input.component';

@Component({
  standalone: false,
  selector: 'app-mobile-view-dest-input',
  templateUrl: './mobile-view-dest-input.component.html',
  styleUrl: './mobile-view-dest-input.component.scss'
})
export class MobileViewDestInputComponent implements OnInit, OnDestroy {
  public cities: IAirPortTranslated[] = [];

  private subscription = new Subscription();
  private searchSubject = new Subject<string>();

  public translate = inject(TranslateService);
  public flightSearchService = inject(FlightSearchService);
  public isLoading = false;
  public sharedService = inject(SharedService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { destination: TDestinations; flightItem: AbstractControl; index: number; dismiss: Function }) {}

  ngOnInit(): void {
    this.subscription.add(
      this.searchSubject
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((searchTerm) => {
            if (!searchTerm || !searchTerm.trim()) {
              this.isLoading = false;
              this.cities = [];
              return of([]);
            }
            this.isLoading = true;
            return this.flightSearchService.getAirports(searchTerm).pipe(
              catchError(() => {
                this.isLoading = false;
                this.cities = [];
                return of([]);
              })
            );
          })
        )
        .subscribe({
          next: (data: any) => {
            this.isLoading = false;
            this.cities = data as IAirPortTranslated[];
          },
          error: () => {
            this.isLoading = false;
            this.cities = [];
          }
        })
    );
  }

  onInputDirection(e: Event): void {
    const value = (e.target as HTMLInputElement).value;

    if (value && value.trim()) {
      this.isLoading = true;
    } else {
      this.isLoading = false;
      this.cities = [];
    }

    this.searchSubject.next(value);
  }

  getRecommendedAirports(): IAirPortTranslated[] {
    return this.sharedService.initialRecommendedAirports;
  }

  getGroupedCities(): { city: string; country: string; airports: IAirPortTranslated[] }[] {
    const groups: { [key: string]: { city: string; country: string; airports: IAirPortTranslated[] } } = {};

    this.cities.forEach((airport) => {
      const lang = this.sharedService.lang;
      const cityKey = airport[lang].cityName + '|' + airport[lang].countryName;

      if (!groups[cityKey]) {
        groups[cityKey] = {
          city: airport[lang].cityName,
          country: airport[lang].countryName,
          airports: []
        };
      }
      groups[cityKey].airports.push(airport);
    });

    return Object.values(groups);
  }

  assignCountriesForMobile(country: string, dest: TDestinations, city: IAirPortTranslated, index: number, isCitySelection: boolean = false) {
    const airports = JSON.parse((typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(dest) : null) ?? '[]');

    airports[index] = {
      ...city,
      _isCitySelection: isCitySelection
    };

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(dest, JSON.stringify(airports));
    }

    const langObj = city[this.sharedService.lang];
    this.sharedService.selectedDestions[index][dest === 'departing' ? 'departingCity' : 'landingCity'] = langObj;
    const code = isCitySelection ? langObj.cityCode : langObj.airportCode;
    this.data.flightItem.get(dest)?.setValue(langObj.cityName + ',' + code);

    this.flightSearchService.flightsArray
      .at(index)
      .get(dest === 'departing' ? 'isDepartingSelected' : 'isLandingSelected')
      ?.setValue(true);

    this.data.dismiss();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
