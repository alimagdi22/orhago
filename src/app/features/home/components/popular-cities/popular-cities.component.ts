import { Component, inject } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';

@Component({
  standalone: false,
  selector: 'app-popular-cities',
  templateUrl: './popular-cities.component.html',
  styleUrl: './popular-cities.component.scss',
})
export class PopularCitiesComponent {
  sharedService = inject(SharedService);

  cards = [
    {
      cityName: 'Doha',
      image: 'Doha 3.png'
    },
    {
      cityName: 'Dubai',
      image: 'Dubai.png'
    },
    {
      cityName: 'Istanbul',
      image: 'Istanbul 3.png'
    },
    {
      cityName: 'London',
      image: 'London 3.png'
    },
    {
      cityName: 'Maldives',
      image: 'Maldives 3.png'
    },
    {
      cityName: 'Mecca',
      image: 'Mecca 4.png'
    },
    {
      cityName: 'Moscow',
      image: 'Moscow.png'
    },
  ];

  onSelectCity(cityName: string): void {
    this.sharedService.selectPopularCity(cityName);
  }
}
