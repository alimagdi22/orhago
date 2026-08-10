import { Component, OnInit, inject } from '@angular/core';
import { HotelSearchService } from 'rp-hotels-ui';
import { HomePageService } from 'rp-hotels-ui';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { hotelCities } from 'rp-hotels-ui';
import { Observable, startWith, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

interface RoomFormGroup extends FormGroup {
  controls: {
    adult: FormControl<number>;
    child: FormControl<number>;
    childGroup: FormControl<number[]>;
  };
}

@Component({
  standalone: false,
  selector: 'app-hotel-search-box',
  templateUrl: './hotel-search-box.component.html',
  styleUrls: ['./hotel-search-box.component.scss'],
  providers: [DatePipe]
})
export class HotelSearchBoxComponent implements OnInit {
  homePageService = inject(HomePageService);
  hotelSearchService = inject(HotelSearchService);
  translate = inject(TranslateService);
  datePipe = inject(DatePipe);
  router = inject(Router);

  searchForm!: FormGroup;
  filteredCities$!: Observable<hotelCities[]>;
  showGuestPopup = false;
  currentLang = this.translate.currentLang;
  minDate = new Date();
  maxRooms = 5;
  maxGuests = 9;
  cityLoader = false;
  fixedNationality = 'EG';
  showMaxGuestError = false;
  formError!:string | null | undefined;

  ngOnInit(): void {
    this.searchForm = this.hotelSearchService.HotelSearchForm;
    // Set fixed nationality value
    this.searchForm.get('nation')?.setValue(this.fixedNationality);
    this.searchForm.get('residence')?.setValue(this.fixedNationality);
  }

  private filterCities(value: string, cities: hotelCities[]): hotelCities[] {
    if (!value || !cities) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return cities.filter(city =>
      city.City.toLowerCase().includes(filterValue) ||
      city.Country.toLowerCase().includes(filterValue)
    );
  }

  displayCity(city: hotelCities): string {
    return city ? `${city.City}, ${city.Country}` : '';
  }

  onCitySelected(event: MatAutocompleteSelectedEvent): void {
    this.searchForm.get('location')?.setValue(event.option.value);
  }

  onLocationChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.length >= 2) {
      this.homePageService.getCitiesById(value);
    }
  }

  get guestData(): FormArray<RoomFormGroup> {
    return this.searchForm.get('guestInfo') as FormArray<RoomFormGroup>;
  }

  get totalGuests(): number {
    return this.hotelSearchService.guestNumberValidation();
  }

  toggleGuestPopup(): void {
    this.showGuestPopup = !this.showGuestPopup;
  }

  addRoom(): void {
    this.hotelSearchService.addRoom();
  }

  removeRoom(): void {
    this.hotelSearchService.removeRoom();
  }

  updateChildAges(roomIndex: number, childIndex: number, age: number): void {
    const roomGroup = this.guestData.at(roomIndex) as RoomFormGroup;
    const childAges = roomGroup.controls.childGroup.value;
    if (childAges && childIndex < childAges.length) {
      childAges[childIndex] = age;
      roomGroup.controls.childGroup.setValue([...childAges]);
    }
  }

  /**
 * Saves the current search form data to localStorage
 */
saveFormToLocalStorage(): void {
  try {
    const formData = this.searchForm.value;

    // You might want to transform the data before saving if needed
    const dataToSave = {
      location: formData.location,
      nation: formData.nation,
      residence: formData.residence,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      roomN: formData.roomN,
      guestInfo: formData.guestInfo
    };

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('hotelSearchFormData', JSON.stringify(dataToSave));
    }
  } catch (error) {
    console.error('Error saving form data to localStorage:', error);
  }
}

  onSubmit(): void {
    this.showMaxGuestError = false;
    this.formError = '';

    // Check guest count first
    if (this.totalGuests > this.maxGuests) {
      this.showMaxGuestError = true;
      if (this.currentLang === 'en') {
        this.formError = 'Maximum number of guests cannot exceed 9 guests';
      } else {
        this.formError = 'لا يمكن البحث لاكثر من ٩ اشخاص';
      }
      return;
    }

    if (this.searchForm.valid) {
      const errorMsg = this.hotelSearchService.ValidationDate();

      if (errorMsg.enMsg === '') {
        const currency = this.homePageService.selectedCurrency.Currency_Code;
        const checkIn = this.datePipe.transform(
          this.searchForm.get('checkIn')?.value,
          'MMMM dd, y'
        );
        const checkOut = this.datePipe.transform(
          this.searchForm.get('checkOut')?.value,
          'MMMM dd, y'
        );

        this.hotelSearchService.onSubmit(
          this.currentLang,
          currency,
          'EG',
          this.fixedNationality
        );

        // Save form data to localStorage
        this.saveFormToLocalStorage();
        // Navigate to hotel results
        this.router.navigate([
          '/hotels-results',
          this.currentLang,
          currency,
          'EG', // pointOfSale
          this.hotelSearchService.searchApi?.serachId,
          this.hotelSearchService.searchApi?.CityName,
          this.hotelSearchService.searchApi?.citywithcountry,
          this.hotelSearchService.searchApi?.nation,
          checkIn,
          checkOut,
          this.hotelSearchService.searchApi?.roomN,
          this.searchForm.get('location')?.value?.CityId,
          this.hotelSearchService.stringGuest,
          this.hotelSearchService.searchApi?.residence
        ]);
      } else {
        this.hotelSearchService.guestNumberValidation();
        this.formError = this.currentLang === 'en'
          ? errorMsg.enMsg
          : this.hotelSearchService.DateMessageError.arMsg;
      }
    } else {
      this.searchForm.markAllAsTouched();
      this.formError = this.currentLang === 'en'
        ? 'Please fill all required fields correctly'
        : 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح';
    }
  }

  clearAllRooms(): void {
    this.hotelSearchService.clearAllRooms();
  }
}
