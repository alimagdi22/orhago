import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HomePageApiService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { IMainButton } from '../../shared/models/flights/mainButton.model';
import { loadCmsPage } from '../../shared/cms-page';
import { SharedModule } from '../../shared/shared.module';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private translate = inject(TranslateService);
  private homePageApiService = inject(HomePageApiService);

  cmsHtml = '';
  loaded = false;

  sendButton: IMainButton = {
    height: '45px',
    width: '160px',
    borderRadius: '12px',
  };

  ngOnInit(): void {
    loadCmsPage(this.homePageApiService.getContact(), this.translate, this.subscription, (html, hasContent) => {
      this.cmsHtml = hasContent ? html : '';
      this.loaded = true;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
