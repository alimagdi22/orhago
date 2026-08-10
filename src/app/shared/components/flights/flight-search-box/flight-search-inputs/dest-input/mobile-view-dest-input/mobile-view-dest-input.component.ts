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

  assignCountriesForMobile(country: string, dest: TDestinations, city: IAirPortTranslated, index: number) {
    const airports = JSON.parse((typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(dest) : null) ?? '[]');

    airports[index] = city;

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(dest, JSON.stringify(airports));
    }

    this.sharedService.selectedDestions[index][dest === 'departing' ? 'departingCity' : 'landingCity'] = city[this.sharedService.lang];
    this.data.flightItem.get(dest)?.setValue(country);
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
