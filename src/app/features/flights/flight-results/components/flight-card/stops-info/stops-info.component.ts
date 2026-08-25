import { Component, Input } from '@angular/core';
import { FLIGHT_DEFAULT, IFlight } from 'rp-travel-ui';


@Component({
  standalone: false,
  selector: 'app-stops-info',
  templateUrl: './stops-info.component.html',
  styleUrl: './stops-info.component.scss',
})
export class StopsInfoComponent {
  @Input() flight: IFlight = FLIGHT_DEFAULT;
  @Input() stopsNum = 1;

  formatDuration(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);

    const parts = [];

    if (hours > 0) parts.push(`${hours} h`);
    if (minutes > 0) parts.push(`${minutes} m`);

    return parts.join(' ');
  }
}
