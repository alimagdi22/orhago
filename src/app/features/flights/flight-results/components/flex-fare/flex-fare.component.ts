import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class FlexFareComponent implements OnDestroy {
  flightResultService = inject(FlightResultService);
  flightSearchService = inject(FlightSearchService);
  sharedService = inject(SharedService);
  translate = inject(TranslateService);

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
        },
      }),
    );
  }

    @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;
    ngAfterViewInit(): void {
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

      swiperEl.initialize();
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
