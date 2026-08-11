import { Component, inject, Inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FlightSearchService } from 'rp-travel-ui';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { IAirPortTranslated } from '../../../../../../../core/models/airport.model';
import { SharedService } from '../../../../../../shared.service';
import { TDestinations } from '../dest-input.component';

@Component({
  standalone: false,
  selector: 'app-mobile-view-dest-input',
  templateUrl: './mobile-view-dest-input.component.html',
  styleUrl: './mobile-view-dest-input.component.scss'
})
export class MobileViewDestInputComponent {
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
      this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe((searchTerm) => {
        this.flightSearchService.getAirports(searchTerm).subscribe({
          next: (data) => {
            this.isLoading = false;
            this.cities = data as IAirPortTranslated[];
          },
          error: () => {
            this.isLoading = false;
          },
        });
      })
    )
  }

  onInputDirection(e: Event): void {
    this.isLoading = true;

    const searchString = (e.target as HTMLInputElement).value;

    this.searchSubject.next(searchString);
  }

  getRecommendedAirports(): IAirPortTranslated[] {
    return this.sharedService.initialRecommendedAirports;
  }

  getGroupedCities(): { city: string; country: string; airports: IAirPortTranslated[] }[] {
    const groups: { [key: string]: { city: string; country: string; airports: IAirPortTranslated[] } } = {};
    
    this.cities.forEach(airport => {
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

    this.sharedService.selectedDestions[index][dest === 'departing' ? 'departingCity' : 'landingCity'] = city[this.sharedService.lang];
    const code = isCitySelection ? city[this.sharedService.lang].cityCode : city[this.sharedService.lang].airportCode;
    this.data.flightItem.get(dest)?.setValue(city[this.sharedService.lang].cityName + ',' + code);
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
