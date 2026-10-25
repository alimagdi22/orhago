import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { IpLocationNames, resolveDepartingAirport } from '../constants/location-airports';
import { IAirPortTranslated } from '../models/airport.model';

@Injectable({
  providedIn: 'root',
})
export class UserLocationService {
  private platformId = inject(PLATFORM_ID);
  private started = false;
  private readonly departingAirportSubject = new ReplaySubject<IAirPortTranslated>(1);

  readonly departingAirport$: Observable<IAirPortTranslated> = this.departingAirportSubject.asObservable();

  start(): void {
    if (this.started || !isPlatformBrowser(this.platformId)) return;
    this.started = true;
    if (this.hasSavedDeparting()) return;

    this.loadLocation()
      .then((location) => {
        if (this.hasSavedDeparting()) return;
        this.departingAirportSubject.next(resolveDepartingAirport(location));
      })
      .catch(() => {
        if (this.hasSavedDeparting()) return;
        this.departingAirportSubject.next(resolveDepartingAirport(null));
      });
  }

  private hasSavedDeparting(): boolean {
    try {
      const departing = JSON.parse(localStorage.getItem('departing') ?? 'null');
      if (Array.isArray(departing) && departing[0]) return true;

      const form = JSON.parse(localStorage.getItem('form') ?? 'null');
      return !!form?.Flights?.[0]?.departing;
    } catch {
      return false;
    }
  }

  private async loadLocation(): Promise<IpLocationNames | null> {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) return null;

    const data = await response.json();
    if (!data || data.error) return null;

    return {
      city: typeof data.city === 'string' ? data.city : null,
      region: typeof data.region === 'string' ? data.region : null,
      country_capital: typeof data.country_capital === 'string' ? data.country_capital : null,
    };
  }
}
