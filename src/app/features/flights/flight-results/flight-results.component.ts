import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FlightResultService, FlightSearchService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../shared/shared.service';
import { ISortItem } from './models/sortItem.model';

@Component({
  standalone: false,
  selector: 'app-flight-results',
  templateUrl: './flight-results.component.html',
  styleUrl: './flight-results.component.scss',
})
export class FlightResultsComponent implements OnInit, AfterViewInit, OnDestroy {
  subscription = new Subscription();
  route = inject(ActivatedRoute);
  flightResultService = inject(FlightResultService);
  sharedService = inject(SharedService);
  renderer = inject(Renderer2);
  elementRef = inject(ElementRef);
  searchId!: string;
  isSidebarOpen: boolean = false;
  isSearchVisible: boolean = false;
  currentPageflightCards = 1;
  itemsPerPage = 3;
  totalPages = 0;
  startIndex = 0;
  endIndex = this.itemsPerPage;
  timeoutId: any = '';
  falseLoading = false;
  showStickySearch = false;
  private scrollThreshold = 180;
  public translate = inject(TranslateService);
  public flightSearchService = inject(FlightSearchService);

  currentLang = this.translate.currentLang;

  sortItems: ISortItem[] = [
    {
      title: 'Cheapest',
      price: '',
      currency: '',
      isActive: true,
      sortCode: 1,
    },
    {
      title: 'Fastest',
      price: '',
      currency: '',
      isActive: false,
      sortCode: 2,
    },
  ];

  filterUpdated() {
    this.totalPages = Math.ceil(this.flightResultService.orgnizedResponce.length / this.itemsPerPage);
    this.goToPage(1);
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.renderer.listen('window', 'scroll', this.scrollHandler);
      this.updateTimeoutSession();
    }

    this.route.params.subscribe((params: Params) => {
      this.isSearchVisible = false;
      let lang = params['language'];
      let currency = params['currency'];
      let pointOfReservation = params['SearchPoint'];
      let flightType = params['flightType'];
      let flightsInfo = params['flightInfo'];
      let serachId = params['searchId'];
      let passengers = params['passengers'];
      let Cclass = params['Cclass'];
      let destinationType = params['destinationType'];
      let showDirect: boolean;

      if (params['directOnly'] == 'false') {
        showDirect = false;
      } else {
        showDirect = true;
      }
      this.sharedService.flightType = flightType ? flightType.toLowerCase() : 'oneway';
      this.searchId = params['searchId'];
      this.flightResultService.getDataFromUrl(
        lang,
        currency,
        pointOfReservation,
        flightType,
        flightsInfo,
        serachId,
        passengers,
        Cclass,
        showDirect,
        destinationType || 'Airport_Airport',
        5,
        2,
      );
    });

    this.subscription.add(
      this.sharedService.toggleFlightSearchNotifier.subscribe(() => {
        this.onSummaryToggle();
      })
    );

    this.subscription.add(
      this.flightResultService.notify.subscribe({
        next: () => {
          this.totalPages = Math.ceil(this.flightResultService.orgnizedResponce.length / this.itemsPerPage);
          this.sortItems.forEach(e => {
            if (this.flightResultService.orgnizedResponce.length) {
              this.flightResultService.sortMyResult(e.sortCode);
              e.currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;
              e.price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
            }
          });
          this.flightResultService.sortMyResult(1);
        },
      })
    );
  }

  ngAfterViewInit(): void {
    this.sharedService.scrollToTop();
  }

  updateTimeoutSession() {
    if (typeof window !== 'undefined') {
      this.timeoutId = setTimeout(() => {
        this.sharedService.isSessionTimeoutModalShowed = true;
      }, 1200000);
    }
  }

  updateIndexes() {
    this.startIndex = (this.currentPageflightCards - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.flightResultService.orgnizedResponce.length) {
      console.error('Invalid page number');
      return;
    }
    this.currentPageflightCards = page;

    this.updateIndexes();
  }

  nextPage() {
    this.falseLoading = true;

    if (typeof window !== 'undefined') {
      setTimeout(() => (this.falseLoading = false), 1000);
    } else {
      this.falseLoading = false;
    }

    if (this.currentPageflightCards < this.flightResultService.orgnizedResponce.length) {
      this.currentPageflightCards++;

      this.updateIndexes();
    }
  }

  prevPage() {
    if (this.currentPageflightCards > 1) {
      this.currentPageflightCards--;

      this.updateIndexes();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  onSummaryToggle() {
    if (typeof window !== 'undefined') {
      const isScrolled = window.scrollY > 50 || document.documentElement.scrollTop > 50;
      if (isScrolled) {
        this.isSearchVisible = true;
        this.sharedService.scrollToTop();
        return;
      }
    }
    this.toggleSearch();
  }

  private scrollHandler = () => {
    if (typeof window === 'undefined') return;
    const regularSearch = this.elementRef.nativeElement.querySelector('.regular-search');
    if (!regularSearch) return;
    const searchBoxRect = regularSearch.getBoundingClientRect();
    this.showStickySearch = searchBoxRect.top < -this.scrollThreshold;
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (typeof window !== 'undefined' && this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.sharedService.isBrandedFaresShowed = false;
    this.sharedService.isSessionTimeoutModalShowed = false;
    this.flightResultService.destroyer();
  }
}
