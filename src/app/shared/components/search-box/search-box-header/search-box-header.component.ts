import { Component, EventEmitter, Output, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-search-box-header',
  templateUrl: './search-box-header.component.html',
  styleUrl: './search-box-header.component.scss',
})
export class SearchBoxHeaderComponent implements OnInit, OnDestroy {
  @Output() tabChanged = new EventEmitter<number>();
  sharedService = inject(SharedService);
  private subscription = new Subscription();

  activeIndex = 0;

  readonly tabs = [
    { index: 0, label: 'home.search.flights' },
    { index: 1, label: 'home.search.hotels' },
    { index: 2, label: 'home.search.cars' },
    { index: 3, label: 'home.search.transfers' },
    { index: 4, label: 'home.search.packages' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.router.url.toLowerCase().includes('hotels')) {
      this.onClickTab(1);
    }

    this.subscription.add(
      this.sharedService.popularCitySelected.subscribe(() => {
        this.onClickTab(1);
      }),
    );
  }

  onClickTab(tabIndex: number): void {
    this.activeIndex = tabIndex;
    this.tabChanged.emit(tabIndex);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
