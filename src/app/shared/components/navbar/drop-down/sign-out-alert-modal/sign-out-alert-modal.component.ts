import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'rp-travel-ui';

@Component({
  standalone: false,
  selector: 'app-sign-out-alert-modal',
  templateUrl: './sign-out-alert-modal.component.html',
  styleUrls: ['./sign-out-alert-modal.component.scss'],
})
export class SignOutAlertModalComponent {
  @Output() clickCancel = new EventEmitter<null>();

  authService = inject(AuthService);
  router = inject(Router);

  onClickSignOut() {
    this.authService.removeToken();
    this.router.navigate(['']);
  }

  onClickCancel() {
    this.clickCancel.emit(null);
  }
}
