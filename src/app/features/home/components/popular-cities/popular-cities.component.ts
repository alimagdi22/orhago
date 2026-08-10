import { animate } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-popular-cities',
  templateUrl: './popular-cities.component.html',
  styleUrl: './popular-cities.component.scss',
})
export class PopularCitiesComponent implements AfterViewInit{
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

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
  ]
  
  ngAfterViewInit(): void {
    const swiper = this.swiperEl.nativeElement;

    Object.assign(swiper, {
      spaceBetween: 20,
      pagination: { bulletClass: 'hide' },
      breakpoints: {
        0: { slidesPerView: 1 }, // Mobile view (default)
        768: { slidesPerView: 2 }, // Tablets
        1024: { slidesPerView: 3 }, // Desktops
      },
    });
  }
}
