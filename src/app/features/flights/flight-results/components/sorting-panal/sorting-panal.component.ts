import { Component, HostListener, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FlightResultService, IAirItinerary } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { ISortItem } from '../../models/sortItem.model';

@Component({
  standalone: false,
  selector: 'app-sorting-panal',
  templateUrl: './sorting-panal.component.html',
  styleUrl: './sorting-panal.component.scss',
})
export class SortingPanalComponent implements OnInit, OnDestroy {
  flightResultService = inject(FlightResultService);

  subscription = new Subscription();
  @Input({ required: true }) sortItems: ISortItem[] = [];
  menuOpen = false;
  private recommendedKeys: string[] = [];

  ngOnInit(): void {
    this.subscription.add(this.flightResultService.notify.subscribe(() => {
      this.recommendedKeys = [];
      this.captureRecommended();
      this.refreshPreviews();
      this.applyActive();
    }));
    this.captureRecommended();
    this.refreshPreviews();
    this.applyActive();

    this.subscription.add(this.flightResultService.filterForm?.valueChanges.subscribe(() => {
      this.refreshPreviews();
      this.applyActive();
    }));
  }

  get cardItems(): ISortItem[] {
    return this.sortItems.filter((item) => item.showCard !== false);
  }

  get activeItem(): ISortItem {
    return this.sortItems.find((item) => item.isActive) || this.sortItems[0];
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.menuOpen = false;
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  onClickSort(sortItem: ISortItem): void {
    this.refreshPreviews();
    this.sortItems.forEach((item) => {
      item.isActive = item === sortItem;
    });
    this.applySort(sortItem);
    this.menuOpen = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private captureRecommended(): void {
    const groups = this.flightResultService.orgnizedResponce;
    if (!groups?.length || this.recommendedKeys.length) {
      return;
    }
    this.recommendedKeys = groups.map((group) => String(group[0].pKey));
  }

  private refreshPreviews(): void {
    const groups = this.flightResultService.orgnizedResponce;
    if (!groups?.length) {
      return;
    }

    this.sortItems.forEach((item) => {
      const flight = this.previewFlight(item.sortCode);
      if (!flight) {
        return;
      }
      item.price = flight.itinTotalFare.amount;
      item.currency = flight.itinTotalFare.currencyCode;
      item.duration = flight.totalDuration;
    });
  }

  private applyActive(): void {
    const active = this.activeItem;
    if (active) {
      this.applySort(active);
    }
  }

  private applySort(item: ISortItem): void {
    const groups = this.flightResultService.orgnizedResponce;
    if (!groups?.length) {
      return;
    }

    if (item.sortCode === 0) {
      const rank = new Map(this.recommendedKeys.map((key, index) => [key, index]));
      this.flightResultService.orgnizedResponce = [...groups].sort((a, b) => {
        return (rank.get(String(a[0].pKey)) ?? 9999) - (rank.get(String(b[0].pKey)) ?? 9999);
      });
      return;
    }

    this.flightResultService.sortMyResult(item.sortCode);
  }

  private previewFlight(sortCode: number): IAirItinerary | null {
    const groups = this.flightResultService.orgnizedResponce;
    if (!groups?.length) {
      return null;
    }

    const sorted = [...groups].sort((a, b) => this.compare(a[0], b[0], sortCode));
    return sorted[0][0];
  }

  private compare(a: IAirItinerary, b: IAirItinerary, sortCode: number): number {
    if (sortCode === 1) {
      return a.itinTotalFare.amount - b.itinTotalFare.amount;
    }
    if (sortCode === 2) {
      return a.totalDuration - b.totalDuration;
    }
    if (sortCode === 7) {
      return a.experiance - b.experiance;
    }
    const rank = new Map(this.recommendedKeys.map((key, index) => [key, index]));
    return (rank.get(String(a.pKey)) ?? 9999) - (rank.get(String(b.pKey)) ?? 9999);
  }
}
