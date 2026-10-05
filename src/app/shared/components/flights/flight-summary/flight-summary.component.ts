import { Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FlightResultService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../shared.service';

interface TripSegment {
  from: string;
  to: string;
  date: Date | null;
}

@Component({
  standalone: false,
  selector: 'app-flight-summary',
  templateUrl: './flight-summary.component.html',
  styleUrl: './flight-summary.component.scss',
})
export class FlightSummaryComponent implements OnInit, OnDestroy {
  toggle = output<void>();

  private route = inject(ActivatedRoute);
  private sharedService = inject(SharedService);
  private flightResultService = inject(FlightResultService);
  translate = inject(TranslateService);

  private params: Params = {};
  private subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(this.route.params.subscribe((params) => {
      this.params = params;
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get fromCity(): string {
    return this.namedCity('from');
  }

  get toCity(): string {
    return this.namedCity('to');
  }

  get departDate(): Date | null {
    return this.segments[0]?.date || null;
  }

  get returnDate(): Date | null {
    const type = String(this.params['flightType'] || '').toLowerCase();
    if (type === 'oneway' || type === 'one-way' || this.segments.length < 2) {
      return null;
    }
    return this.segments[this.segments.length - 1]?.date || null;
  }

  get dateLocale(): string {
    return this.translate.currentLang === 'ar' ? 'ar-EG' : 'en-US';
  }

  get adults(): number {
    return this.passengerCount('A');
  }

  get children(): number {
    return this.passengerCount('C');
  }

  get infants(): number {
    return this.passengerCount('I');
  }

  get cabinKey(): string {
    const cabin = this.params['Cclass'] || this.flightResultService.response?.searchCriteria?.selectedFlightClass || '';
    return cabin ? `searchBox.${cabin}` : '';
  }

  private get segments(): TripSegment[] {
    const info = String(this.params['flightInfo'] || '');
    if (!info) {
      return [];
    }

    return info.split('_').map((part) => {
      const bits = decodeURIComponent(part).split('-');
      if (bits.length < 3) {
        return null;
      }
      return {
        from: bits[0],
        to: bits[1],
        date: this.parseDate(bits.slice(2).join('-')),
      };
    }).filter((segment): segment is TripSegment => !!segment);
  }

  private namedCity(end: 'from' | 'to'): string {
    const code = end === 'from' ? this.segments[0]?.from : this.segments[0]?.to;
    const selected = end === 'from'
      ? this.sharedService.selectedDestions[0]?.departingCity
      : this.sharedService.selectedDestions[0]?.landingCity;

    if (selected?.cityName && this.codeMatches(selected, code)) {
      return selected.cityName;
    }

    return this.airportCity(end === 'from' ? 'departure' : 'arrival', code) || code || '';
  }

  private codeMatches(airport: { airportCode?: string; cityCode?: string }, code?: string): boolean {
    if (!code) {
      return true;
    }
    return airport.airportCode === code || airport.cityCode === code;
  }

  private passengerCount(kind: 'A' | 'C' | 'I'): number {
    const match = String(this.params['passengers'] || '').match(new RegExp(`${kind}-(\\d+)`));
    if (match) {
      return Number(match[1]);
    }

    const criteria = this.flightResultService.response?.searchCriteria;
    if (!criteria) {
      return 0;
    }
    if (kind === 'A') return criteria.adultNum || 0;
    if (kind === 'C') return criteria.childNum || 0;
    return criteria.infantNum || 0;
  }

  private airportCity(end: 'departure' | 'arrival', code?: string): string {
    const flight = this.flightResultService.orgnizedResponce?.[0]?.[0]?.allJourney?.flights?.[0];
    const legs = flight?.flightDTO;
    if (!legs?.length) {
      return '';
    }

    const airport = end === 'departure'
      ? legs[0]?.departureTerminalAirport
      : legs[legs.length - 1]?.arrivalTerminalAirport;
    if (code && !this.codeMatches(airport || {}, code)) {
      return '';
    }
    return this.cityName(airport);
  }

  private cityName(airport: any): string {
    if (!airport) {
      return '';
    }
    const lang = this.translate.currentLang === 'ar' ? 'ar' : 'en';
    const translated = airport[lang]?.cityName;
    if (typeof translated === 'string' && translated) {
      return translated;
    }
    return typeof airport.cityName === 'string' ? airport.cityName : '';
  }

  private parseDate(raw: string): Date | null {
    const value = raw.trim();
    const numeric = value.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (numeric) {
      return new Date(Number(numeric[3]), Number(numeric[2]) - 1, Number(numeric[1]));
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}
