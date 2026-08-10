import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';

registerLocaleData(localeAr);

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

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
    provideClientHydration(withEventReplay()),
  ],
};
