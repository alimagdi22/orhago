import { Component, inject } from '@angular/core';
import { HotelResultsService } from 'rp-hotels-ui';

@Component({
  standalone: false,
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent {
  public  hotelResults = inject(HotelResultsService);
}

