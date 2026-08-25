import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SEO_METADATA } from '../constants/seo-metadata.config';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private router = inject(Router);

  private defaultSeo: SeoConfig = {
    title: 'orhas - Search & Book Flights and Hotels Worldwide',
    description: 'Search, compare, and book cheap flights and hotels to your favorite destinations worldwide with orhas.',
    keywords: 'flights, hotels, cheap flights, flight booking, travel, airline tickets, hotel booking, orhas',
    ogTitle: 'orhas - Search & Book Flights and Hotels Worldwide',
    ogDescription: 'Search, compare, and book cheap flights and hotels to your favorite destinations worldwide with orhas.',
    ogImage: 'images/og-home.jpg',
    twitterCard: 'summary_large_image',
    robots: 'index, follow',
  };

  public initRouteSeoListener(): void {
    this.updateSeoForCurrentRoute();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateSeoForCurrentRoute();
      });
  }

  private updateSeoForCurrentRoute(): void {
    const url = this.router.url ? this.router.url.split('?')[0].split('#')[0] : '/';

    let urlSeo: SeoConfig = {};
    if (url === '/' || url === '') {
      urlSeo = SEO_METADATA['home'] || {};
    } else if (url.includes('/about-us')) {
      urlSeo = SEO_METADATA['aboutUs'] || {};
    } else if (url.includes('/contact-us')) {
      urlSeo = SEO_METADATA['contactUs'] || {};
    } else if (url.includes('/terms-and-conditions')) {
      urlSeo = SEO_METADATA['terms'] || {};
    } else if (url.includes('/privacy-policy')) {
      urlSeo = SEO_METADATA['privacyPolicy'] || {};
    } else if (url.includes('/flight-results')) {
      urlSeo = SEO_METADATA['flightResults'] || {};
    } else if (url.includes('/flight-checkout')) {
      urlSeo = SEO_METADATA['flightCheckout'] || {};
    } else if (url.includes('/user-management')) {
      urlSeo = SEO_METADATA['userManagement'] || {};
    } else if (url.includes('/paymentresult/hotel')) {
      urlSeo = SEO_METADATA['hotelsConfirmation'] || {};
    } else if (url.includes('/paymentresult')) {
      urlSeo = SEO_METADATA['paymentResult'] || {};
    } else if (url.includes('/hotels-results')) {
      urlSeo = SEO_METADATA['hotelsResults'] || {};
    } else if (url.includes('/hotels-rooms')) {
      urlSeo = SEO_METADATA['hotelsRooms'] || {};
    } else if (url.includes('/hotels-checkout')) {
      urlSeo = SEO_METADATA['hotelsCheckout'] || {};
    }

    let route: ActivatedRouteSnapshot | null = this.router.routerState?.snapshot?.root || null;
    let routeSeo: SeoConfig = {};
    while (route) {
      if (route.data && route.data['seo']) {
        routeSeo = { ...routeSeo, ...route.data['seo'] };
      }
      route = route.firstChild;
    }

    const mergedSeo: SeoConfig = { ...this.defaultSeo, ...urlSeo, ...routeSeo };
    this.updateSeo(mergedSeo);
  }

  public updateAirlineSeo(routeSlug: string, lang: string = 'en'): void {
    const airlineMetaMap: Record<
      string,
      Record<
        string,
        {
          title: string;
          description: string;
          keywords: string;
        }
      >
    > = {
      'air-cairo-SM': {
        en: {
          title: 'Book the Cheapest Air Cairo Flights | orhas',
          description: 'Book the cheapest Air Cairo flights with orhas. Get the best deals, lowest prices, and 24/7 customer support.',
          keywords: 'Air Cairo flights, book Air Cairo, cheap Air Cairo tickets, Air Cairo deals, Air Cairo booking',
        },
        ar: {
          title: 'حجز أرخص رحلات طيران القاهرة | أورهاس',
          description: 'احجز أرخص تذاكر طيران على متن طيران القاهرة عبر أورهاس. استمتع بأفضل العروض وخدمة عملاء متميزة.',
          keywords: 'حجز طيران القاهرة, تذاكر طيران القاهرة, رحلات طيران القاهرة, عروض طيران القاهرة, أورهاس طيران القاهرة',
        },
      },
      'almasria-universal-airlines-UJ': {
        en: {
          title: 'Book The cheapest almasria universal airlines flights | orhas',
          description: 'Book the cheapest almasria universal airlines flights tickets through orhas, and get a unique booking. ✓ Find the lowest price ✓ 24/7 Customer Support.',
          keywords: 'almasria, universal, airlines',
        },
        ar: {
          title: 'حجز رحلات المصرية العالمية للطيران بأرخص الأسعار | أورهاس',
          description: 'احجز أرخص تذاكر طيران على متن المصرية العالمية للطيران من خلال أورهاس وتمتع بأفضل العروض.',
          keywords: 'حجز طيران, المصرية العالمية للطيران, عروض طيران, أورهاس',
        },
      },
      'egyptair-MS': {
        en: {
          title: 'Book the Cheapest EgyptAir Flights | orhas',
          description: 'Get the lowest fares for EgyptAir flights through orhas. Enjoy a hassle-free booking experience with the best flight deals.',
          keywords: 'EgyptAir flights, book EgyptAir, EgyptAir tickets, EgyptAir best deals, orhas EgyptAir offers',
        },
        ar: {
          title: 'حجز أرخص رحلات مصر للطيران | أورهاس',
          description: 'احجز أرخص تذاكر مصر للطيران عبر أورهاس. استفد من أفضل الأسعار والخدمات المتميزة.',
          keywords: 'حجز مصر للطيران, تذاكر مصر للطيران, رحلات مصر للطيران, عروض مصر للطيران, أورهاس مصر للطيران',
        },
      },
      'flyegypt-FT': {
        en: {
          title: 'Book the Cheapest FlyEgypt Flights | orhas',
          description: 'Find the best deals on FlyEgypt flights with orhas. Secure your booking with the lowest fares available.',
          keywords: 'FlyEgypt flights, book FlyEgypt, FlyEgypt tickets, FlyEgypt deals, orhas FlyEgypt booking',
        },
        ar: {
          title: 'حجز أرخص رحلات فلاي ايجيبت | أورهاس',
          description: 'احجز أرخص تذاكر فلاي ايجيبت عبر أورهاس. استمتع بأفضل الأسعار والخدمات المتميزة.',
          keywords: 'حجز فلاي ايجيبت, تذاكر فلاي ايجيبت, رحلات فلاي ايجيبت, عروض فلاي ايجيبت, أورهاس فلاي ايجيبت',
        },
      },
      'nile-air-NP': {
        en: {
          title: 'Book the Cheapest Nile Air Flights | orhas',
          description: 'Get the lowest prices on Nile Air flights through orhas. Book your next journey with confidence.',
          keywords: 'Nile Air flights, book Nile Air, Nile Air tickets, Nile Air deals, orhas Nile Air booking',
        },
        ar: {
          title: 'حجز أرخص رحلات طيران النيل | أورهاس',
          description: 'احجز أرخص تذاكر طيران النيل عبر أورهاس. استمتع بأفضل الأسعار والخدمات الممتازة.',
          keywords: 'حجز طيران النيل, تذاكر طيران النيل, رحلات طيران النيل, عروض طيران النيل, أورهاس طيران النيل',
        },
      },
      'wizz-air-W6': {
        en: {
          title: 'Book the Cheapest Wizz Air Flights | orhas',
          description: 'Find the best prices on Wizz Air flights at orhas. Book now and enjoy a smooth journey at the lowest fares.',
          keywords: 'Wizz Air flights, book Wizz Air, Wizz Air tickets, Wizz Air deals, orhas Wizz Air booking',
        },
        ar: {
          title: 'حجز أرخص رحلات ويز اير | أورهاس',
          description: 'احجز أرخص تذاكر ويز اير عبر أورهاس. استفد من أفضل العروض والرحلات بأسعار مخفضة.',
          keywords: 'حجز ويز اير, تذاكر ويز اير, رحلات ويز اير, عروض ويز اير, أورهاس ويز اير',
        },
      },
      'flynas-XY': {
        en: {
          title: 'Book the Cheapest Flynas Flights | orhas',
          description: 'Book the cheapest Flynas flights tickets through orhas, and get a unique booking. ✓ Find the lowest price ✓ 24/7 Customer Support.',
          keywords: 'Flynas flights, book Flynas, Flynas tickets, Flynas deals, orhas Flynas booking',
        },
        ar: {
          title: 'حجز أرخص رحلات طيران ناس | أورهاس',
          description: 'احجز أرخص تذاكر طيران ناس من خلال أورهاس وتمتع بأفضل العروض.',
          keywords: 'حجز طيران ناس, تذاكر طيران ناس, رحلات طيران ناس, عروض طيران ناس, أورهاس طيران ناس',
        },
      },
      'saudia-airlines-SV': {
        en: {
          title: 'Book the Cheapest Saudia Airlines Flights | orhas',
          description: 'Book the cheapest Saudia Airlines flights tickets through orhas, and get a unique booking. ✓ Find the lowest price ✓ 24/7 Customer Support.',
          keywords: 'Saudia Airlines flights, book Saudia Airlines, Saudia Airlines tickets, Saudia Airlines deals, orhas Saudia Airlines booking',
        },
        ar: {
          title: 'حجز أرخص رحلات الخطوط السعودية | أورهاس',
          description: 'احجز أرخص تذاكر الخطوط السعودية من خلال أورهاس وتمتع بأفضل العروض.',
          keywords: 'حجز الخطوط السعودية, تذاكر الخطوط السعودية, رحلات الخطوط السعودية, عروض الخطوط السعودية, أورهاس الخطوط السعودية',
        },
      },
      'air-arabia-G9': {
        en: {
          title: 'Book the Cheapest Air Arabia Flights | orhas',
          description: 'Book the cheapest Air Arabia flights tickets through orhas, and get a unique booking. ✓ Find the lowest price ✓ 24/7 Customer Support.',
          keywords: 'Air Arabia flights, book Air Arabia, Air Arabia tickets, Air Arabia deals, orhas Air Arabia booking',
        },
        ar: {
          title: 'حجز أرخص رحلات طيران العربية | أورهاس',
          description: 'احجز أرخص تذاكر طيران العربية من خلال أورهاس وتمتع بأفضل العروض.',
          keywords: 'حجز طيران العربية, تذاكر طيران العربية, رحلات طيران العربية, عروض طيران العربية, أورهاس طيران العربية',
        },
      },
      'emirates-EK': {
        en: {
          title: 'Book the Cheapest Emirates Flights | orhas',
          description: 'Book the cheapest Emirates flights tickets through orhas, and get a unique booking. ✓ Find the lowest price ✓ 24/7 Customer Support.',
          keywords: 'Emirates flights, book Emirates, Emirates tickets, Emirates deals, orhas Emirates booking',
        },
        ar: {
          title: 'حجز أرخص رحلات طيران الإمارات | أورهاس',
          description: 'احجز أرخص تذاكر طيران الإمارات من خلال أورهاس وتمتع بأفضل العروض.',
          keywords: 'حجز طيران الإمارات, تذاكر طيران الإمارات, رحلات طيران الإمارات, عروض طيران الإمارات, أورهاس طيران الإمارات',
        },
      },
    };

    const targetMeta = airlineMetaMap[routeSlug]?.[lang] || airlineMetaMap[routeSlug]?.['en'];
    if (targetMeta) {
      this.updateSeo({
        title: targetMeta.title,
        description: targetMeta.description,
        keywords: targetMeta.keywords,
      });
    }
  }

  public updateSeo(config: SeoConfig = {}): void {
    const seoData: SeoConfig = { ...this.defaultSeo, ...config };

    if (seoData.title) {
      this.titleService.setTitle(seoData.title);
      this.setMetaTag('property', 'og:title', seoData.ogTitle || seoData.title);
      this.setMetaTag('name', 'twitter:title', seoData.twitterTitle || seoData.ogTitle || seoData.title);
    }

    if (seoData.description) {
      this.setMetaTag('name', 'description', seoData.description);
      this.setMetaTag('property', 'og:description', seoData.ogDescription || seoData.description);
      this.setMetaTag('name', 'twitter:description', seoData.twitterDescription || seoData.ogDescription || seoData.description);
    }

    if (seoData.keywords) {
      this.setMetaTag('name', 'keywords', seoData.keywords);
    }

    if (seoData.robots) {
      this.setMetaTag('name', 'robots', seoData.robots);
    }

    if (seoData.ogImage) {
      this.setMetaTag('property', 'og:image', seoData.ogImage);
      this.setMetaTag('name', 'twitter:image', seoData.twitterImage || seoData.ogImage);
    }

    if (seoData.ogUrl) {
      this.setMetaTag('property', 'og:url', seoData.ogUrl);
    }
    if (seoData.twitterCard) {
      this.setMetaTag('name', 'twitter:card', seoData.twitterCard);
    }
  }

  private setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string): void {
    if (content) {
      const selector = `${attrName}="${attrValue}"`;
      this.metaService.updateTag({ [attrName]: attrValue, content }, selector);
    }
  }
}
