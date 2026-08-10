import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-search-box-header',
  templateUrl: './search-box-header.component.html',
  styleUrl: './search-box-header.component.scss',
})
export class SearchBoxHeaderComponent implements OnInit {
  @Output() tabChanged = new EventEmitter<number>();

  isFlightSelected = true;
  isHotelSelected = true;

  showFlightTab = true;
  showHotelTab = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const currentUrl = this.router.url.toLowerCase();

    this.showHotelTab = currentUrl.includes('hotels');
    this.showFlightTab = currentUrl.includes('flight');

    if (!this.showHotelTab && !this.showFlightTab) {
      this.showHotelTab = true;
      this.showFlightTab = true;
    }

    if (this.showHotelTab && !this.showFlightTab) {
      this.isFlightSelected = false;
      this.isHotelSelected = true;
      this.tabChanged.emit(1); // Hotel tab
    } else if (this.showFlightTab && !this.showHotelTab) {
      this.isFlightSelected = true;
      this.isHotelSelected = false;
      this.tabChanged.emit(0); // Flight tab
    }
  }

  onClickTab(tabIndex: number): void {
    this.isFlightSelected = tabIndex === 0;
    this.tabChanged.emit(tabIndex);
  }
}
