import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {}
