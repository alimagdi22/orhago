import { Component, inject, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrl: './booking-info.component.scss',
})
export class BookingInfoComponent implements OnInit{
  @Input() bookingId = 'N/A';
  @Input() pnr = 'N/A';
  @Input() bookingDate = 'N/A';

  translate = inject(TranslateService);

  ngOnInit(): void {
    console.log(this.bookingId);
    console.log(this.pnr);
    console.log(this.bookingDate);
  }
}
