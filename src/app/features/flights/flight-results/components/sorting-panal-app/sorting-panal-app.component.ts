import { Component, inject, Input } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { ISortItem } from '../../models/sortItem.model';

@Component({
  standalone: false,
  selector: 'app-sorting-panal-app',
  templateUrl: './sorting-panal-app.component.html',
  styleUrl: './sorting-panal-app.component.scss'
})
export class SortingPanalAppComponent {
flightResultService = inject(FlightResultService);
  isSidebarOpen: boolean = false;
  totalPages = 0;
  itemsPerPage = 3;
  currentPageflightCards = 1;
  startIndex = 0;
  endIndex = this.itemsPerPage;
  subscription = new Subscription();
  @Input({required: true}) sortItems: ISortItem[] = []

  ngOnInit(): void {
    this.flightResultService.filterForm.valueChanges.subscribe({
      next: () => {
        const active = this.sortItems.find((item) => item.isActive);
        if (active?.sortCode) {
          this.flightResultService.sortMyResult(active.sortCode);
        }
      }
    })
  }

  onClickSort(sortItem: ISortItem) {
    this.sortItems.forEach((item) => {
      item.isActive = false;
    });
    sortItem.isActive = true;

    if (sortItem.sortCode && this.flightResultService.orgnizedResponce.length) {
      this.flightResultService.sortMyResult(sortItem.sortCode);
      sortItem.price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
      sortItem.currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;
    }
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
}
