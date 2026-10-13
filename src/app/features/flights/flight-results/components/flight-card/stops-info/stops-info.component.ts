import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  private translate = inject(TranslateService);

  get viaCode(): string {
    if ((this.flight?.stopsNum || 0) < 1) {
      return '';
    }
    return this.flight?.flightDTO?.[0]?.arrivalTerminalAirport?.airportCode || '';
  }

  get durationLabel(): string {
    return this.formatMinutes(Number(this.flight?.elapsedTime) || 0);
  }

  formatDuration(time: string): string {
    if (!time) {
      return '';
    }
    const [hours, minutes] = time.split(':').map(Number);
    return this.formatMinutes((hours || 0) * 60 + (minutes || 0));
  }

  private formatMinutes(total: number): string {
    const hours = Math.floor(total / 60);
    const minutes = String(total % 60).padStart(2, '0');
    return this.translate.currentLang === 'ar' ? `${hours}س ${minutes}د` : `${hours}h ${minutes}m`;
  }
}
