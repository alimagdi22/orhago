import { Component, inject, Input, output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HotelResultsService, HotelSearchService } from 'rp-hotels-ui';

@Component({
  standalone: false,
  selector: 'app-hotel-summary',
  templateUrl: './hotel-summary.component.html',
  styleUrl: './hotel-summary.component.scss'
})
export class HotelSummaryComponent {
  @Input() isScrolled = false;
  toggle = output<void>();

  translate = inject(TranslateService);
  hotelSearchService = inject(HotelSearchService);
  hotelResultsService = inject(HotelResultsService);

  get cityName(): string {
    const loc = this.hotelSearchService?.HotelSearchForm?.get('location')?.value;
    if (loc) {
      if (typeof loc === 'string') return loc;
      if (loc.City) return loc.City;
      if (loc.cityName) return loc.cityName;
      if (loc.Name) return loc.Name;
    }
    const serviceAny = this.hotelResultsService as any;
    const resReq = serviceAny?.response?.HotelRequest || serviceAny?.response || serviceAny?.hotelSearchModel;
    if (resReq?.CityName) {
      return resReq.CityName;
    }
    const cached = typeof localStorage !== 'undefined' ? localStorage.getItem('hotelSearchFormData') : null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.location) {
          return typeof parsed.location === 'string' ? parsed.location : (parsed.location.City || parsed.location.cityName || '');
        }
      } catch (e) {}
    }
    return '';
  }

  get checkInDate(): Date | string | null {
    const serviceAny = this.hotelResultsService as any;
    const resReq = serviceAny?.response?.HotelRequest || serviceAny?.response || serviceAny?.hotelSearchModel;
    if (resReq?.CheckIn) return resReq.CheckIn;
    if (resReq?.checkIn) return resReq.checkIn;
    if (resReq?.DateFrom) return resReq.DateFrom;
    const formVal = this.hotelSearchService?.HotelSearchForm?.get('checkIn')?.value;
    if (formVal) return formVal;
    return null;
  }

  get checkOutDate(): Date | string | null {
    const serviceAny = this.hotelResultsService as any;
    const resReq = serviceAny?.response?.HotelRequest || serviceAny?.response || serviceAny?.hotelSearchModel;
    if (resReq?.CheckOut) return resReq.CheckOut;
    if (resReq?.checkOut) return resReq.checkOut;
    if (resReq?.DateTo) return resReq.DateTo;
    const formVal = this.hotelSearchService?.HotelSearchForm?.get('checkOut')?.value;
    if (formVal) return formVal;
    return null;
  }
}
