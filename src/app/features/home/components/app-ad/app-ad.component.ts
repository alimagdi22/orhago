import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-app-ad',
  templateUrl: './app-ad.component.html',
  styleUrl: './app-ad.component.scss',
})
export class AppAdComponent {
  translate = inject(TranslateService);

  get features(): string[] {
    const res = this.translate.instant('home.adContent.features');
    if (Array.isArray(res)) {
      return res;
    }
    return [
      'Compare flight deals from 450+ airlines',
      'Fast & simple booking process',
      '100% secure payments',
    ];
  }
}
