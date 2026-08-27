import { NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor, tokenInterceptor } from './core/interceptors/token.interceptor';
import { AboutUsComponent } from './features/about-us/about-us.component';
import { ContactUsComponent } from './features/contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './features/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './features/terms-and-conditions/terms-and-conditions.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateServerLoader } from './core/services/translate-server.loader';
import { ToastrModule } from 'ngx-toastr';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './env/environment';
import localeAr from '@angular/common/locales/ar-EG';
import { registerLocaleData } from '@angular/common';
import { HotelsRoomsModule } from './features/hotels/hotels-rooms/hotels-rooms.module';

registerLocaleData(localeAr);

export function createTranslateLoader(http: HttpClient, platformId: object) {
  if (isPlatformBrowser(platformId)) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }
  return new TranslateServerLoader();
}

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    ContactUsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HotelsRoomsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, PLATFORM_ID],
      },
    }),
    ToastrModule.forRoot(),
  ],
  providers: [
    provideHttpClient(withInterceptors([tokenInterceptor])),
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
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptor,
    //   multi: true,
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
