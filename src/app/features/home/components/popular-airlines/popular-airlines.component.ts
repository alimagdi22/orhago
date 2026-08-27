import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-popular-airlines',
  templateUrl: './popular-airlines.component.html',
  styleUrl: './popular-airlines.component.scss',
  host: {
    'ngSkipHydration': 'true',
  },
})
export class PopularAirlinesComponent implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);
  translate = inject(TranslateService);

  popularAirlines: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.fetchAirlines();
  }

  getAirlineName(airline: any): string {
    if (airline?.allAirlineInfoDtos && airline.allAirlineInfoDtos.length > 0) {
      const langIdx = this.translate.currentLang === 'ar' ? 1 : 0;
      return (
        airline.allAirlineInfoDtos[langIdx]?.airlineName ||
        airline.allAirlineInfoDtos[0]?.airlineName ||
        airline.slug
      );
    }
    return airline?.slug || 'Airline';
  }

  fetchAirlines(): void {
    this.isLoading = true;
    this.http.get<any>('https://cms.travasky.com/api/GetAllAirLines').subscribe({
      next: (res) => {
        if (res && res.returnObject) {
          this.popularAirlines = res.returnObject.map((item: any) => ({
            ...item,
            airlineLogo: item.airlineLogo ? item.airlineLogo.replace(/\\/g, '/') : item.airlineLogo,
          }));
        }
        this.isLoading = false;
      },
      error: () => {
        this.http.get<any>('http://154.41.209.93:3016/api/GetAllAirLines').subscribe({
          next: (res) => {
            if (res && res.returnObject) {
              this.popularAirlines = res.returnObject.map((item: any) => ({
                ...item,
                airlineLogo: item.airlineLogo ? item.airlineLogo.replace(/\\/g, '/') : item.airlineLogo,
              }));
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error fetching airlines:', err);
            this.isLoading = false;
          },
        });
      },
    });
  }

  navigateToAirline(slug: string): void {
    if (slug) {
      this.router.navigate([`/airline/${slug}`]);
    }
  }
}
