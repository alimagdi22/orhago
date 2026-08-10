import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HotelResultsService } from 'rp-hotels-ui';

@Component({
  standalone: false,
  selector: 'app-hotels-filter',
  templateUrl: './hotels-filter.component.html',
  styleUrl: './hotels-filter.component.scss'
})
export class HotelsFilterComponent {
  public  hotelResults = inject(HotelResultsService);
  public translate = inject(TranslateService);


  @Output() resetClicked = new EventEmitter<void>();


  onReset() {
    this.resetClicked.emit();
  }
}
