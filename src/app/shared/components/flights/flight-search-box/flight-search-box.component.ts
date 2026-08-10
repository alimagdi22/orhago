import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FlightSearchService } from 'rp-travel-ui';
import { SharedService } from '../../../shared.service';
import { Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-flight-search-box',
  templateUrl: './flight-search-box.component.html',
  styleUrls: ['./flight-search-box.component.scss'],
})
export class FlightSearchBoxComponent {
  public flightSearchService = inject(FlightSearchService);
  sharedService = inject(SharedService);

  @ViewChild('roundTripRadio') roundTripRadio!: ElementRef;

  ngOnInit(): void {
    let form: any = null;
    let flightType: string | null = null;

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        form = JSON.parse(localStorage.getItem('form') as string);
        flightType = localStorage.getItem('flightType');
      } catch (e) {}
    }

    //check if local storage have value
    if (form) {
      let cityPattern = form.Flights?.[0]?.departing;
      let pattern = /,/;
      //check pattern of depart and land cities if it doesn't match remove the form from local storage
      if (cityPattern && !pattern.test(cityPattern)) {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.removeItem('form');
        }
      }
    }
    this.flightSearchService.initSearchForm(form);
    //If There is no data in local storage then set the initial form type to One way
    if (!form) {
      this.flightSearchService.searchFlight?.get('flightType')?.setValue('OneWay');
    }
    
    if (flightType) {
      this.flightSearchService.searchFlight?.get('flightType')?.setValue(flightType);
    }
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
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('flightType', flightType);
    }
  }

  onAddReturnClicked() {
    this.selectFlightType('RoundTrip');
    this.sharedService.isAddReturnClicked = true;
  }
}
