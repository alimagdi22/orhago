import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-popular-airlines',
  templateUrl: './popular-airlines.component.html',
  styleUrl: './popular-airlines.component.scss',
})
export class PopularAirlinesComponent implements AfterViewInit {
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;
  
  popularAirlines = [
    'assets/images/popular-airlines/air-arabia-egypt_3cac1a_opr 1.png',
    'assets/images/popular-airlines/egypt-air.png',
    'assets/images/popular-airlines/Emirates-Symbol 1.png',
    'assets/images/popular-airlines/Flynas_Logo.svg (1) 1.png',
    'assets/images/popular-airlines/الشركة-السعودية-لهندسة-وصناعة-الطيران 1.png',
  ];
  
  ngAfterViewInit(): void {
    const swiper = this.swiperEl.nativeElement;

    Object.assign(swiper, {
      spaceBetween: 20,
      pagination: { bulletClass: 'hide' },
      breakpoints: {
        0: { slidesPerView: 2 }, // Mobile view (default)
        768: { slidesPerView: 4 }, // Tablets
        1024: { slidesPerView: 5 }, // Desktops
      },
    });
  }
}
