import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Renderer2, viewChild } from '@angular/core';
import { HotelRoomsService, HotelSearchService } from 'rp-hotels-ui';
import { SharedService } from '../../../../../shared/shared.service';

@Component({
  standalone: false,
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  host: {
    class: "row"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent {
  private hotelRoomsService = inject(HotelRoomsService);
  private hotelSearchService = inject(HotelSearchService);
  public sharedService = inject(SharedService)
  public readMore = false;

  get hotelDetails() {
    return this.hotelRoomsService.roomsData.hotelDescription;
  }

  get address() {
    return this.hotelRoomsService.roomsData.Address;
  }

  get checkInDate() {
    return this.hotelSearchService.HotelSearchForm.get('checkIn')?.value;
  }

  get checkOutDate() {
    return this.hotelSearchService.HotelSearchForm.get('checkOut')?.value;
  }
}
