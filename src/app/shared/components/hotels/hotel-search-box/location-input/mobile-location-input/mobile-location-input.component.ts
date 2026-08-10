import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { HotelSearchService } from 'rp-hotels-ui';
import { HomePageService } from 'rp-hotels-ui';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { hotelCities } from 'rp-hotels-ui';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  standalone: false,
  selector: 'app-mobile-location-input',
  templateUrl: './mobile-location-input.component.html',
  styleUrls: ['./mobile-location-input.component.scss']
})
export class MobileLocationInputComponent implements OnInit {
  @ViewChild('locationInput', { read: ElementRef }) locationInput!: ElementRef;
  @ViewChild('auto') auto: MatAutocomplete | undefined;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  homePageService = inject(HomePageService);
  hotelSearchService = inject(HotelSearchService);
  translate = inject(TranslateService);

  searchForm: FormGroup = new FormGroup({ location: new FormControl() });
  showValidationErrors = false;
  selectedCity: hotelCities | null = null;

  constructor(private dialogRef: MatDialogRef<MobileLocationInputComponent>) {}

  ngOnInit(): void {
    this.searchForm = this.hotelSearchService.HotelSearchForm;
    const locationControl = this.searchForm.get('location');
    if (locationControl) {
      locationControl.setValidators([
        Validators.required,
        Validators.minLength(3),
        this.validateLocationSelection.bind(this)
      ]);
      locationControl.updateValueAndValidity();
    }
    this.setCachedLocationInput();
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
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (this.selectedCity && this.selectedCity.City !== value) {
      this.selectedCity = null;
    }

    this.showValidationErrors = true;

    if (value.length === 0) {
      // Clear form control and cities when input is empty
      this.homePageService.selectAllcities = [];
      this.searchForm.get('location')?.setValue(null);
      this.selectedCity = null;

      if (this.autocompleteTrigger) {
        this.autocompleteTrigger.closePanel();
      }

      return;
    }

    if (value.length >= 2) {
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


  displayCity(city: hotelCities | null): string {
    return city?.City || '';
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

  onCityPicked(city: hotelCities): void {
    this.selectedCity = city;
    this.searchForm.get('location')?.setValue(city);
    this.homePageService.selectAllcities = []; // Clear the cities list
    this.dialogRef.close(city);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
