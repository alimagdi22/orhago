import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-flight-info-path',
  templateUrl: './flight-info-path.component.html',
  styleUrl: './flight-info-path.component.scss',
})
export class FlightInfoPathComponent {
  @Input() totalDuration = 0;
  @Input() transitTime = '';
  @Input() isDirect = false;
}
