import { Component, Input } from '@angular/core';

export interface IHotelDeal {
  image: string;
  type: string;
  discount: string;
  name: string;
  location: string;
  price: string;
}

@Component({
  standalone: false,
  selector: 'app-hotel-deals-card',
  templateUrl: './hotel-deals-card.component.html',
  styleUrl: './hotel-deals-card.component.scss',
})
export class HotelDealsCardComponent {
  @Input() image: string = '';
  @Input() deal?: IHotelDeal;
}
