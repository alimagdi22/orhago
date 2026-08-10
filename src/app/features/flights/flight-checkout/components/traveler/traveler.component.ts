import { Component, inject, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FlightCheckoutService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-traveler',
  templateUrl: './traveler.component.html',
  styleUrl: './traveler.component.scss',
})
export class TravelerComponent {
  @Input() user!: AbstractControl;
  @Input() formGroupName = 0;

  public flightCheckoutService = inject(FlightCheckoutService);

  genderOptions = ['Male', 'Female'];
  selectedGender: string = '';

  countryList = ['USA', 'Canada', 'Mexico'];
  selectedCountry: string = '';

  expiryDate: Date | null = null;
}
