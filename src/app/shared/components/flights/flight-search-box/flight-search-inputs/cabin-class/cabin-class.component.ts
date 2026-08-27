import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../../../../shared.service';
import { FlightSearchService } from 'rp-travel-ui';
import { IMainButton } from '../../../../../models/flights/mainButton.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { MobileViewCabinClassComponent } from './mobile-view-cabin-class/mobile-view-cabin-class.component';
import { MatDialog } from '@angular/material/dialog';
import { classTypes } from '../../../../../../core/constants/classTypes';

@Component({
  standalone: false,
  selector: 'app-cabin-class',
  templateUrl: './cabin-class.component.html',
  styleUrl: './cabin-class.component.scss',
})
export class CabinClassComponent implements OnInit {
  @ViewChild('cabinClassTrigger') cabinClassTrigger!: MatMenuTrigger;

  @Input() openMenu = 0;

  flightSearchService = inject(FlightSearchService);
  sharedService = inject(SharedService);

  cabinClassDoneButton: IMainButton = {
    height: '42px',
    width: '100%',
    borderRadius: '6px',
    backgroundColor: '#213567',
    color: 'white',
  };

  classTypes = classTypes;

  adultValid: boolean = true;
  childValid: boolean = true;
  infantValid: boolean = true;
  openClass: boolean = false;

  constructor(private dialog: MatDialog) {}

  ngOnChanges(): void {
    if (this.openMenu) {
      this.cabinClassTrigger.openMenu();
    }
  }

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
        this.adultValid = false;
      } else {
        this.flightSearchService.searchFlight
          ?.get('passengers.adults')
          ?.setValue(this.flightSearchService.searchFlight?.get('passengers.adults')?.value - 1);
        this.adultValid = true;
      }
    } else if (this.flightSearchService.searchFlight?.get('passengers.adults')?.value <= 1) {
      if (action == 'increase') {
        this.flightSearchService.searchFlight
          ?.get('passengers.adults')
          ?.setValue(this.flightSearchService.searchFlight?.get('passengers.adults')?.value + 1);
        this.adultValid = true;
      } else {
        this.flightSearchService.searchFlight?.get('passengers.adults')?.setValue(1);
      }
    } else {
      this.adultValid = true;
      if (action == 'increase' && this.getTotalPassenger != 9) {
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
    if (action == 'increase' && this.getTotalPassenger != 9) {
      this.flightSearchService.searchFlight
        ?.get('passengers.child')
        ?.setValue(this.flightSearchService.searchFlight?.get('passengers.child')?.value + 1);
      this.childValid = true;
      if (this.flightSearchService.searchFlight?.get('passengers.child')?.value >= 8) {
        this.flightSearchService.searchFlight?.get('passengers.child')?.setValue(8);
        this.childValid = false;
      }
    } else if (action == 'decrease') {
      this.flightSearchService.searchFlight
        ?.get('passengers.child')
        ?.setValue(this.flightSearchService.searchFlight?.get('passengers.child')?.value - 1);
      this.childValid = true;
      if (this.flightSearchService.searchFlight?.get('passengers.child')?.value <= 0) {
        this.flightSearchService.searchFlight?.get('passengers.child')?.setValue(0);
        this.childValid = true;
      }
    }
  }

  changeInfantValue(action: string) {
    let adultValue = this.flightSearchService.searchFlight?.get('passengers.adults')?.value;
    if (action == 'increase' && this.getTotalPassenger != 9) {
      this.flightSearchService.searchFlight
        ?.get('passengers.infant')
        ?.setValue(this.flightSearchService.searchFlight?.get('passengers.infant')?.value + 1);
      this.infantValid = true;
      let infantValue = this.flightSearchService.searchFlight?.get('passengers.infant')?.value;
      if (infantValue > 4) {
        this.flightSearchService.searchFlight?.get('passengers.infant')?.setValue(4);
        this.infantValid = false;
      }
      if (infantValue > adultValue) {
        this.flightSearchService.searchFlight?.get('passengers.infant')?.setValue(adultValue);
        this.infantValid = false;
      }
    } else if (action == 'decrease') {
      this.flightSearchService.searchFlight
        ?.get('passengers.infant')
        ?.setValue(this.flightSearchService.searchFlight?.get('passengers.infant')?.value - 1);
      this.infantValid = false;
      if (this.flightSearchService.searchFlight?.get('passengers.infant')?.value <= 0) {
        this.flightSearchService.searchFlight?.get('passengers.infant')?.setValue(0);
        this.infantValid = true;
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

  onClickDone() {
    if (this.cabinClassTrigger) {
      this.cabinClassTrigger.closeMenu();
    }
  }

  onClickInput() {
    if (this.sharedService.screenWidth >= 1200) {
      return;
    }

    this.dialog.open(MobileViewCabinClassComponent, {
      data: {
        dismiss: () => this.dialog.closeAll(),
      },
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      hasBackdrop: true,
    });
  }

  get getTotalPassenger() {
    let adult = this.flightSearchService.searchFlight?.get('passengers.adults')?.value;
    let child = this.flightSearchService.searchFlight?.get('passengers.child')?.value;
    let infant = this.flightSearchService.searchFlight?.get('passengers.infant')?.value;
    return this.flightSearchService.getTotalPassengers(adult, child, infant);
  }
}
