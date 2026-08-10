import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-hotel-deals',
  templateUrl: './hotel-deals.component.html',
  styleUrl: './hotel-deals.component.scss',
})
export class HotelDealsComponent implements AfterViewInit {
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  images: string[] = [
    'assets/images/popular/Doha 3.png',
    'assets/images/popular/Istanbul 2.png',
    'assets/images/popular/Dubai 3.png'
  ];

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
