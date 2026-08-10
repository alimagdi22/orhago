import { Component, ElementRef, inject, Input, OnChanges, OnDestroy, OnInit, output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { FlightSearchService } from 'rp-travel-ui';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { IAirPort } from '../../../../../models/flights/airport.model';
import { ICity } from '../../../../../models/flights/city.model';
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

  focusDestinationInput = output<void>();
  focusDateInput = output<void>();

  @ViewChildren('menuTrigger') menuTrigger!: QueryList<MatMenuTrigger>;
  @ViewChild('destinationInput') destinationInput!: ElementRef<HTMLInputElement>;

  public cities: IAirPortTranslated[] = [];

  private subscription = new Subscription();
  private searchSubject = new Subject<string>();

  public translate = inject(TranslateService);
  public flightSearchService = inject(FlightSearchService);
  public sharedService = inject(SharedService);

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['focus']) {
      this.focusInput()
    }
  }

  ngOnInit(): void {
    let airports = JSON.parse((typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(this.destination) : null) as string) as IAirPortTranslated[];

    if(airports) {
      this.onSelectDestintation(this.destination, airports[this.index], this.index)
    }

    this.subscription.add(
      this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe((searchTerm) => {
        this.flightSearchService.getAirports(searchTerm).subscribe({
          next: (data) => {
            this.cities = data as IAirPortTranslated[];
          },
        });
      })
    )

    if(this.destination === 'departing' && !this.flightItem.get('departing')?.value) {
      const kuwaitAirport = this.sharedService.initialRecommendedAirports[1];
      this.onSelectDestintation(this.destination, kuwaitAirport, this.index);
    }
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
  }

  focusInput() {
    if (this.destinationInput?.nativeElement) {
      this.destinationInput.nativeElement.focus();
      this.destinationInput.nativeElement.select();

      const inputValue = this.flightItem.get(this.destination)?.value;
      if (!inputValue) {
        const menuTrigger = this.menuTrigger.toArray()[this.index];
        if (menuTrigger && !menuTrigger.menuOpen) {
          menuTrigger.openMenu();
        }
      }
    }
  }
  
  getFullAirportText(city: IAirPort): string {
    return `${city.airportName} - ${city.countryName} (${city.airportCode})`;
  }

  onMenuOpen() {
    const inputValue = this.flightItem.get(this.destination)?.value;
    if (inputValue) {
      const menuTrigger = this.menuTrigger.toArray()[this.index];
      if (menuTrigger && menuTrigger.menuOpen) {
        menuTrigger.closeMenu();
      }
    }
  }

  onInputDirection(dest: TDestinations, index: number): void {
    if(this.sharedService.screenWidth < 1200) {
      return;
    }

    this.flightSearchService.flightsArray
      .at(index)
      .get(dest === 'departing' ? 'isDepartingSelected' : 'isLandingSelected')
      ?.setValue(false);

    this.sharedService.selectedDestions[index][dest === 'departing' ? 'departingCity' : 'landingCity'] = null;

    const searchString = this.flightSearchService.flightsArray.at(index).get(dest)?.value;

    this.searchSubject.next(searchString);

    const menuTrigger = this.menuTrigger?.toArray()[index];

    if (menuTrigger?.menuOpen) {
      menuTrigger.closeMenu();
    }
  }


  onSelectDestintation(dest: TDestinations, city: IAirPortTranslated, index: number) {
    const airports = JSON.parse((typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(dest) : null) ?? '[]');

    airports[index] = city;

    if(!city) {
      return;
    }

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(dest, JSON.stringify(airports));
    }

    this.sharedService.selectedDestions[index][dest === 'departing' ? 'departingCity' : 'landingCity'] = city[this.sharedService.lang];
    console.log(this.sharedService.selectedDestions[index])
    this.flightSearchService.flightsArray
      .at(index)
      .get(dest === 'departing' ? 'isDepartingSelected' : 'isLandingSelected')
      ?.setValue(true);
    this.flightSearchService.flightsArray.at(index).get(dest)?.setValue(city[this.sharedService.lang].cityName + ',' + city[this.sharedService.lang].airportCode)

    if(this.sharedService.flightType === 'multi-city') {
      return;
    }
      
    if(this.destination === 'landing' ) {
      this.focusDateInput.emit();
    } else {
      this.focusDestinationInput.emit();
    }
  }

  onSelectPopularDestination(dest: string, value: string, index: number) {
    this.flightSearchService.flightsArray.at(index).get(dest)?.setValue(value);
    
    if(this.sharedService.flightType === 'multi-city') {
      return;
    }

    if(this.destination === 'landing') {
      this.focusDateInput.emit();
    } else {
      this.focusDestinationInput.emit();
    }
  }

  onClickInput(index: number, destination: string, flightItem: AbstractControl) {
    if(this.sharedService.screenWidth >= 1200) {
      return
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
