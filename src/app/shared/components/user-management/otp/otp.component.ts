import { Component, inject } from '@angular/core';
import { AuthService, OTP_STATUS } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../shared.service';

@Component({
  standalone: false,
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
})
export class OtpComponent {
  authService = inject(AuthService);
  sharedService = inject(SharedService);

  subscription = new Subscription();

  error = false;

  ngOnInit(): void {
    this.subscription.add(
      this.authService.notify.subscribe({
        next: (status) => {
          if (status === OTP_STATUS.success) {
            this.sharedService.isOTPShowed = false;
          } else {
            this.error = true;
          }
        },
      }),
    );
  }

  onOtpChange(otp: string) {
    if (otp.length === 6) {
      this.authService.otpSubmit(otp);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
