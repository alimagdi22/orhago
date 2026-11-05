import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Brand, FlightResultService, HomePageService, IAirItinerary } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../shared/shared.service';
import { FareFlightView, fareFlightFromItinerary, fareFlightStorageKey } from './fare-flight';

@Component({
  standalone: false,
  selector: 'app-fare-selection',
  templateUrl: './fare-selection.component.html',
  styleUrl: './fare-selection.component.scss',
})
export class FareSelectionComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private subscription = new Subscription();

  flightResultService = inject(FlightResultService);
  homePageService = inject(HomePageService);
  sharedService = inject(SharedService);
  translate = inject(TranslateService);

  @ViewChild('fareTrack') fareTrack?: ElementRef<HTMLElement>;

  brands: Brand[] = [];
  flight: FareFlightView | null = null;
  loading = true;
  empty = false;
  canScrollPrev = false;
  canScrollNext = false;

  private pointerId: number | null = null;
  private pointerStart = 0;
  private pointerScroll = 0;
  private suppressClick = false;

  private sid = '';
  sequenceNum = 0;
  providerKey = '';
  pcc = '0';
  private returnUrl = '/';
  private waitingForApi = false;

  ngOnInit(): void {
    this.subscription.add(
      this.flightResultService.brandedFareNotifier.subscribe({
        next: () => {
          if (!this.waitingForApi) {
            return;
          }
          this.waitingForApi = false;
          this.applyBrands(this.flightResultService.currentSelectedBrands || []);
        },
        error: () => {
          if (!this.waitingForApi) {
            return;
          }
          this.waitingForApi = false;
          this.loading = false;
          this.empty = true;
        },
      }),
    );

    this.subscription.add(
      this.route.queryParamMap.subscribe((params) => {
        this.sid = params.get('sid') || '';
        this.sequenceNum = Number(params.get('sequenceNum') || 0);
        this.providerKey = params.get('providerKey') || '';
        this.pcc = params.get('pcc') || '0';
        this.returnUrl = params.get('returnUrl') || '/';
        if (this.sid) {
          this.flightResultService.searchID = this.sid;
        }
        this.flight = this.readFlight();
        this.loadFares();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get visibleCount(): number {
    const width = this.sharedService.screenWidth;
    if (width >= 1100) return 4;
    if (width >= 700) return 2;
    return 1;
  }

  get canSlideFares(): boolean {
    return this.brands.length > this.visibleCount;
  }

  get currencyCode(): string {
    return this.homePageService.selectedCurrency?.Currency_Code || this.brands[0]?.itinTotalFare?.currencyCode || '';
  }

  get dateLocale(): string {
    return this.translate.currentLang === 'ar' ? 'ar-EG' : 'en-US';
  }

  get durationLabel(): string {
    const total = this.flight?.elapsedMinutes || 0;
    const hours = Math.floor(total / 60);
    const minutes = String(total % 60).padStart(2, '0');
    return this.translate.currentLang === 'ar' ? `${hours}س ${minutes}د` : `${hours}h ${minutes}m`;
  }

  get stopsKey(): string {
    if (!this.flight || this.flight.stops === 0) {
      return 'results.filter.Non-Stop';
    }
    if (this.flight.stops === 1) {
      return 'results.filter.1 Stop';
    }
    return '';
  }

  changeFlight(): void {
    if (this.returnUrl && this.returnUrl !== '/') {
      this.router.navigateByUrl(this.returnUrl);
      return;
    }
    this.router.navigate(['/']);
  }

  continueToCheckout(): void {
    this.sharedService.onSelectFlight(this.sequenceNum, this.pcc, this.providerKey);
  }

  scrollFares(direction: number): void {
    const track = this.fareTrack?.nativeElement;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll('app-fare-option-card')) as HTMLElement[];
    if (!cards.length) return;

    const rtl = getComputedStyle(track).direction === 'rtl';
    const edge = rtl ? track.getBoundingClientRect().right : track.getBoundingClientRect().left;
    let closest = 0;
    let best = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const start = rtl ? rect.right : rect.left;
      const distance = Math.abs(start - edge);
      if (distance < best) {
        best = distance;
        closest = index;
      }
    });

    const next = Math.min(cards.length - 1, Math.max(0, closest + direction));
    cards[next].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }

  onFareScroll(): void {
    this.updateFareArrows();
  }

  onFarePointerDown(event: PointerEvent): void {
    const track = this.fareTrack?.nativeElement;
    const target = event.target as HTMLElement | null;
    if (!track || !this.canSlideFares || target?.closest('button, a')) {
      return;
    }
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    this.pointerId = event.pointerId;
    this.pointerStart = event.clientX;
    this.pointerScroll = track.scrollLeft;
    this.suppressClick = false;
  }

  onFarePointerMove(event: PointerEvent): void {
    const track = this.fareTrack?.nativeElement;
    if (!track || this.pointerId !== event.pointerId) return;
    const delta = event.clientX - this.pointerStart;
    if (Math.abs(delta) <= 6) return;
    if (!this.suppressClick) {
      this.suppressClick = true;
      track.style.scrollBehavior = 'auto';
      if (!track.hasPointerCapture(event.pointerId)) {
        track.setPointerCapture(event.pointerId);
      }
    }
    track.scrollLeft = this.pointerScroll - delta;
  }

  onFarePointerUp(event: PointerEvent): void {
    const track = this.fareTrack?.nativeElement;
    if (!track || this.pointerId !== event.pointerId) return;
    this.pointerId = null;
    track.style.scrollBehavior = '';
    if (!this.suppressClick) return;
    const stop = (click: Event) => {
      click.preventDefault();
      click.stopPropagation();
      track.removeEventListener('click', stop, true);
    };
    track.addEventListener('click', stop, true);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateFareArrows();
  }

  private loadFares(): void {
    if (!this.sid || !this.sequenceNum) {
      this.loading = false;
      this.empty = true;
      return;
    }

    const cached = this.readCachedBrands();
    if (cached) {
      this.flightResultService.currentSelectedBrands = cached;
      this.applyBrands(cached);
      return;
    }

    this.loading = true;
    this.empty = false;
    this.brands = [];
    this.waitingForApi = true;
    this.flightResultService.getBrandedFares(this.sid, this.sequenceNum, this.providerKey, this.pcc);
  }

  private applyBrands(brands: Brand[]): void {
    this.brands = brands;
    this.loading = false;
    this.empty = brands.length === 0;
    setTimeout(() => this.updateFareArrows());
  }

  private updateFareArrows(): void {
    const track = this.fareTrack?.nativeElement;
    if (!track || !this.canSlideFares) {
      this.canScrollPrev = false;
      this.canScrollNext = false;
      return;
    }

    const max = track.scrollWidth - track.clientWidth;
    const left = track.scrollLeft;
    const rtl = getComputedStyle(track).direction === 'rtl';
    if (!rtl || left < 0) {
      const position = rtl ? -left : left;
      this.canScrollPrev = position > 2;
      this.canScrollNext = position < max - 2;
      return;
    }

    this.canScrollPrev = left < max - 2;
    this.canScrollNext = left > 2;
  }

  private readCachedBrands(): Brand[] | null {
    if (!this.isBrowser) {
      return null;
    }
    const raw = sessionStorage.getItem(this.sid + this.sequenceNum + this.providerKey + this.pcc);
    if (!raw) {
      return null;
    }
    try {
      const brands = JSON.parse(raw);
      return Array.isArray(brands) ? brands : null;
    } catch {
      return null;
    }
  }

  private readFlight(): FareFlightView | null {
    const itinerary = this.findItinerary();
    const live = fareFlightFromItinerary(itinerary);
    if (live) {
      if (itinerary) {
        this.sharedService.selectedFlightItinerary = itinerary;
      }
      return live;
    }

    if (!this.isBrowser) {
      return null;
    }
    const raw = sessionStorage.getItem(fareFlightStorageKey(this.sid, this.sequenceNum, this.providerKey, this.pcc));
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as FareFlightView;
    } catch {
      return null;
    }
  }

  private findItinerary(): IAirItinerary | null {
    const groups = this.flightResultService.orgnizedResponce || [];
    for (const group of groups) {
      const found = group?.find((item) => Number(item.sequenceNum) === this.sequenceNum);
      if (found) {
        return found;
      }
    }

    const selected = this.sharedService.selectedFlightItinerary;
    if (Number(selected?.sequenceNum) === this.sequenceNum) {
      return selected;
    }
    return null;
  }
}
