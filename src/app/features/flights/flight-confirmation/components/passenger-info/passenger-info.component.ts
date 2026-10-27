import { Component, Input, inject } from '@angular/core';
import { ConfirmationService, PassengersDetailsEntity } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-passenger-info',
  templateUrl: './passenger-info.component.html',
  styleUrl: './passenger-info.component.scss',
})
export class PassengerInfoComponent {
  @Input() passenger: PassengersDetailsEntity = {
    title: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    countryOfResidence: '',
    nationality: '',
    issuedCountry: '',
    countryCode: '',
    phoneNumber: '',
    passportNumber: '',
    passportExpiry: '',
    passengerType: '',
    ticketNumber: null,
  };

  @Input() airlinePNR = '';
  flightConfirmationService = inject(ConfirmationService);
}
