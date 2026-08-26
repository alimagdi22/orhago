import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';
import { HotelRoomsService } from 'rp-hotels-ui';
import { IMainButton } from '../../../../../shared/models/flights/mainButton.model';
import { GalleryDialogComponent } from './gallery-dialog/gallery-dialog.component';
import { SharedService } from '../../../../../shared/shared.service';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  host: {
    class: 'row'
  }
})
export class GalleryComponent implements OnInit {
  @Input({ required: true }) location?: SafeResourceUrl;
  @Input({ required: true }) currency?: string;

  private hotelRoomsService = inject(HotelRoomsService);
  public sharedService = inject(SharedService);
  public dialog = inject(MatDialog);
  public selectButton: IMainButton = {
    height: '45px',
    borderRadius: '12px',
  };
  public stars: number[] = [];
  public showSingleFallback = false;
  private failedImagesCount = 0;

  ngOnInit() {
    this.stars = Array.from({ length: this.hotelRoomsService.roomsData?.hotelStars || 0 }, (_, i) => i);
  }

  onImageError(index: number): void {
    this.failedImagesCount++;
    const totalImages = this.roomsData?.hotelImages?.length || 1;
    if (index === 0 || this.failedImagesCount >= totalImages) {
      this.showSingleFallback = true;
    }
  }

  openGallery(index = 0) {
    if (this.showSingleFallback) return;

    const images = this.roomsData?.hotelImages || [];

    this.dialog.open(GalleryDialogComponent, {
      data: { images, startIndex: index },
      panelClass: 'gallery-dialog-panel',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });
  }

  get roomsData() {
    return this.hotelRoomsService.roomsData;
  }

  async copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: 'success',
        title: 'Link copied!',
        text: 'The link has been copied to your clipboard.',
        showConfirmButton: false,
        timer: 2000
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to copy link!',
      });
    }
  }
}
