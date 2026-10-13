import { Component, HostListener, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { ISortItem } from '../../models/sortItem.model';

@Component({
  standalone: false,
  selector: 'app-sorting-panal-app',
  templateUrl: './sorting-panal-app.component.html',
  styleUrl: './sorting-panal-app.component.scss'
})
export class SortingPanalAppComponent implements OnInit, OnDestroy {
  flightResultService = inject(FlightResultService);
  isSidebarOpen = false;
  sortOpen = false;
  nonStop = false;
  activeFilterCount = 0;
  totalPages = 0;
  itemsPerPage = 3;
  currentPageflightCards = 1;
  startIndex = 0;
  endIndex = this.itemsPerPage;
  subscription = new Subscription();
  @Input({ required: true }) sortItems: ISortItem[] = [];

  ngOnInit(): void {
    const form = this.flightResultService.filterForm;
    if (!form) {
      return;
    }

    this.syncFilters(form.value);
    this.subscription.add(form.valueChanges.subscribe((value) => {
      this.syncFilters(value);
      const active = this.sortItems.find((item) => item.isActive);
      if (active?.sortCode) {
        this.flightResultService.sortMyResult(active.sortCode);
      }
    }));
  }

  get activeSort(): ISortItem {
    return this.sortItems.find((item) => item.isActive) || this.sortItems[0];
  }

  get flightCount(): number {
    const groups = this.flightResultService.orgnizedResponce;
    if (groups?.length) {
      return groups.reduce((sum, group) => sum + group.length, 0);
    }
    return this.flightResultService.response?.airItineraries?.length || 0;
  }

  @HostListener('document:click')
  closeSort(): void {
    this.sortOpen = false;
  }

  toggleSort(event: Event): void {
    event.stopPropagation();
    this.sortOpen = !this.sortOpen;
  }

  onClickSort(sortItem: ISortItem) {
    this.sortItems.forEach((item) => {
      item.isActive = false;
    });
    sortItem.isActive = true;
    this.sortOpen = false;

    if (sortItem.sortCode && this.flightResultService.orgnizedResponce.length) {
      this.flightResultService.sortMyResult(sortItem.sortCode);
      sortItem.price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
      sortItem.currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;
    }
  }

  toggleNonStop(): void {
    const control = this.flightResultService.filterForm?.get('stopsForm.noStops');
    control?.setValue(!control.value);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  filterUpdated() {
    this.totalPages = Math.ceil(this.flightResultService.orgnizedResponce.length / this.itemsPerPage);
    this.goToPage(1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.flightResultService.orgnizedResponce.length) {
      console.error('Invalid page number');
      return;
    }
    this.currentPageflightCards = page;
    this.updateIndexes();
  }

  updateIndexes() {
    this.startIndex = (this.currentPageflightCards - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private syncFilters(value: any): void {
    if (!value) {
      this.activeFilterCount = 0;
      this.nonStop = false;
      return;
    }

    let count = 0;
    const stops = value.stopsForm || {};
    if (stops.noStops) count += 1;
    if (stops.oneStop) count += 1;
    if (stops.twoAndm) count += 1;

    const tickets = value.flexibleTickets || {};
    if (tickets.refund) count += 1;
    if (tickets.nonRefund) count += 1;
    if (value.sameAirline) count += 1;

    const airlines = value.airline?.airlines;
    if (Array.isArray(airlines)) {
      count += airlines.filter(Boolean).length;
    }

    for (const key of [
      'goingFlightScheduleDepart',
      'goingFlightScheduleArrival',
      'returnFlightScheduleDepart',
      'returnFlightScheduleArrival',
    ]) {
      if (value[key]?.startTime || value[key]?.endTime) {
        count += 1;
      }
    }

    const min = Number(this.flightResultService.minPriceValueForSlider);
    const max = Number(this.flightResultService.maxPriceValueForSlider);
    const low = Number(value.minpriceSlider);
    const high = Number(value.maxpriceSlider);
    if ((Number.isFinite(min) && low > min) || (Number.isFinite(max) && high < max && high > 0)) {
      count += 1;
    }

    this.nonStop = !!stops.noStops;
    this.activeFilterCount = count;
  }
}
