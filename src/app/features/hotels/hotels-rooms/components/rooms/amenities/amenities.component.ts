import { amenties } from './../../../../../../../../dist/rp-hotels-ui/lib/hotel-results/interfaces.d';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrl: './amenities.component.scss',
  host: {
    style: 'padding: 20px; display: flex; gap: 20px; flex-wrap: wrap;'
  }
})
export class AmenitiesComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { amenties: amenties[]; dismiss: Function }) {}
}
