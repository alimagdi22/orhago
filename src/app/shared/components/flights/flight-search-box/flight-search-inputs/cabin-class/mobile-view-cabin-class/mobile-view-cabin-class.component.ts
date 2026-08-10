import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlightSearchService } from 'rp-travel-ui';
import { classTypes } from '../../../../../../../core/constants/classTypes';

@Component({
  standalone: false,
  selector: 'app-mobile-view-cabin-class',
  templateUrl: './mobile-view-cabin-class.component.html',
  styleUrl: './mobile-view-cabin-class.component.scss'
})
export class MobileViewCabinClassComponent {
  public flightSearchService = inject(FlightSearchService);
  public classTypes = classTypes;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: { dismiss: Function }) {}

  ngOnInit(): void {
    this.classTypes.forEach((classType) => {
      if (classType.value === this.flightSearchService.searchFlight.get('class')?.value) {
        classType.isSelected = true;
      }
    });
  }

  changeAdultValue(action: string) {
    if (this.flightSearchService.searchFlight?.get('passengers.adults')?.value >= 9) {
      if (action == 'increase') {
        this.flightSearchService.searchFlight?.get('passengers.adults')?.setValue(9);
      } else {
        this.flightSearchService.searchFlight
          ?.get('passengers.adults')
          ?.setValue(this.flightSearchService.searchFlight?.get('passengers.adults')?.value - 1);
      }
    } else if (this.flightSearchService.searchFlight?.get('passengers.adults')?.value <= 1) {
      if (action == 'increase') {
        this.flightSearchService.searchFlight
          ?.get('passengers.adults')
          ?.setValue(this.flightSearchService.searchFlight?.get('passengers.adults')?.value + 1);
      } else {
        this.flightSearchService.searchFlight?.get('passengers.adults')?.setValue(1);
      }
    } else {
      if (action == 'increase' && this.getTotalPassenger() != 9) {
        this.flightSearchService.searchFlight
          ?.get('passengers.adults')
          ?.setValue(this.flightSearchService.searchFlight?.get('passengers.adults')?.value + 1);
      } else if (action == 'decrease') {
        this.flightSearchService.searchFlight
          ?.get('passengers.adults')
          ?.setValue(this.flightSearchService.searchFlight?.get('passengers.adults')?.value - 1);
      }
    }
  }

  changeChildValue(action: string) {
    if (action == 'increase' && this.getTotalPassenger() != 9) {
      this.flightSearchService.searchFlight
        ?.get('passengers.child')
        ?.setValue(this.flightSearchService.searchFlight?.get('passengers.child')?.value + 1);
      if (this.flightSearchService.searchFlight?.get('passengers.child')?.value >= 8) {
        this.flightSearchService.searchFlight?.get('passengers.child')?.setValue(8);
      }
    } else if (action == 'decrease') {
      this.flightSearchService.searchFlight
        ?.get('passengers.child')
        ?.setValue(this.flightSearchService.searchFlight?.get('passengers.child')?.value - 1);
      if (this.flightSearchService.searchFlight?.get('passengers.child')?.value <= 0) {
        this.flightSearchService.searchFlight?.get('passengers.child')?.setValue(0);
      }
    }
  }

  changeInfantValue(action: string) {
    let adultValue = this.flightSearchService.searchFlight?.get('passengers.adults')?.value;
    if (action == 'increase' && this.getTotalPassenger() != 9) {
      this.flightSearchService.searchFlight
        ?.get('passengers.infant')
        ?.setValue(this.flightSearchService.searchFlight?.get('passengers.infant')?.value + 1);
      let infantValue = this.flightSearchService.searchFlight?.get('passengers.infant')?.value;
      if (infantValue > 4) {
        this.flightSearchService.searchFlight?.get('passengers.infant')?.setValue(4);
      }
      if (infantValue > adultValue) {
        this.flightSearchService.searchFlight?.get('passengers.infant')?.setValue(adultValue);
      }
    } else if (action == 'decrease') {
      this.flightSearchService.searchFlight
        ?.get('passengers.infant')
        ?.setValue(this.flightSearchService.searchFlight?.get('passengers.infant')?.value - 1);
      if (this.flightSearchService.searchFlight?.get('passengers.infant')?.value <= 0) {
        this.flightSearchService.searchFlight?.get('passengers.infant')?.setValue(0);
      }
    }
  }

  setClassType(value: string, selectedClass: any) {
    this.classTypes.forEach((classType) => {
      classType.isSelected = false;
    });
    selectedClass.isSelected = true;
    this.flightSearchService.searchFlight.get('class')?.setValue(value);
  }

  getTotalPassenger() {
    let adult = this.flightSearchService.searchFlight?.get('passengers.adults')?.value;
    let child = this.flightSearchService.searchFlight?.get('passengers.child')?.value;
    let infant = this.flightSearchService.searchFlight?.get('passengers.infant')?.value;

    return this.flightSearchService.getTotalPassengers(adult, child, infant);
  }
}
