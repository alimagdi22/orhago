import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, RESET_PASSWORD_STATUS, UserProfileService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../shared.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  translate = inject(TranslateService);
  sharedService = inject(SharedService);

  authService = inject(AuthService);
  userProfileService = inject(UserProfileService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  subscription = new Subscription();

  isSuccessfullyReset = false;
  error = false;

  email = '';
  token = '';

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParamMap.subscribe((params) => {
        this.email = params.get('email') ?? '';
        this.token = params.get('token') ? decodeURIComponent(params.get('token')!) : '';

        this.authService.initResetPasswordForm(this.token, this.email);

        if (!this.email || !this.token) {
          this.sharedService.isForgetPasswordSheetShowed = false;
        }
      }),
    );

    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (status === RESET_PASSWORD_STATUS.success) {
            this.isSuccessfullyReset = true;
          } else if (status === RESET_PASSWORD_STATUS.faild) {
            this.error = true;
          }
        },
      }),
    );

    this.subscription.add(
      this.userProfileService.notify.subscribe({
        next: () => {
          if (
            this.userProfileService.user.email.toLowerCase() !== this.email.toLowerCase() &&
            this.email.toLowerCase()
          ) {
            this.authService.removeToken();
          }
        },
      }),
    );
  }

  onReset() {
    if (this.resetPasswordForm.valid) {
      this.authService.restPassword();
    }
  }

  goToSignIn(e: Event) {
    e.stopPropagation();

    this.sharedService.isLogInSheetShowed = true;
    this.sharedService.isResetPasswordSheetShowed = false;
  }

  get isLoading() {
    return this.authService.isLoading;
  }

  get resetPasswordForm() {
    return this.authService.resetPasswordForm;
  }

  get lang() {
    return this.translate.currentLang === 'en' ? 'en' : 'ar';
  }

  get getPasswordErrorMessage() {
    return this.authService.getPasswordErrorMessage;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
