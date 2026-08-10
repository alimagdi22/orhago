import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../shared.service';

@Component({
  standalone: false,
  selector: 'app-whats-app-button',
  templateUrl: './whats-app-button.component.html',
  styleUrl: './whats-app-button.component.scss',
})
export class WhatsAppButtonComponent {
  translate = inject(TranslateService);
  sharedService = inject(SharedService);
}
