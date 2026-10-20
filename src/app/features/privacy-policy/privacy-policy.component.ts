import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HomePageApiService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { loadCmsPage } from '../../shared/cms-page';
import { SharedModule } from '../../shared/shared.module';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private translate = inject(TranslateService);
  private homePageApiService = inject(HomePageApiService);

  cmsHtml = '';
  loaded = false;

  ngOnInit(): void {
    loadCmsPage(this.homePageApiService.getPrivacyPolicy(), this.translate, this.subscription, (html, hasContent) => {
      this.cmsHtml = hasContent ? html : '';
      this.loaded = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
