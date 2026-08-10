import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  standalone: false,
  selector: 'app-amenities-dialog',
  templateUrl: './amenities-dialog.component.html',
  styleUrls: ['./amenities-dialog.component.scss']
})
export class AmenitiesDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any[]) {}
}
