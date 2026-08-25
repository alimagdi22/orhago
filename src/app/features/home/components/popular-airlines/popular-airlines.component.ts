import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-popular-airlines',
  templateUrl: './popular-airlines.component.html',
  styleUrl: './popular-airlines.component.scss',
  host: {
    'ngSkipHydration': 'true',
  },
})
export class PopularAirlinesComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  http = inject(HttpClient);
  router = inject(Router);

  popularAirlines: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.fetchAirlines();
  }

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  initSwiper(): void {
    if (this.swiperEl?.nativeElement) {
      const swiper = this.swiperEl.nativeElement;

      Object.assign(swiper, {
        slidesPerView: 5,
        spaceBetween: 20,
        pagination: { bulletClass: 'hide' },
        breakpoints: {
          0: { slidesPerView: 2 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        },
      });

      if (typeof swiper.initialize === 'function') {
        swiper.initialize();
      } else if (swiper.swiper && typeof swiper.swiper.update === 'function') {
        swiper.swiper.update();
      }
    }
  }

  fetchAirlines(): void {
    this.isLoading = true;
    this.http.get<any>('https://cms.travasky.com/api/GetAllAirLines').subscribe({
      next: (res) => {
        if (res && res.returnObject) {
          this.popularAirlines = res.returnObject.map((item: any) => ({
            ...item,
            airlineLogo: item.airlineLogo ? item.airlineLogo.replace(/\\/g, '/') : item.airlineLogo,
          }));
        }
        this.isLoading = false;
        setTimeout(() => this.initSwiper(), 100);
      },
      error: () => {
        this.http.get<any>('http://154.41.209.93:3016/api/GetAllAirLines').subscribe({
          next: (res) => {
            if (res && res.returnObject) {
              this.popularAirlines = res.returnObject.map((item: any) => ({
                ...item,
                airlineLogo: item.airlineLogo ? item.airlineLogo.replace(/\\/g, '/') : item.airlineLogo,
              }));
            }
            this.isLoading = false;
            setTimeout(() => this.initSwiper(), 100);
          },
          error: (err) => {
            console.error('Error fetching airlines:', err);
            this.isLoading = false;
          },
        });
      },
    });
  }

  navigateToAirline(slug: string): void {
    console.log(slug,'hello');
    
    if (slug) {
      this.router.navigate([`/airline/${slug}`]).then(() => {
            console.log('yes');
            
          })
        .catch(() => {
            console.log('no');
            
          });
    }
  }
}
