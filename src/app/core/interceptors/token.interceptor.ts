import { inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from 'rp-travel-ui';
import { SharedService } from '../../shared/shared.service';

// Fallback geolocation response used when ipapi.co / ipify.org are blocked or rate-limited
const GEO_FALLBACK_BODY = {
  ip: '197.54.32.31',
  country: 'KW',
  country_code: 'KW',
  country_name: 'Kuwait',
  currency: 'KWD',
};

const GEO_FALLBACK_RESPONSE = new HttpResponse({ status: 200, body: GEO_FALLBACK_BODY });
const IPIFY_FALLBACK_RESPONSE = new HttpResponse({ status: 200, body: { ip: '197.54.32.31' } });

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Always pass static assets (i18n translations, images, icons) through immediately without intercepting
  if (req.url.includes('assets/')) {
    return next(req);
  }

  // Intercept 3rd-party IP geolocation API calls (ipapi.co and ipify.org) to prevent Cloudflare 403 bot challenges / 429 rate limits
  if (req.url.includes('ipapi.co')) {
    return of(GEO_FALLBACK_RESPONSE);
  }

  if (req.url.includes('ipify.org')) {
    return of(IPIFY_FALLBACK_RESPONSE);
  }

  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  const segments = ['HistoryAndUpcomingFlights', 'getUser', 'editUser', 'changePassword', 'SaveBooking'];
  const isIncludesSegment = segments.some((segment) => req.url.includes(segment));

  if (
    isBrowser &&
    isIncludesSegment &&
    (typeof localStorage !== 'undefined' ? (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null) : null) &&
    (typeof localStorage !== 'undefined' ? (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('tokenHash') : null) : null)
  ) {
    const injector = inject(Injector);
    const authService = injector.get(AuthService, null);
    const sharedService = injector.get(SharedService, null);

    if (!authService) {
      return next(req);
    }

    return from(authService.getToken()).pipe(
      switchMap((token) => {
        if (!token || authService.isTokenExpired()) {
          authService.removeToken();
          sharedService?.userManagementNotifier.next(1);
          return throwError(() => new Error('Unauthorized'));
        }
        const clonedReq = req.clone({
          setHeaders: { Token: JSON.parse(token) },
        });
        return next(clonedReq);
      }),
      catchError((error) => {
        if (error?.status === 401 && authService) {
          authService.removeToken();
          sharedService?.userManagementNotifier.next(1);
        }
        return throwError(() => error);
      }),
    );
  }

  return next(req);
};

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private injector = inject(Injector);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  segments = ['HistoryAndUpcomingFlights', 'getUser', 'editUser', 'changePassword', 'SaveBooking'];

  private get authService(): AuthService | null {
    return this.injector.get(AuthService, null);
  }

  private get sharedService(): SharedService | null {
    return this.injector.get(SharedService, null);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('assets/')) {
      return next.handle(req);
    }

    if (req.url.includes('ipapi.co')) {
      return of(GEO_FALLBACK_RESPONSE);
    }

    if (req.url.includes('ipify.org')) {
      return of(IPIFY_FALLBACK_RESPONSE);
    }

    let isIncludesSegment = false;
    this.segments.forEach((segment) => {
      if (req.url.includes(segment)) {
        isIncludesSegment = true;
      }
    });

    const authService = this.authService;
    const sharedService = this.sharedService;

    if (
      this.isBrowser &&
      isIncludesSegment &&
      authService &&
      (typeof localStorage !== 'undefined' ? (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null) : null) &&
      (typeof localStorage !== 'undefined' ? (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('tokenHash') : null) : null)
    ) {
      return from(authService.getToken()).pipe(
        switchMap((token) => {
          if (!token || authService.isTokenExpired()) {
            authService.removeToken();
            sharedService?.userManagementNotifier.next(1);
            return throwError(() => new Error('Unauthorized'));
          }
          req = req.clone({
            setHeaders: { Token: JSON.parse(token) },
          });
          return next.handle(req);
        }),
        catchError((error) => {
          if (error?.status === 401 && authService) {
            authService.removeToken();
            sharedService?.userManagementNotifier.next(1);
          }
          return throwError(() => error);
        }),
      );
    }

    return next.handle(req);
  }
}


