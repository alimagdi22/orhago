import { Component, ElementRef, inject, ViewChild, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { FlightResultService, FlightSearchService } from 'rp-travel-ui';
import { SharedService } from '../../shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-flex-fare-app',
  templateUrl: './flex-fare-app.component.html',
  styleUrl: './flex-fare-app.component.scss'
})
export class FlexFareAppComponent implements AfterViewInit, OnDestroy {
  flightResultService = inject(FlightResultService);
  flightSearchService = inject(FlightSearchService);
  sharedService = inject(SharedService);
  translate = inject(TranslateService);
  private cdRef = inject(ChangeDetectorRef);

  subscription = new Subscription();

  currentPageflightCards = 1;
  itemsPerPage = 2;
  totalPages = Math.ceil(this.flightResultService.currentSelectedBrands.length / this.itemsPerPage);

  startIndex = 0;
  endIndex = this.itemsPerPage;

  constructor() {
    this.subscription.add(
      this.flightResultService.notify.asObservable().subscribe({
        next: () => {
          this.totalPages = Math.ceil(this.flightResultService.currentSelectedBrands.length / this.itemsPerPage);
          this.cdRef.detectChanges();
        },
      }),
    );

    this.subscription.add(
      this.flightResultService.brandedFareNotifier.subscribe({
        next: () => {
          this.totalPages = Math.ceil(this.flightResultService.currentSelectedBrands.length / this.itemsPerPage);
          this.cdRef.detectChanges();

          setTimeout(() => {
            this.initializeSwiper();
          }, 100);
        },
        error: (err) => {
          console.error('Error loading branded fares:', err);
        }
      })
    );

    this.subscription.add(
      this.translate.onLangChange.subscribe(() => {
        this.initializeSwiper();
      })
    );
  }

  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  initializeSwiper() {
    if (!this.swiperEl?.nativeElement) return;

    const swiperEl = this.swiperEl.nativeElement;

    const swiperParams = {
      spaceBetween: 20,
      navigation: true,
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 2 },
      },
    };

    Object.assign(swiperEl, swiperParams);
    swiperEl.dir = this.translate.currentLang === 'ar' ? 'rtl' : 'ltr';

    if (!swiperEl.swiper) {
      swiperEl.initialize();
    } else {
      swiperEl.swiper.changeLanguage?.(this.translate.currentLang);
      swiperEl.swiper.update();
    }
  }

  get getTotalPassenger() {
    let adult = this.flightSearchService.searchFlight?.get('passengers.adults')?.value;
    let child = this.flightSearchService.searchFlight?.get('passengers.child')?.value;
    let infant = this.flightSearchService.searchFlight?.get('passengers.infant')?.value;
    return this.flightSearchService.getTotalPassengers(adult, child, infant);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
