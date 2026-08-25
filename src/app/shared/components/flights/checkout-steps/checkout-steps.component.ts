import { Component, inject, Input } from '@angular/core';
import { SharedService } from '../../../shared.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-checkout-steps',
  templateUrl: './checkout-steps.component.html',
  styleUrl: './checkout-steps.component.scss',
})
export class CheckoutStepsComponent {
  @Input() isScrolled = false;
  sharedService = inject(SharedService);
  translateService = inject(TranslateService);
}
