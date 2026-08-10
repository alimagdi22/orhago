import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-hotel-deals-card',
  templateUrl: './hotel-deals-card.component.html',
  styleUrl: './hotel-deals-card.component.scss',
})
export class HotelDealsCardComponent {
  @Input() image!: string;

}
