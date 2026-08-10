import { Component, HostListener, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthService,
  currencyModel,
  FlightResultService,
  HomePageService,
  RESET_PASSWORD_STATUS,
  TripsService,
  UserProfileService,
} from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { IMainButton } from '../../models/flights/mainButton.model';
import { SharedService } from '../../shared.service';

@Component({
  standalone: false,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  sharedService = inject(SharedService);
  translate = inject(TranslateService);
  homePageService = inject(HomePageService);
  flightResultService = inject(FlightResultService);

  authService = inject(AuthService);
  userProfileService = inject(UserProfileService);
  tripsService = inject(TripsService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  isAuthenticated = false;

  signInButton: IMainButton = {
    height: '36px',
    width: 'none',
    borderRadius: '6px',
  };

  isMenuCollapsed = true;
  isScrolled = false;
  selectedLang = 'EN';

  subscription = new Subscription();

  ngOnInit(): void {
    if (this.isBrowser) {
      this.homePageService.getCurrency('KWD');
      this.homePageService.getPointOfSale();

      if (typeof localStorage !== 'undefined' && (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null)) {
        this.isAuthenticated = true;
        this.userProfileService.getUserProfile();
      }

      this.subscription.add(
        this.authService.notify.subscribe({
          next: (status) => {
            if (typeof localStorage !== 'undefined' && (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null)) {
              this.userProfileService.getUserProfile();
              this.isAuthenticated = true;
            } else {
              this.isAuthenticated = false;
            }
          },
        }),
      );
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      this.isScrolled = scrollPosition > 0;
    }
  }

  updateCurrency(currency: currencyModel) {
    this.homePageService.selectedCurrency = currency;
    let currency_ = currency.Currency_Code.replaceAll('"', ' ');
    if (this.isBrowser) {
      sessionStorage.setItem('curr', currency_);
    }
  }

  updateLang(lang: 'ar' | 'en') {
    if (this.isBrowser) {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('lang', lang);
      }
      location.reload();
    }
  }

  onClickSignIn() {
    this.sharedService.isLogInSheetShowed = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
