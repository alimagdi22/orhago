import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FlightResultService, FlightSearchService } from 'rp-travel-ui';
import { SharedService } from '../../../../../shared/shared.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flex-fare',
  templateUrl: './flex-fare.component.html',
  styleUrl: './flex-fare.component.scss',
})
export class FlexFareComponent implements OnInit, AfterViewInit, OnDestroy {
  flightResultService = inject(FlightResultService);
  flightSearchService = inject(FlightSearchService);
  sharedService = inject(SharedService);
  translate = inject(TranslateService);
  private elementRef = inject(ElementRef);

  subscription = new Subscription();

  currentPageflightCards = 1;
  itemsPerPage = 2;
  totalPages = Math.ceil(this.flightResultService.currentSelectedBrands.length / this.itemsPerPage);

  startIndex = 0;
  endIndex = this.itemsPerPage;

  private wheelListener = (event: WheelEvent) => {
    const hostEl = this.elementRef.nativeElement;
    const scrollable = (hostEl.querySelector('.mobile-cards-stack') as HTMLElement)
      || (hostEl.scrollHeight > hostEl.clientHeight ? hostEl : null);

    if (!scrollable) {
      event.preventDefault();
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = scrollable;
    const isScrollable = scrollHeight > clientHeight + 1;

    if (!isScrollable) {
      event.preventDefault();
    } else {
      const delta = event.deltaY;
      const isAtTop = scrollTop <= 0 && delta < 0;
      const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight && delta > 0;

      if (isAtTop || isAtBottom) {
        event.preventDefault();
      }
    }
  };

  constructor() {
    console.log(this.flightResultService.currentSelectedBrands,'brands');
    
    this.subscription.add(
      this.flightResultService.notify.asObservable().subscribe({
        next: () => {
          this.totalPages = Math.ceil(this.flightResultService.currentSelectedBrands.length / this.itemsPerPage);
        },
      }),
    );
  }

  ngOnInit(): void {
    this.elementRef.nativeElement.addEventListener('wheel', this.wheelListener, { passive: false });
  }

  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;
  ngAfterViewInit(): void {
    const swiperEl = this.swiperEl?.nativeElement;
    if (!swiperEl) return;

    const swiperParams = {
      spaceBetween: 16,
      navigation: true,
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    };

    Object.assign(swiperEl, swiperParams);
    swiperEl.dir = this.translate.currentLang === 'ar' ? 'rtl' : 'ltr';
    swiperEl.initialize();

    this.subscription.add(
      this.translate.onLangChange.subscribe(() => {
        this.updateSwiperDir();
      })
    );
  }

  updateSwiperDir(): void {
    if (this.swiperEl?.nativeElement) {
      const swiperEl = this.swiperEl.nativeElement;
      const dir = this.translate.currentLang === 'ar' ? 'rtl' : 'ltr';
      swiperEl.dir = dir;
      if (swiperEl.swiper) {
        swiperEl.swiper.changeLanguage?.(this.translate.currentLang);
        swiperEl.swiper.update();
      }
    }
  }

  get getTotalPassenger() {
    let adult = this.flightSearchService.searchFlight?.get('passengers.adults')?.value;
    let child = this.flightSearchService.searchFlight?.get('passengers.child')?.value;
    let infant = this.flightSearchService.searchFlight?.get('passengers.infant')?.value;
    return this.flightSearchService.getTotalPassengers(adult, child, infant);
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.removeEventListener('wheel', this.wheelListener);
    this.subscription.unsubscribe();
  }
}
