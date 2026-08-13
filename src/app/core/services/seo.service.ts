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
    title: 'orhago - Search & Book Flights and Hotels Worldwide',
    description: 'Search, compare, and book cheap flights and hotels to your favorite destinations worldwide with orhago.',
    keywords: 'flights, hotels, cheap flights, flight booking, travel, airline tickets, hotel booking, orhago',
    ogTitle: 'orhago - Search & Book Flights and Hotels Worldwide',
    ogDescription: 'Search, compare, and book cheap flights and hotels to your favorite destinations worldwide with orhago.',
    ogImage: 'images/og-home.jpg',
    twitterCard: 'summary_large_image',
    robots: 'index, follow',
  };

  /**
   * Initializes route listener and updates SEO on router navigation events
   * and immediately for the current route.
   */
  public initRouteSeoListener(): void {
    // Update immediately for current active snapshot
    this.updateSeoForCurrentRoute();

    // Subscribe to router NavigationEnd events
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateSeoForCurrentRoute();
      });
  }

  private updateSeoForCurrentRoute(): void {
    const url = this.router.url ? this.router.url.split('?')[0].split('#')[0] : '/';

    // 1. Determine URL match metadata
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

    // 2. Traverse current RouterStateSnapshot tree to find route snapshot metadata
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

  /**
   * Updates page title and meta tags manually or automatically.
   */
  public updateSeo(config: SeoConfig = {}): void {
    const seoData: SeoConfig = { ...this.defaultSeo, ...config };

    // 1. Update Title
    if (seoData.title) {
      this.titleService.setTitle(seoData.title);
      this.setMetaTag('property', 'og:title', seoData.ogTitle || seoData.title);
      this.setMetaTag('name', 'twitter:title', seoData.twitterTitle || seoData.ogTitle || seoData.title);
    }

    // 2. Update Description
    if (seoData.description) {
      this.setMetaTag('name', 'description', seoData.description);
      this.setMetaTag('property', 'og:description', seoData.ogDescription || seoData.description);
      this.setMetaTag('name', 'twitter:description', seoData.twitterDescription || seoData.ogDescription || seoData.description);
    }

    // 3. Update Keywords
    if (seoData.keywords) {
      this.setMetaTag('name', 'keywords', seoData.keywords);
    }

    // 4. Update Robots
    if (seoData.robots) {
      this.setMetaTag('name', 'robots', seoData.robots);
    }

    // 5. Update OpenGraph Image & Twitter Image
    if (seoData.ogImage) {
      this.setMetaTag('property', 'og:image', seoData.ogImage);
      this.setMetaTag('name', 'twitter:image', seoData.twitterImage || seoData.ogImage);
    }

    // 6. Update OpenGraph URL & Twitter Card
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
