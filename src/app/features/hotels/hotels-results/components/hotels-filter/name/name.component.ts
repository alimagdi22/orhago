import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { HotelResultsService } from 'rp-hotels-ui';

@Component({
  standalone: false,
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrl: './name.component.scss'
})
export class NameComponent implements OnInit {
  @Output() filterClicked = new EventEmitter<void>();
  public hotelResults = inject(HotelResultsService);

  ngOnInit() {
    if (!this.hotelResults.filterForm) {
      this.hotelResults.resetHotelForm();
    }
  }

  onFilterClick() {
    this.filterClicked.emit();
  }

  triggerFilter() {
    if (this.hotelResults.filterForm) {
      this.hotelResults.filterForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    }
  }
}
