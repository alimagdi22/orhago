import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotelRoomsService } from 'rp-hotels-ui';
import { AmenitiesDialogComponent } from './amenities-dialog/amenities-dialog.component';

@Component({
  standalone: false,
  selector: 'app-amenities-mobile',
  templateUrl: './amenities-mobile.component.html',
  styleUrls: ['./amenities-mobile.component.scss']
})
export class AmenitiesMobileComponent {
  hotelRoomsService = inject(HotelRoomsService);
  dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(AmenitiesDialogComponent, {
      width: '600px',
      maxHeight: '80vh',
      panelClass: 'custom-amenities-dialog',
      data: this.hotelRoomsService.roomsData.Amenities
    });
  }
}
