import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, REGISTER_STATUS } from 'rp-travel-ui';
import { SharedService } from '../../../shared.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  translate = inject(TranslateService);
  sharedService = inject(SharedService);
  authService = inject(AuthService);

  subscription = new Subscription();
  error = false;

  ngOnInit(): void {
    this.authService.initRegisterForm();

    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (status === REGISTER_STATUS.success) {
            this.sharedService.isOTPShowed = true;
            this.sharedService.isRegisterSheetShowed = false;
          } else {
            this.error = true;
          }
        },
      }),
    );
  }

  onSubmit() {
    this.error = false;
    if (this.authService.registerForm.invalid) {
      this.error = true;
    } else {
      this.authService.regitserSubmit();
    }
  }

  goToSignIn(e: Event) {
    e.stopPropagation();

    this.sharedService.isLogInSheetShowed = true;
    this.sharedService.isRegisterSheetShowed = false;
  }

  get isLoading() {
    return this.authService.isLoading;
  }

  get registerForm() {
    return this.authService.registerForm;
  }

  get lang() {
    return this.translate.currentLang === 'en' ? 'en' : 'ar';
  }

  get getFirstNameErrorMessage() {
    return this.authService.getFirstNameErrorMessage;
  }

  get getLastNameErrorMessage() {
    return this.authService.getLastNameErrorMessage;
  }

  get getUserNameErrorMessage() {
    return this.authService.getUserNameErrorMessage;
  }

  get getPhoneErrorMessage() {
    return this.authService.getPhoneErrorMessage;
  }

  get getEmailErrorMessage() {
    return this.authService.getEmailErrorMessage;
  }

  get getPasswordErrorMessage() {
    return this.authService.getPasswordErrorMessage;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
