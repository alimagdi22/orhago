import { Component, HostListener, Inject, inject, OnInit, Renderer2 } from '@angular/core';
import { SharedService } from './shared/shared.service';
import { HttpClient } from '@angular/common/http';
import { AuthService, EnvironmentService, HomePageService, LOGIN_STATUS, UserProfileService } from 'rp-travel-ui';
import { EnvironmentService as HotelEnvironmentService } from 'rp-hotels-ui';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MostSearchedFlightsService } from './features/home/components/flight-deals/most-searched-flights.service';
import { EnvironmentService as hotelsEnvironment2 } from 'rp-hotels-ui';
import { SeoService } from './core/services/seo.service';

import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';

@Component({
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  sharedService = inject(SharedService);
  authService = inject(AuthService);
  userProfileService = inject(UserProfileService);
  translate = inject(TranslateService);
  renderer = inject(Renderer2);
  homeService = inject(HomePageService);
  mostSearchedFlightsService = inject(MostSearchedFlightsService);
  environment = inject(EnvironmentService);
  hotelEnvironmentService = inject(HotelEnvironmentService);
  toastr = inject(ToastrService);
  public hotelsEnvironment = inject(hotelsEnvironment2);
  seoService = inject(SeoService);

  http = inject(HttpClient);
  constructor(@Inject(DOCUMENT) private document: Document) {}

  showSuccess(message: string) {
    this.toastr.success(message);
  }

  showError(message: string) {
    this.toastr.error(message);
  }

  ngOnInit(): void {
    this.seoService.initRouteSeoListener();

    if (typeof window !== 'undefined') {
      this.sharedService.screenWidth = window.innerWidth;
    }

    this.toastr.toastrConfig = {
      ...this.toastr.toastrConfig,
      positionClass: 'toast-bottom-center',
      progressBar: true,
    };

    this.authService.notify.subscribe({
      next: (status) => {
        if (status === LOGIN_STATUS.success) {
          this.showSuccess(this.translate.currentLang === 'en' ? 'Welcome Back' : 'أهلاً بعودتك');
        }
      },
    });

    this.userProfileService.notify.subscribe({
      next: (status) => {
        if (status === 2) {
          this.showSuccess(this.translate.currentLang === 'en' ? 'Updated Successfully' : 'تم التحديث بنجاح');
        } else if (status === 1) {
          this.showError(this.translate.currentLang === 'en' ? 'Did Not Update Successfully' : 'لم يتم التحديث بنجاح');
        }
      },
    });

    let defaultCurrency = {
      ID: 4039,
      Currency_Code: 'AED',
      Currency_Name: 'United Arab Emirates Dirham',
      Is_Base_Currency: true,
      Image_Url: 'https://images.travelnow.global/Content/Currencies/AED.JPG',
      rate: 1,
    };
    // let defaultCurrency = {
    //   ID: 2026,
    //   Currency_Code: 'EGP',
    //   Currency_Name: 'Egyptian Pound',
    //   Is_Base_Currency: true,
    //   Image_Url: 'https://images.Travasky.com/Content/Currencies/EGP.JPG',
    //   rate: 1,
    // };

    const currentLang = typeof localStorage !== 'undefined' ? (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null) : null;

    if (currentLang) {
      this.translate.use(currentLang);

      this.document.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

      this.translate.onLangChange.subscribe(event => {
        if (typeof document !== 'undefined') {
          const html = document.querySelector('html');
          html?.setAttribute('lang', event.lang);
        }

        // Add or remove 'ar' class on body
        if (event.lang === 'ar') {
          this.renderer.addClass(this.document.body, 'ar');
        } else {
          this.renderer.removeClass(this.document.body, 'ar');
        }
      });
    } else {
      this.translate.use('en');
      if (typeof localStorage !== 'undefined') {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem('lang', 'en');
        }
      }
    }

    let envRP = {
      offlineSeats: 'http://154.41.209.93:7025',
      searchflow: 'http://154.41.209.93:6057',
      BookingFlow: 'http://154.41.209.93:6055',
      FareRules: 'http://154.41.209.93:6056',
      asm: 'http://154.41.209.93:6012',
      Apihotels: 'https://hotelsapi.round-pixel.net',
      users: 'http://154.41.209.93:6057',
      admin: 'http://154.41.209.93:6010/',
      getDPayment: 'http://154.41.209.93:6010/',
      bookHotels: 'https://staginghotels.round-pixel.net',
      prepay: 'http://154.41.209.93:6062',
      backOffice: 'http://154.41.209.93:6012',
      FlightTop: 'http://154.41.209.93:6057',
      offers: {
        getAll: 'http://154.41.209.93:7893/api/GetAllOffersAPI?POS=',
        getByID: 'http://154.41.209.93:7893/api/GetOfferByIdAPI?OfferId=',
        BookOffer: 'http://154.41.209.93:7895/api/BookOffer',
        RetriveItineraryDetails: '/api/Admin/RetriveItineraryDetails',
      },
    };

    let envTransarabian = {
      offlineSeats: "http://154.41.209.93:7025",
      brandedFairs: "https://flightprov.travelnow.global",
      searchflow: "https://flightsearch.travelnow.global",
      BookingFlow: "https://flightflow.travelnow.global",
      FareRules: "https://flightprov.travelnow.global",
      asm: "https://backofficeapi.travelnow.global",
      Apihotels: "https://hotels.travelnow.global",
      users: "https://flightsearch.travelnow.global",
      admin: "https://adminapi.travelnow.global/",
      getDPayment: "https://adminapi.travelnow.global/",
      bookHotels: "https://hotels.travelnow.global",
      hotelPrepay: "https://prepayapi.travelnow.global",
      backOffice: "https://backofficeapi.travelnow.global",
      FlightTop: "https://flightsearch.travelnow.global",
      prepay: 'https://prepayapi.flytoall.com',
      offers: {
        getAll: "http://154.41.209.93:7893/api/GetAllOffersAPI?POS=",
        getByID: "http://154.41.209.93:7893/api/GetOfferByIdAPI?OfferId=",
        BookOffer: "http://154.41.209.93:7895/api/BookOffer",
        RetriveItineraryDetails: "/api/Admin/RetriveItineraryDetails",
      },
    };

    let envFly = {
      offlineSeats: 'http://41.223.55.14:7025',
      searchflow: 'https://flightsearch.flytoall.com',
      BookingFlow: 'https://flightflow.flytoall.com',
      FareRules: 'https://flightprov.flytoall.com',
      asm: 'https://backofficeapi.flytoall.com',
      Apihotels: 'https://hotelsapi.flytoall.com',
      users: 'https://flightsearch.flytoall.com',
      // users: 'https://Usersapi.flytoall.com',
      admin: 'https://adminapi.flytoall.com',
      getDPayment: 'https://adminapi.flytoall.com',
      bookHotels: 'https://hotels.flytoall.com',
      prepay: 'https://prepayapi.flytoall.com',
      backOffice: 'https://backofficeapi.flytoall.com',
      FlightTop: 'https://flightsearch.flytoall.com',
      offers: {
        getAll: 'http://41.215.243.36:7893/api/GetAllOffersAPI?POS=',
        getByID: 'http://41.215.243.36:7893/api/GetOfferByIdAPI?OfferId=',
        BookOffer: 'http://41.215.243.36:7895/api/BookOffer',
        RetriveItineraryDetails: '/api/Admin/RetriveItineraryDetails',
      },
    };

    this.environment.envConfiguration(envTransarabian);
    this.hotelEnvironmentService.envConfiguration(envRP);

    if (!this.sharedService.isSegmentPresent(['checkout'])) {
      this.homeService.setSelectedCurrency(defaultCurrency);
      this.homeService.getPointOfSale();
    }
    this.mostSearchedFlightsService.getMostSearchedFlights();

    let envGoVoy = {
      offlineSeats: 'http://23.88.1.190:7025',
      asm: 'https://backofficeapi.govoy.com',
      hotelprepay: 'https://prepayapi.govoy.com',
      getDPayment: 'https://adminapi.govoy.com/',
      bookHotels: 'https://hotels.govoy.com',

      backOffice: 'https://backofficeapi.govoy.com',
      Apihotels: 'https://hotels.govoy.com',
      prepay: 'https://prepayapi.govoy.com',
      FareRules: 'https://flightprov.govoy.com',
      searchflow: 'https://flightsearch.govoy.com',
      BookingFlow: 'https://flightflow.govoy.com',
      users: 'https://usersapi.govoy.com',
      admin: 'https://adminapi.govoy.com',
      FlightTop: 'https://flightsearch.govoy.com',
      offers: {
        getAll: 'http://23.88.1.190:7893/api/GetAllOffersAPI?POS=',
        getByID: 'http://23.88.1.190:7893/api/GetOfferByIdAPI?OfferId=',
        BookOffer: 'http://23.88.1.190:7895/api/BookOffer',
        RetriveItineraryDetails: '/api/Admin/RetriveItineraryDetails',
      },
    };

    let envBahman = {
      offlineSeats: 'http://41.215.243.36:7025',
      searchflow: 'https://flightsearch.bahmantravel.com',
      BookingFlow: 'https://flightflow.bahmantravel.com',
      FareRules: 'https://flightprov.bahmantravel.com',
      asm: 'https://backofficeapi.bahmantravel.com',
      Apihotels: 'https://hotels.bahmantravel',
      users: 'https://flightsearch.bahmantravel.com',
      admin: 'https://adminapi.bahmantravel.com',
      getDPayment: 'https://adminapi.bahmantravel.com',
      bookHotels: 'https://hotels.bahmantravel.com',
      prepay: 'https://prepayapi.bahmantravel.com',
      backOffice: 'https://backofficeapi.bahmantravel.com',
      FlightTop: 'https://flightsearch.bahmantravel.com',
      offers: {
        getAll: 'http://41.215.243.36:7893/api/GetAllOffersAPI?POS=',
        getByID: 'http://41.215.243.36:7893/api/GetOfferByIdAPI?OfferId=',
        BookOffer: 'http://41.215.243.36:7895/api/BookOffer',
        RetriveItineraryDetails: '/api/Admin/RetriveItineraryDetails',
      },
    };

    let envTravasky = {
      offlineSeats: 'http://41.223.55.14:7025',
      searchflow: 'https://flightsearch.travasky.com',
      BookingFlow: 'https://flightflow.travasky.com',
      FareRules: 'https://flightprov.travasky.com',
      asm: 'https://backofficeapi.travasky.com',
      Apihotels: 'https://hotelsapi.travasky.com',
      users: 'https://flightsearch.rahaal.co',
      admin: 'https://adminapi.travasky.com/',
      getDPayment: 'https://adminapi.travasky.com/',
      bookHotels: 'https://hotels.travasky.com',
      prepay: 'https://prepayapi.travasky.com',
      backOffice: 'https://backofficeapi.travasky.com',
      FlightTop: 'https://flightsearch.travasky.com',
      offers: {
        getAll: 'http://41.215.243.36:7893/api/GetAllOffersAPI?POS=',
        getByID: 'http://41.215.243.36:7893/api/GetOfferByIdAPI?OfferId=',
        BookOffer: 'http://41.215.243.36:7895/api/BookOffer',
        RetriveItineraryDetails: '/api/Admin/RetriveItineraryDetails',
      },
    };

  }

  closeModal() {
    this.sharedService.isFlightDetailsShowed = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (typeof window !== 'undefined') {
      this.sharedService.screenWidth = window.innerWidth;
    }
  }
}
