import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FlightResultService, FlightSearchService } from 'rp-travel-ui';
import { SharedService } from '../../../shared/shared.service';
import { ISortItem } from './models/sortItem.model';
@Component({
  standalone: false,
  selector: 'app-flight-results',
  templateUrl: './flight-results.component.html',
  styleUrl: './flight-results.component.scss',
})
export class FlightResultsComponent implements OnInit, AfterViewInit, OnDestroy {
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
  public translate = inject(TranslateService)
  public flightSearchService = inject(FlightSearchService);

  currentLang = this.translate.currentLang;
  isFirstRequest = true;

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
    // Add scroll listener using Renderer2
    this.renderer.listen('window', 'scroll', this.scrollHandler);
    this.route.params.subscribe((params: Params) => {
      if(this.isFirstRequest) {
        this.isFirstRequest = false;
        return
      }
      let lang = params['language'];
      let currency = params['currency'];
      let pointOfReservation = params['SearchPoint'];
      let flightType = params['flightType'];
      let flightsInfo = params['flightInfo'];


      let serachId = params['searchId'];
      let passengers = params['passengers'];
      let Cclass = params['Cclass'];
      let showDirect: boolean;

      if (params['directOnly'] == 'false') {
        showDirect = false;
      } else {
        showDirect = true;
      }
      this.sharedService.flightType = flightType.toLowerCase();
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
        5,
        2,
      );
    });

    this.flightResultService.notify.subscribe({
      next: () => {
        this.totalPages = Math.ceil(this.flightResultService.orgnizedResponce.length / this.itemsPerPage);
        this.sortItems.forEach(e => {
          if(this.flightResultService.orgnizedResponce.length) {
            this.flightResultService.sortMyResult(e.sortCode);
            e.currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;
            e.price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
          }
        })
        this.flightResultService.sortMyResult(1);
      },
    });

    this.updateTimeoutSession();
  }

  ngAfterViewInit(): void {
    this.sharedService.scrollToTop();
  }
  
  updateTimeoutSession() {
    this.timeoutId = setTimeout(() => {
      this.sharedService.isSessionTimeoutModalShowed = true;
    }, 1200000);
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

    setTimeout(() => (this.falseLoading = false), 1000);
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

  /**
     * Handles window scroll events to show/hide sticky search box
     *
     * 1. Gets the regular search box element using Angular's Renderer2
     * 2. Calculates its position relative to viewport
     * 3. Shows sticky search when regular search scrolls 200px past viewport top
     * 4. Uses Renderer2 instead of direct DOM access for better Angular compatibility
     */
  private scrollHandler = () => {
    const regularSearch = this.elementRef.nativeElement.querySelector('.regular-search');
    if (!regularSearch) return;
    const searchBoxRect = regularSearch.getBoundingClientRect();
    this.showStickySearch = searchBoxRect.top < -this.scrollThreshold;
  };



  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
    this.sharedService.isBrandedFaresShowed = false;
    this.sharedService.isSessionTimeoutModalShowed = false;
    this.flightResultService.destroyer();
  }
}
