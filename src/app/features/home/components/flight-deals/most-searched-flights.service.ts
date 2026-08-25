import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, of, retry, take, timeout } from 'rxjs';
import { MostSearchedFlightsResponse, SearchCriteria } from './interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MostSearchedFlightsService {
  public isLoading = false;
  public isError = false;
  public isEmpty = false;

  private _mostSearchedFlights: MostSearchedFlightsResponse[] = [];
  private http = inject(HttpClient);
  private router = inject(Router);

  getMostSearchedFlights() {
    this.isLoading = true;

    const mostSearchedFlights = typeof window !== 'undefined' && typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem('mostSearchedFlights')
      : null;

    if (mostSearchedFlights) {
      try {
        this._mostSearchedFlights = JSON.parse(mostSearchedFlights);
        if (this._mostSearchedFlights.length) {
          this.isLoading = false;
          this.isEmpty = false;
          return;
        }
      } catch {
        // Fallback to fresh HTTP call if cache parse fails
      }
    }

    this.http
      .get<MostSearchedFlightsResponse[]>('https://flightsearch.flytoall.com/api/GetCheapestFlights?resCount=5')
      .pipe(
        timeout(10000),
        retry(1),
        take(1),
        catchError(() => {
          return of([]);
        }),
      )
      .subscribe({
        next: (res) => {
          if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined' && res && res.length) {
            sessionStorage.setItem('mostSearchedFlights', JSON.stringify(res));
          }

          this._mostSearchedFlights = res || [];
          this.isEmpty = !this._mostSearchedFlights.length;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.isError = true;
        },
      });
  }

  goToSearchResults(searchCriteria: SearchCriteria) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem('form');
      }
    }
    let flights: string[] = [];

    searchCriteria.flights.forEach(e => {
      const departingOnDate = new Date(e.departingOnDate);

      const formattedDate = departingOnDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      flights.push(e.departingFrom + '-' + e.arrivingTo + '-' + formattedDate);
    })
    
    this.router.navigate([
      'flight-results',
      searchCriteria.language,
      searchCriteria.currency,
      searchCriteria.pos,
      searchCriteria.flightType,
      flights.join('_'),
      searchCriteria.searchId,
      'A-' + searchCriteria.adultNum + '-C-' + searchCriteria.childNum + '-I-' + searchCriteria.infantNum,
      searchCriteria.selectedFlightClass,
      searchCriteria.selectDirectFlightsOnly
    ])
  }

  get mostSearchedFlights() {
    return this._mostSearchedFlights;
  }
}
