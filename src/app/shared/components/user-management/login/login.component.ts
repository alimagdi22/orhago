import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, FORGET_PASSWORD_STATUS, GoogleAuthResponse, LOGIN_STATUS, AuthApiService, UserProfileService } from 'rp-travel-ui';
import { from, Subscription, switchMap } from 'rxjs';
import { SharedService } from '../../../shared.service';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAuthService } from '../../../services/auth.service';
import { Auth } from '@angular/fire/auth';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  translate = inject(TranslateService);
  sharedService = inject(SharedService);
  authService = inject(AuthService);
  userProfileService = inject(UserProfileService);
  public googleAuthService = inject(GoogleAuthService);
  private auth = inject(Auth);
  router = inject(Router);
  AuthApiService = inject(AuthApiService);

  subscription = new Subscription();
  error: boolean = false;
  isGoogleLoading: boolean = false;
  isLoggingIn: boolean = false;

  ngOnInit(): void {
    this.authService.initLoginForm();

    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (status === LOGIN_STATUS.success || status === 'login' || status === 'google-login') {
            this.isLoggingIn = true;
            this.userProfileService.getUserProfile();
          } else if (status === LOGIN_STATUS.faild) {
            this.error = true;
            this.isLoggingIn = false;
            this.isGoogleLoading = false;
          }
        },
      }),
    );

    this.subscription.add(
      this.userProfileService.notify.subscribe({
        next: () => {
          if (this.isLoggingIn || this.isGoogleLoading || this.authService.isLoading) {
            this.isLoggingIn = false;
            this.isGoogleLoading = false;
            this.authService.isLoading = false;
            this.sharedService.isLogInSheetShowed = false;
          }
        },
        error: () => {
          this.isLoggingIn = false;
          this.isGoogleLoading = false;
          this.authService.isLoading = false;
        },
      }),
    );
  }

  onSubmit() {
    this.error = false;
    if (this.authService.loginForm.invalid) {
      this.error = true;
    } else {
      this.isLoggingIn = true;
      this.authService.loginSubmit();
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  googleLoginSubmit() {
    this.error = false;
    this.isGoogleLoading = true;

    from(this.googleAuthService.loginWithGoogle())
      .pipe(
        switchMap((idToken: any) => {
          if (!idToken) {
            throw new Error('Google authentication cancelled or failed');
          }
          const userData = this.decodeToken(idToken);
          const body: GoogleAuthResponse = {
            iss: userData.iss,
            azp: userData.azp,
            aud: userData.aud,
            sub: userData.sub ? userData.name.replace(/\s+/g, '') : '',
            hd: userData.hd,
            email: userData.email,
            email_verified: userData.email_verified,
            nbf: userData.nbf,
            name: userData.name ? userData.name.replace(/\s+/g, '') : '',
            picture: userData.picture,
            given_name: userData.given_name,
            family_name: userData.family_name,
            iat: userData.iat,
            exp: userData.exp,
            jti: userData.jti,
          };

          this.googleAuthService.bindUserData(userData);
          return this.AuthApiService.googleLogin(body);
        })
      )
      .subscribe({
        next: (res) => {
          if (res.status === 0) {
            if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
              localStorage.setItem('token', JSON.stringify(res.returnObject.token));
            }
            this.authService.notify.next('google-login');
            this.googleAuthService.notify.next('login');
            this.userProfileService.getUserProfile();
          } else {
            console.error('Google Login Failed:', res);
            this.error = true;
            this.isGoogleLoading = false;
          }
        },
        error: (error) => {
          console.error('Google Login Submit Error:', error);
          this.error = true;
          this.isGoogleLoading = false;
        },
      });
  }

  handleGoogleSignIn(response: any) {
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    const userData = JSON.parse(jsonPayload);
    this.googleAuthService.bindUserData(userData);
    this.authService.googleLoginSubmit(userData);
  }

  goToSignUp(e: Event) {
    e.stopPropagation();

    this.sharedService.isRegisterSheetShowed = true;
    this.sharedService.isLogInSheetShowed = false;
  }

  goToRestPassword(e: Event) {
    e.stopPropagation();

    this.sharedService.isResetPasswordSheetShowed = true;
    this.sharedService.isLogInSheetShowed = false;
  }

  get isLoading() {
    return this.authService.isLoading || this.isLoggingIn || this.isGoogleLoading;
  }

  get loginForm() {
    return this.authService.loginForm;
  }

  get lang() {
    return this.translate.currentLang === 'en' ? 'en' : 'ar';
  }

  get getEmailErrorMessage() {
    return this.authService.getEmailErrorMessage;
  }

  get getPasswordErrorMessage() {
    return this.authService.getPasswordErrorMessage;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.isLoggingIn = false;
    this.isGoogleLoading = false;
  }
}
