import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './env/environment';
import localeAr from '@angular/common/locales/ar-EG';
import { registerLocaleData, DatePipe } from '@angular/common';

import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { provideClientHydration, withEventReplay, withNoHttpTransferCache } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { catchError, Observable, of } from 'rxjs';

registerLocaleData(localeAr);

class AppTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<Record<string, unknown>> {
    const code = String(lang || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
    return this.http.get<Record<string, unknown>>(`/assets/i18n/${code}.json`).pipe(
      catchError(() => of({})),
    );
  }
}

const httpLoaderFactory = (http: HttpClient) => new AppTranslateLoader(http);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([tokenInterceptor]), withFetch()),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    provideRouter(routes),
    importProvidersFrom([
      ToastrModule.forRoot(),
    ]),
    provideFirebaseApp(() => {
      if (typeof window !== 'undefined') {
        try {
          return initializeApp(environment.firebaseConfig);
        } catch {
          return null as any;
        }
      }
      return null as any;
    }),
    provideAuth(() => {
      if (typeof window !== 'undefined') {
        try {
          return getAuth();
        } catch {
          return null as any;
        }
      }
      return null as any;
    }),
    DatePipe,
    provideClientHydration(withEventReplay(), withNoHttpTransferCache()),
  ],
};

