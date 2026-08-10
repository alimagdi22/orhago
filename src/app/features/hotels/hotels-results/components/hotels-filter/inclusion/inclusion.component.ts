import { Component, inject } from '@angular/core';
import { HotelResultsService } from 'rp-hotels-ui';

@Component({
  standalone: false,
  selector: 'app-inclusion',
  templateUrl: './inclusion.component.html',
  styleUrl: './inclusion.component.scss'
})
export class InclusionComponent {
  public  hotelResults = inject(HotelResultsService);
}
