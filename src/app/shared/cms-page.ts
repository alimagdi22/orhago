import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

export interface CmsPageContent {
  en: string;
  ar: string;
}

export function loadCmsPage(
  request: Observable<any>,
  translate: TranslateService,
  subscription: Subscription,
  apply: (html: string, hasContent: boolean) => void,
): void {
  const content: CmsPageContent = { en: '', ar: '' };

  const publish = () => {
    const html = (translate.currentLang === 'ar' ? content.ar : content.en).trim();
    apply(html, !!html);
  };

  subscription.add(translate.onLangChange.subscribe(() => publish()));
  subscription.add(
    request.subscribe({
      next: (response: any) => {
        if (response?.status === 0) {
          content.en = response.returnObject?.content || '';
          content.ar = response.returnObject?.contentArabic || content.en;
        }
        publish();
      },
      error: () => apply('', false),
    }),
  );
}
