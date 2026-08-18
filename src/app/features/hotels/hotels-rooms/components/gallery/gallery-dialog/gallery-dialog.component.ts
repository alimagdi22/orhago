import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-gallery-dialog',
  template: `
    <div class="modal-backdrop" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeModal()" aria-label="Close">×</button>
        <img [src]="images[currentIndex]" alt="Hotel image" class="gallery-img" />
        <button class="arrow left" (click)="prevImage()" *ngIf="images.length > 1" aria-label="Previous">‹</button>
        <button class="arrow right" (click)="nextImage()" *ngIf="images.length > 1" aria-label="Next">›</button>
        <div class="counter" *ngIf="images.length > 0">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>
      </div>
    </div>
  `,
  styleUrl: './gallery-dialog.component.scss'
})
export class GalleryDialogComponent {
  currentIndex = 0;
  images: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<GalleryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { images: string[]; startIndex?: number }
  ) {
    this.images = data.images || [];
    this.currentIndex = data.startIndex || 0;
  }

  closeModal() {
    this.dialogRef.close();
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1;
    }
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }
}