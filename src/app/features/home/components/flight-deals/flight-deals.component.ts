import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MostSearchedFlightsService } from './most-searched-flights.service';

@Component({
  standalone: false,
  selector: 'app-flight-deals',
  templateUrl: './flight-deals.component.html',
  styleUrl: './flight-deals.component.scss',
})
export class FlightDealsComponent implements AfterViewInit {
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  mostSearchedFlightsService = inject(MostSearchedFlightsService);

  images: string[] = [
    'assets/images/popular/Doha.png',
    'assets/images/popular/Istanbul 2.png',
    'assets/images/popular/Dubai.png'
  ];

  ngAfterViewInit(): void {
    const swiper = this.swiperEl.nativeElement;

    Object.assign(swiper, {
      spaceBetween: 20,
      navigation: true,
      pagination: { bulletClass: 'hide' },
      breakpoints: {
        0: { slidesPerView: 1 }, // Mobile view (default)
        768: { slidesPerView: 2 }, // Tablets
        1024: { slidesPerView: 3 }, // Desktops
      },
    });
  }
}
