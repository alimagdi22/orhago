import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MostSearchedFlightsService } from './most-searched-flights.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flight-deals',
  templateUrl: './flight-deals.component.html',
  styleUrl: './flight-deals.component.scss',
})
export class FlightDealsComponent implements AfterViewInit, OnInit {
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;
  @ViewChild('prevBtn', { static: false }) prevBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('nextBtn', { static: false }) nextBtn!: ElementRef<HTMLButtonElement>;

  mostSearchedFlightsService = inject(MostSearchedFlightsService);
  translate = inject(TranslateService);

  images: string[] = [
    'assets/images/popular/Doha.png',
    'assets/images/popular/Istanbul 2.png',
    'assets/images/popular/Dubai.png'
  ];

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(() => {
      this.updateSwiperDir();
    });
  }

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  private initSwiper(): void {
    if (!this.swiperEl?.nativeElement || !this.prevBtn?.nativeElement || !this.nextBtn?.nativeElement) return;
    const swiper = this.swiperEl.nativeElement;

    Object.assign(swiper, {
      spaceBetween: 20,
      navigation: {
        prevEl: this.prevBtn.nativeElement,
        nextEl: this.nextBtn.nativeElement,
      },
      pagination: { bulletClass: 'hide' },
      breakpoints: {
        0: { slidesPerView: 1.6 },
        700: { slidesPerView: 2 },
        1100: { slidesPerView: 4 },
      },
    });

    this.updateSwiperDir();
    if (typeof swiper.initialize === 'function') {
      swiper.initialize();
    }
  }

  private updateSwiperDir(): void {
    if (this.swiperEl?.nativeElement) {
      const isRtl = this.translate.currentLang === 'ar';
      this.swiperEl.nativeElement.dir = isRtl ? 'rtl' : 'ltr';
      if (this.swiperEl.nativeElement.swiper) {
        this.swiperEl.nativeElement.swiper.changeLanguage(isRtl ? 'ar' : 'en');
        this.swiperEl.nativeElement.swiper.update();
      }
    }
  }
}
