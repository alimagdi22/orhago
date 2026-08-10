import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss',
})
export class TermsAndConditionsComponent {}
