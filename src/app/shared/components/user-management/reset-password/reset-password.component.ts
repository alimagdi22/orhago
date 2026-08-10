import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../../../shared.service';
import { AuthService, FORGET_PASSWORD_STATUS } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  translate = inject(TranslateService);
  sharedService = inject(SharedService);
  authService = inject(AuthService);
  subscription = new Subscription();

  isSuccessfullySent = false;
  error = false;

  ngOnInit(): void {
    this.authService.initForgetPasswordForm();

    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (status === FORGET_PASSWORD_STATUS.success) {
            this.isSuccessfullySent = true;
          } else if (status === FORGET_PASSWORD_STATUS.faild) {
            this.error = true;
          }
        },
      }),
    );
  }

  onSubmit() {
    this.authService.forgetPassword();
  }

  goToSignIn(e: Event) {
    e.stopPropagation();

    this.sharedService.isLogInSheetShowed = true;
    this.sharedService.isResetPasswordSheetShowed = false;
  }

  resendEmail(e: Event) {
    console.log('Resend Email');
  }

  get isLoading() {
    return this.authService.isLoading;
  }

  get forgetPasswordForm() {
    return this.authService.forgetPasswordForm;
  }

  get lang() {
    return this.translate.currentLang === 'en' ? 'en' : 'ar';
  }

  get getEmailErrorMessage() {
    return this.authService.getEmailErrorMessage;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
