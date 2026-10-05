import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { MostSearchedFlightsResponse, TerminalAirport } from '../interfaces';
import { MostSearchedFlightsService } from '../most-searched-flights.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-flight-deals-card',
  templateUrl: './flight-deals-card.component.html',
  styleUrl: './flight-deals-card.component.scss',
})
export class FlightDealsCardComponent implements OnInit, OnChanges {
  @Input({ required: true }) mostSearchedFlight!: MostSearchedFlightsResponse;

  mostSearchedFlightsService = inject(MostSearchedFlightsService);
  translate = inject(TranslateService);

  defaultImage = 'assets/images/popular/Dubai.png';
  displayImage = 'assets/images/popular/Dubai.png';

  ngOnInit(): void {
    this.updateImage();
  }

  ngOnChanges(): void {
    this.updateImage();
  }

  updateImage(): void {
    const airport = this.mostSearchedFlight?.cheapestAirItinerary?.allJourney?.flights?.[0]?.flightDTO?.[this.mostSearchedFlight?.cheapestAirItinerary?.allJourney?.flights?.[0]?.flightDTO.length - 1]
      ?.arrivalTerminalAirport as any;
    const cityImage = airport?.en?.cityImage || airport?.cityImage;
    if (!cityImage || typeof cityImage !== 'string') {
      this.displayImage = this.defaultImage;
    } else {
      this.displayImage = cityImage;
    }
  }

  onImgError(): void {
    this.displayImage = this.defaultImage;
  }

  get cityName(): string {
    return this.airportField('cityName') || this.mostSearchedFlight?.searchCriteria?.flights?.[0]?.arrivingTo || '';
  }

  get metaLabel(): string {
    const country = this.airportField('countryName');
    const duration = this.durationLabel;
    if (country && duration) {
      return `${country} · ${duration}`;
    }
    return country || duration;
  }

  get durationLabel(): string {
    const minutes = this.mostSearchedFlight?.cheapestAirItinerary?.allJourney?.flights?.[0]?.elapsedTime
      || this.mostSearchedFlight?.cheapestAirItinerary?.totalDuration;
    if (!minutes) {
      return '';
    }

    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    const arabic = this.translate.currentLang === 'ar';
    const hourUnit = arabic ? 'س' : 'h';
    const minuteUnit = arabic ? 'د' : 'm';

    if (!hours) {
      return `${remainder}${minuteUnit}`;
    }
    if (!remainder) {
      return `${hours}${hourUnit}`;
    }
    return `${hours}${hourUnit} ${remainder.toString().padStart(2, '0')}${minuteUnit}`;
  }

  private airportField(field: keyof TerminalAirport): string {
    const legs = this.mostSearchedFlight?.cheapestAirItinerary?.allJourney?.flights?.[0]?.flightDTO;
    const airport = legs?.[legs.length - 1]?.arrivalTerminalAirport as TerminalAirport & {
      en?: TerminalAirport;
      ar?: TerminalAirport;
    };
    if (!airport) {
      return '';
    }

    const lang = this.translate.currentLang === 'ar' ? 'ar' : 'en';
    const translated = airport[lang]?.[field];
    if (typeof translated === 'string' && translated) {
      return translated;
    }

    const value = airport[field];
    return typeof value === 'string' ? value : '';
  }
}
