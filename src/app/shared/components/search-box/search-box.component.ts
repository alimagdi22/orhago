import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Input() airlineLogo?: string;
  translate = inject(TranslateService);
  sharedService = inject(SharedService);
  router = inject(Router);

  tabIndex = 0;
  private subscription = new Subscription();

  get isFlightResults(): boolean {
    return this.router.url.includes('flight-results');
  }

  get isHotelResults(): boolean{
    return this.router.url.includes('hotels-results') || this.router.url.includes('hotels-rooms');
  }

  ngOnInit(): void {
    const url = this.router.url.toLowerCase();

    if (url.includes('hotels')) {
      this.tabIndex = 1;
    }

    this.subscription.add(
      this.sharedService.popularCitySelected.subscribe(() => {
        this.tabIndex = 1;
      })
    );
  }

  onTabChanged(_tabIndex: number) {
    this.tabIndex = _tabIndex;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
