import { Component, inject } from '@angular/core';
import { SharedService } from '../../../../../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-checkout-steps',
  templateUrl: './checkout-steps.component.html',
  styleUrl: './checkout-steps.component.scss',
})
export class CheckoutStepsComponent {
  sharedService = inject(SharedService);
  translateService = inject(TranslateService);
}
