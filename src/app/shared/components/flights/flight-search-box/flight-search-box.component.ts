import { Component, ElementRef, Inject, inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FlightSearchService } from 'rp-travel-ui';
import { SharedService } from '../../../shared.service';
import { Validators } from '@angular/forms';
import { FlightSearchInputsComponent } from './flight-search-inputs/flight-search-inputs.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flight-search-box',
  templateUrl: './flight-search-box.component.html',
  styleUrls: ['./flight-search-box.component.scss'],
})
export class FlightSearchBoxComponent implements OnInit {
  @Input() airlineLogo?: string;
  public flightSearchService = inject(FlightSearchService);
  sharedService = inject(SharedService);
  lang = inject(TranslateService)
  private platformId = inject(PLATFORM_ID);
  public isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('roundTripRadio') roundTripRadio!: ElementRef;
  @ViewChild(FlightSearchInputsComponent) flightSearchInputs?: FlightSearchInputsComponent;

  ngOnInit(): void {
    console.log(this.airlineLogo);
    
    let form: any = null;
    let flightType: string | null = null;

    if (this.isBrowser) {
      try {
        form = JSON.parse(localStorage.getItem('form') as string);
        flightType = localStorage.getItem('flightType');
      } catch (e) {}
    }

    if (form && this.isBrowser) {
      let cityPattern = form.Flights?.[0]?.departing;
      let pattern = /,/;
      if (cityPattern && !pattern.test(cityPattern)) {
        localStorage.removeItem('form');
        form = null;
      }
    }

    this.flightSearchService.initSearchForm(form);

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

    if (this.isBrowser) {
      localStorage.setItem('flightType', flightType);
    }
  }

  onAddReturnClicked() {
    this.selectFlightType('RoundTrip');
    this.sharedService.isAddReturnClicked = true;
  }

  onSubmit() {
    this.flightSearchInputs?.onSubmit();
  }
}
