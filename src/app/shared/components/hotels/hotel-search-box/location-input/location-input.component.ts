import { Component, OnInit, OnDestroy, ViewChild, ElementRef , inject } from '@angular/core';
import { HotelSearchService } from 'rp-hotels-ui';
import { HomePageService } from 'rp-hotels-ui';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { hotelCities } from 'rp-hotels-ui';
import { TranslateService } from '@ngx-translate/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../../../../shared.service';
import { MobileLocationInputComponent } from './mobile-location-input/mobile-location-input.component';
import { Subscription } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  standalone: false,
  selector: 'app-location-input',
  templateUrl: './location-input.component.html',
  styleUrls: ['./location-input.component.scss']
})
export class LocationInputComponent implements OnInit, OnDestroy {
  @ViewChild('locationInput', { read: ElementRef }) locationInput!: ElementRef;
  @ViewChild('auto') auto: MatAutocomplete | undefined;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  private subscriptions: Subscription = new Subscription();

  homePageService = inject(HomePageService);
  hotelSearchService = inject(HotelSearchService);
  translate = inject(TranslateService);
  sharedService = inject(SharedService);
  fb = inject(FormBuilder);

  searchForm: FormGroup = new FormGroup({ location: new FormControl() });
  fixedNationality = 'EG';
  currentLang = this.translate.currentLang;
  showValidationErrors = false;
  selectedCity: hotelCities | null = null;
  isMobile = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initializeForm();
    this.isMobile = this.sharedService.screenWidth < 768;
    this.setCachedLocationInput();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    this.searchForm = this.hotelSearchService.HotelSearchForm || this.fb.group({
      location: [null, [
        Validators.required,
        Validators.minLength(3),
        this.validateLocationSelection.bind(this)
      ]]
    });

    const locationControl = this.searchForm.get('location');
    if (locationControl) {
      locationControl.setValidators([
        Validators.required,
        Validators.minLength(3),
        this.validateLocationSelection.bind(this)
      ]);
      locationControl.updateValueAndValidity();
    }
  }

  setCachedLocationInput(): void {
    const hotelForm = (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('hotelSearchFormData') : null);
    if (hotelForm) {
      try {
        const parsedForm = JSON.parse(hotelForm);
        if (parsedForm?.location) {
          this.searchForm.get('location')?.setValue(parsedForm.location);
          this.selectedCity = parsedForm.location;

          setTimeout(() => {
            if (this.locationInput?.nativeElement) {
              this.locationInput.nativeElement.value = parsedForm.location.City || '';
            }
          });
        }
      } catch (e) {
        console.error('Error parsing cached form data', e);
      }
    }
  }

  validateLocationSelection(control: FormControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    if (typeof value === 'string' && value.length >= 3 && !this.selectedCity) {
      return { invalidSelection: true };
    }
    return null;
  }

  onLocationChange(event: Event): void {
    if (this.isMobile) return;

    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (this.selectedCity && this.selectedCity.City !== value) {
      this.selectedCity = null;
    }

    this.showValidationErrors = true;

    if (value.trim().length === 0) {
      // Clear form control and cities when input is empty
      this.homePageService.selectAllcities = [];
      this.searchForm.get('location')?.setValue(null);
      this.selectedCity = null;

      if (this.autocompleteTrigger) {
        this.autocompleteTrigger.closePanel();
      }

      return;
    }

    if (value.trim().length >= 2) {
      this.homePageService.getCitiesById(value);
    } else {
      this.homePageService.selectAllcities = [];
      if (this.autocompleteTrigger) {
        this.autocompleteTrigger.closePanel();
      }
    }

    this.searchForm.get('location')?.setValue(value);
    this.searchForm.get('location')?.updateValueAndValidity();
  }

  onCitySelected(event: MatAutocompleteSelectedEvent): void {
    if (this.isMobile) return;

    this.selectedCity = event.option.value;
    this.searchForm.get('location')?.setValue(this.selectedCity);
    this.searchForm.get('location')?.markAsTouched();
    this.showValidationErrors = true;
    this.searchForm.get('location')?.updateValueAndValidity();
  }

  displayCity(city: hotelCities | string | null): string {
    if (!city) return '';
    if (typeof city === 'string') return city;
    return city.City || '';
  }

  get locationInvalid(): boolean {
    const control = this.searchForm?.get('location');
    return !!control && control.invalid && (control.touched || this.showValidationErrors);
  }

  clearInput(event?: Event): void {
    event?.stopPropagation();
    event?.preventDefault();

    this.searchForm.get('location')?.setValue(null);
    this.selectedCity = null;
    this.homePageService.selectAllcities = [];

    if (this.autocompleteTrigger) {
      this.autocompleteTrigger.closePanel();
    }

    this.showValidationErrors = true;

    if (this.locationInput?.nativeElement) {
      this.locationInput.nativeElement.value = '';
    }

    this.searchForm.get('location')?.updateValueAndValidity();
  }

  openLocationDialog(): void {
    if (this.isMobile) {
      const dialogRef = this.dialog.open(MobileLocationInputComponent, {
        width: '100vw',
        height: '100%',
        panelClass: 'mobile-dialog',
        data: { currentValue: this.searchForm.get('location')?.value }
      });

      const sub = dialogRef.afterClosed().subscribe((result: unknown) => {
        if (result && typeof result === 'object') {
          const city = result as hotelCities;
          this.selectedCity = city;
          this.searchForm.get('location')?.setValue(city);
          this.searchForm.get('location')?.markAsTouched();
          this.searchForm.get('location')?.updateValueAndValidity();

          if (this.locationInput?.nativeElement) {
            this.locationInput.nativeElement.value = city.City;
          }
          // Clear cities list to prevent dropdown from showing
          this.homePageService.selectAllcities = [];
        }
      });

      this.subscriptions.add(sub);
    }
  }
}
