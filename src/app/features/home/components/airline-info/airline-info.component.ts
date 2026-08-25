import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  standalone: false,
  selector: 'app-airline-info',
  templateUrl: './airline-info.component.html',
  styleUrl: './airline-info.component.scss',
  host: {
    'ngSkipHydration': 'true',
  },
})
export class AirlineInfoComponent implements OnInit, OnDestroy {
  http = inject(HttpClient);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  translate = inject(TranslateService);
  titleService = inject(Title);
  metaService = inject(Meta);
  seoService = inject(SeoService);

  subscription = new Subscription();
  isLoading = true;
  airlineInfo: any = null;
  allAirlines: any[] = [];
  isExpanded = false;

  get airlineLogo(): string {
    if (!this.airlineInfo) return '';
    const logo = this.airlineInfo.airlineLogoWithName || this.airlineInfo.airlineLogo || '';
    return logo ? logo.replace(/\\/g, '/') : '';
  }

  get langIndex(): number {
    return this.translate.currentLang === 'ar' ? 1 : 0;
  }

  get airlineInfoDto() {
    return this.airlineInfo?.airlineInfoDtos || [];
  }

  get iataCode() {
    return this.airlineInfo?.iatacode;
  }

  get icaoCode() {
    return this.airlineInfo?.icaocode;
  }

  get numberOfDestinations() {
    return this.airlineInfo?.numberOfDestinations;
  }

  get yearOfEstablishment() {
    return this.airlineInfo?.yearOfEstablishment;
  }

  get mostPopularDestinations(): string {
    const dtos = this.airlineInfo?.mostPopularDestinationDtos || [];
    const mostPopularDestinationsArray = dtos.filter(
      (item: any) => item.language === this.translate.currentLang?.toUpperCase()
    );

    let result = '';
    mostPopularDestinationsArray.forEach((e: any, index: number) => {
      result += `${e.destinationCity} (${e.destinationAirportCode})`;
      if (index !== mostPopularDestinationsArray.length - 1) {
        result += ', ';
      }
    });
    return result;
  }

  get currentAirlineInfoDetail() {
    const dtos = this.airlineInfo?.airlineInfoDtos || [];
    return dtos.find(
      (item: any) => item.language === this.translate.currentLang?.toUpperCase()
    ) || dtos[0];
  }

  get sections() {
    return (this.airlineInfo?.contentSectionDtos || []).filter(
      (section: any) => section.language === this.translate.currentLang?.toUpperCase()
    );
  }

  get faqs() {
    return (this.airlineInfo?.faqDtos || []).filter(
      (q: any) => q.language === this.translate.currentLang?.toUpperCase()
    );
  }

  ngOnInit(): void {
    this.fetchAllAirlines();

    this.subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        const slug = params['slug'];
        if (slug) {
          this.seoService.updateAirlineSeo(slug, this.translate.currentLang || 'en');
          const slugParts = slug.split('-');
          const iataCode = slugParts[slugParts.length - 1];
          this.fetchAirlineInfo(iataCode);
        }
      })
    );

    this.subscription.add(
      this.translate.onLangChange.subscribe((event) => {
        const slug = this.activatedRoute.snapshot.params['slug'];
        if (slug) {
          this.seoService.updateAirlineSeo(slug, event.lang || 'en');
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fetchAllAirlines(): void {
    this.http.get<any>('https://cms.travasky.com/api/GetAllAirLines').subscribe({
      next: (res) => {
        if (res && res.returnObject) {
          this.allAirlines = res.returnObject.map((item: any) => ({
            ...item,
            airlineLogo: item.airlineLogo ? item.airlineLogo.replace(/\\/g, '/') : item.airlineLogo,
          }));
        }
      },
      error: () => {
        this.http.get<any>('http://154.41.209.93:3016/api/GetAllAirLines').subscribe({
          next: (res) => {
            if (res && res.returnObject) {
              this.allAirlines = res.returnObject.map((item: any) => ({
                ...item,
                airlineLogo: item.airlineLogo ? item.airlineLogo.replace(/\\/g, '/') : item.airlineLogo,
              }));
            }
          },
          error: (err) => console.error('Error fetching all airlines:', err),
        });
      },
    });
  }

  fetchAirlineInfo(iataCode: string): void {
    this.isLoading = true;
    this.http.get<any>(`https://cms.travasky.com/api/GetAirLineInfo?code=${iataCode}`).subscribe({
      next: (res) => {
        if (res && res.returnObject) {
          this.airlineInfo = res.returnObject;
          this.updateMetaTags();
        }
        this.isLoading = false;
      },
      error: () => {
        this.http.get<any>(`http://154.41.209.93:3016/api/GetAirLineInfo?code=${iataCode}`).subscribe({
          next: (res) => {
            if (res && res.returnObject) {
              this.airlineInfo = res.returnObject;
              this.updateMetaTags();
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error fetching airline info:', err);
            this.isLoading = false;
          },
        });
      },
    });
  }

  updateMetaTags(): void {
    const details = this.airlineInfo?.airlineContentDto?.airlineContentDetailDto;
    if (details && details.length > 0) {
      const detail = (this.translate.currentLang === 'en' ? details[0] : details[1]) || details[0];
      if (detail?.metaTitle || detail?.metaDesc || detail?.metaKeyword) {
        this.seoService.updateSeo({
          title: detail.metaTitle,
          description: detail.metaDesc,
          keywords: detail.metaKeyword,
        });
      }
    }
  }

  toggleShowMore(): void {
    this.isExpanded = !this.isExpanded;
  }

  navigateToAirline(slug: string): void {
    if (slug) {
      this.router.navigate([`/airlines/${slug}`]);
    }
  }
}
