import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, output, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { FlightSearchService } from 'rp-travel-ui';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, Subscription, switchMap } from 'rxjs';
import { IAirPort } from '../../../../../models/flights/airport.model';
import { ISelectedDest } from '../../../../../models/flights/selectedDest.model';
import { SharedService } from '../../../../../shared.service';
import { MobileViewDestInputComponent } from './mobile-view-dest-input/mobile-view-dest-input.component';
import { IAirPortTranslated } from '../../../../../../core/models/airport.model';

export type TDestinations = 'departing' | 'landing';

@Component({
  standalone: false,
  selector: 'app-dest-input',
  templateUrl: './dest-input.component.html',
  styleUrl: './dest-input.component.scss'
})
export class DestInputComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) destination: TDestinations = 'landing';
  @Input({ required: true }) flightItem: AbstractControl = new FormControl();
  @Input({ required: true }) index = -1;
  @Input() focus = 0;

  @Output() destinationTypeChange = new EventEmitter<{
    dest: 'departing' | 'landing';
    type: 'City' | 'Airport';
  }>();

  focusDestinationInput = output<void>();
  focusDateInput = output<void>();

  @ViewChildren('menuTrigger') menuTrigger!: QueryList<MatMenuTrigger>;
  @ViewChild('destinationInput') destinationInput!: ElementRef<HTMLInputElement>;

  public cities: IAirPortTranslated[] = [];
  public isLoading = false;
  public isFocused = false;

  private subscription = new Subscription();
  private searchSubject = new Subject<string>();

  public translate = inject(TranslateService);
  public flightSearchService = inject(FlightSearchService);
  public sharedService = inject(SharedService);

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['focus'] && !changes['focus'].firstChange) {
      this.focusInput();
    }
  }

  ngOnInit(): void {
    let airports = JSON.parse((typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(this.destination) : null) as string) as (IAirPortTranslated & { _isCitySelection?: boolean })[];

    if (airports && airports[this.index]) {
      const cachedAirport = airports[this.index];
      if (cachedAirport._isCitySelection) {
        this.onSelectCity(this.destination, cachedAirport, this.index);
      } else {
        this.onSelectDestintation(this.destination, cachedAirport, this.index);
      }
    } else if (this.destination === 'departing' && !this.flightItem.get('departing')?.value) {
      const kuwaitAirport = this.sharedService.initialRecommendedAirports[1];
      this.onSelectDestintation(this.destination, kuwaitAirport, this.index);
    }

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

  hasValue(): boolean {
    return !!(
      this.sharedService.selectedDestions[this.index]?.[this.destination === 'departing' ? 'departingCity' : 'landingCity']?.cityName ||
      this.flightItem.get(this.destination)?.value
    );
  }

  onClickDestBox() {
    if (this.sharedService.screenWidth < 1200) {
      this.onClickInput(this.index, this.destination, this.flightItem);
      return;
    }

    this.isFocused = true;
    setTimeout(() => {
      if (this.destinationInput?.nativeElement) {
        this.destinationInput.nativeElement.focus();
        this.destinationInput.nativeElement.select();
      }

      if (this.isLoading) {
        return;
      }

      const inputValue = this.flightItem.get(this.destination)?.value;
      if (!inputValue || !this.cities.length) {
        const trigger = this.menuTrigger?.toArray()[this.index];
        if (trigger && !trigger.menuOpen) {
          trigger.openMenu();
        }
      }
    }, 0);
  }

  onInputFocus() {
    this.isFocused = true;
  }

  onInputBlur() {
    setTimeout(() => {
      const selected = this.sharedService.selectedDestions[this.index]?.[this.destination === 'departing' ? 'departingCity' : 'landingCity'];
      if (selected?.cityName) {
        this.isFocused = false;
      }
    }, 200);
  }

  clearInput(dest: keyof ISelectedDest, index: number) {
    this.sharedService.selectedDestions[index][dest] = null;

    this.flightSearchService.flightsArray
      .at(index)
      .get(dest === 'departingCity' ? 'isDepartingSelected' : 'isLandingSelected')
      ?.setValue(false);

    this.flightSearchService.flightsArray
      .at(index)
      .get(dest === 'departingCity' ? 'departing' : 'landing')
      ?.setValue('');

    this.cities = [];
    this.isLoading = false;
    this.isFocused = true;

    setTimeout(() => {
      if (this.destinationInput?.nativeElement) {
        this.destinationInput.nativeElement.value = '';
        this.destinationInput.nativeElement.focus();
      }
    }, 0);
  }

  focusInput() {
    this.onClickDestBox();
  }

  getFullAirportText(city: IAirPort): string {
    return `${city.airportName} - ${city.countryName} (${city.airportCode})`;
  }

  onMenuOpen() {
    if (this.isLoading) {
      const trigger = this.menuTrigger?.toArray()[this.index];
      if (trigger && trigger.menuOpen) {
        trigger.closeMenu();
      }
      return;
    }

    const selected = this.sharedService.selectedDestions[this.index]?.[this.destination === 'departing' ? 'departingCity' : 'landingCity'];
    if (selected?.cityName && this.isFocused) {
      const trigger = this.menuTrigger?.toArray()[this.index];
      if (trigger && trigger.menuOpen) {
        trigger.closeMenu();
      }
    }
  }

  onInputDirection(dest: TDestinations, index: number): void {
    if (this.sharedService.screenWidth < 1200) {
      return;
    }

    this.isFocused = true;

    this.flightSearchService.flightsArray
      .at(index)
      .get(dest === 'departing' ? 'isDepartingSelected' : 'isLandingSelected')
      ?.setValue(false);

    const searchString = this.flightSearchService.flightsArray.at(index).get(dest)?.value;

    if (!searchString) {
      this.sharedService.selectedDestions[index][dest === 'departing' ? 'departingCity' : 'landingCity'] = null;
    }

    const trigger = this.menuTrigger?.toArray()[index];
    if (trigger?.menuOpen) {
      trigger.closeMenu();
    }

    if (searchString && searchString.trim()) {
      this.isLoading = true;
      this.cities = [];
    } else {
      this.isLoading = false;
      this.cities = [];
    }

    this.searchSubject.next(searchString);
  }

  onSelectDestintation(dest: TDestinations, city: IAirPortTranslated, index: number, isCitySelection: boolean = false) {
    if (!city) {
      return;
    }

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const airports = JSON.parse(localStorage.getItem(dest) ?? '[]');
      airports[index] = {
        ...city,
        _isCitySelection: isCitySelection
      };
      localStorage.setItem(dest, JSON.stringify(airports));
    }

    const langObj = city[this.sharedService.lang];
    this.sharedService.selectedDestions[index][dest === 'departing' ? 'departingCity' : 'landingCity'] = langObj;

    this.flightSearchService.flightsArray
      .at(index)
      .get(dest === 'departing' ? 'isDepartingSelected' : 'isLandingSelected')
      ?.setValue(true);

    const code = isCitySelection ? langObj.cityCode : langObj.airportCode;
    this.flightSearchService.flightsArray.at(index).get(dest)?.setValue(langObj.cityName + ',' + code);

    this.isFocused = false;

    const trigger = this.menuTrigger?.toArray()[index];
    if (trigger?.menuOpen) {
      trigger.closeMenu();
    }

    const type = isCitySelection ? 'City' : 'Airport';
    this.destinationTypeChange.emit({ dest, type });

    if (this.sharedService.flightType === 'multi-city') {
      return;
    }

    if (this.destination === 'landing') {
      this.focusDateInput.emit();
    } else {
      this.focusDestinationInput.emit();
    }
  }

  onSelectCity(dest: TDestinations, city: IAirPortTranslated, index: number) {
    this.onSelectDestintation(dest, city, index, true);
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

  onSelectPopularDestination(dest: string, value: string, index: number) {
    this.flightSearchService.flightsArray.at(index).get(dest)?.setValue(value);

    if (this.sharedService.flightType === 'multi-city') {
      return;
    }

    if (this.destination === 'landing') {
      this.focusDateInput.emit();
    } else {
      this.focusDestinationInput.emit();
    }
  }

  onClickInput(index: number, destination: string, flightItem: AbstractControl) {
    if (this.sharedService.screenWidth >= 1200) {
      return;
    }

    this.dialog.open(MobileViewDestInputComponent, {
      data: {
        dismiss: () => this.dialog.closeAll(),
        index,
        destination,
        flightItem
      },
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'full-width-dialog',
      hasBackdrop: true
    });
  }

  isDestNotValid(index: number) {
    return (
      !this.flightSearchService.flightsArray.at(index).get(this.destination === 'departing' ? 'isDepartingSelected' : 'isLandingSelected')?.value &&
      this.flightSearchService.flightsArray.at(index).get(this.destination)?.touched
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
