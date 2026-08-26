import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotelsRoomsRoutingModule } from './hotels-rooms-routing.module';
import { HotelsRoomsComponent } from './hotels-rooms.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { SharedModule } from '../../../shared/shared.module';
import { GalleryConfig, GalleryModule } from 'ng-gallery';
import { DEFAULT_DIALOG_CONFIG } from '@angular/cdk/dialog';
import { GalleryDialogComponent } from './components/gallery/gallery-dialog/gallery-dialog.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { GuestRatingComponent } from './components/guest-rating/guest-rating.component';
import { ReviewComponent } from './components/review/review.component';
import { MapComponent } from './components/map/map.component';
import { DetailsComponent } from './components/details/details.component';
import { AmenitiesComponent } from './components/rooms/amenities/amenities.component';
import { AmenitiesDialogComponent } from './components/amenities-mobile/amenities-dialog/amenities-dialog.component';
import { AmenitiesMobileComponent } from './components/amenities-mobile/amenities-mobile.component';
import { CancellationPolicyComponent } from './components/cancellation-policy/cancellation-policy.component';

@NgModule({
  declarations: [
    HotelsRoomsComponent,
    GalleryComponent,
    RoomsComponent,
    GuestRatingComponent,
    ReviewComponent,
    MapComponent,
    DetailsComponent,
    AmenitiesComponent,
    AmenitiesDialogComponent,
    AmenitiesMobileComponent,
    CancellationPolicyComponent,
  ],
  imports: [
    CommonModule,
    HotelsRoomsRoutingModule,
    SharedModule,
    GalleryModule,
    GalleryDialogComponent
  ],
  exports: [
    GalleryDialogComponent,
    CancellationPolicyComponent
  ],
  providers: [
    {
      provide: DEFAULT_DIALOG_CONFIG,
      useValue: {
        imageSize: 'cover'
      } as GalleryConfig
    }
  ]
})
export class HotelsRoomsModule { }
