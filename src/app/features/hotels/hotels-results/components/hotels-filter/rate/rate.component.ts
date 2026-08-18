import { Component, inject } from '@angular/core';
import { HotelResultsService } from 'rp-hotels-ui';

@Component({
  standalone: false,
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrl: './rate.component.scss'
})
export class RateComponent {
  public hotelResults = inject(HotelResultsService);

  onRateClick(index: number) {
    this.hotelResults.selectHotelRates(index);
  }

  getRateCount(rate: number): number {
    return this.hotelResults.hotelDataResponse?.HotelResult?.filter(h => Number(h.hotelStars) === rate)?.length ?? 0;
  }
}
