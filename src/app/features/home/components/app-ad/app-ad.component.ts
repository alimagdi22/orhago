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
      'Enjoy more than ten practical features tailored exclusively for app users',
      'Discover our Explore page for popular Destinations, Weekend Getaways, Travel News and more.',
      'Swift checkout process on the Travelo app with offline booking access, various discounts and password-less logins.',
    ];
  }
}
