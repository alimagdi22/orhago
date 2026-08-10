import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ISortItem } from '../../models/sortItem.model';
import { FlightResultService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-sorting-panal',
  templateUrl: './sorting-panal.component.html',
  styleUrl: './sorting-panal.component.scss',
})
export class SortingPanalComponent implements OnInit, OnDestroy {
  flightResultService = inject(FlightResultService);

  subscription = new Subscription();
  @Input({required: true}) sortItems: ISortItem[] = []

  ngOnInit(): void {
    this.flightResultService.filterForm.valueChanges.subscribe({
      next: () => {
        this.sortItems.forEach(e => {
          if(this.flightResultService.orgnizedResponce.length) {
            this.flightResultService.sortMyResult(e.sortCode);
            e.currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;
            e.price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
          }
        })
        this.flightResultService.sortMyResult(1);
      }
    })
  }

  onClickSort(sortItem: ISortItem) {
    this.sortItems.forEach((e) => {
      if(this.flightResultService.orgnizedResponce.length) {
        this.flightResultService.sortMyResult(e.sortCode);
        e.isActive = false;
        e.currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;
        e.price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
      }
    });

    this.flightResultService.sortMyResult(sortItem.sortCode);

    sortItem.isActive = true;
    sortItem.price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
    sortItem.currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
