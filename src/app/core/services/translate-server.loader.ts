import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export class TranslateServerLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<any> {
    return new Observable((observer) => {
      try {
        if (typeof window === 'undefined') {
          const req = eval('require');
          const fs = req('fs');
          const path = req('path');

          const possiblePaths = [
            path.resolve(process.cwd(), `dist/orhas/browser/assets/i18n/${lang}.json`),
            path.resolve(process.cwd(), `dist/orhas/browser/public/assets/i18n/${lang}.json`),
            path.resolve(process.cwd(), `public/assets/i18n/${lang}.json`),
            path.resolve(process.cwd(), `src/assets/i18n/${lang}.json`),
          ];

          let content = '';
          for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
              content = fs.readFileSync(p, 'utf8');
              break;
            }
          }

          if (content) {
            observer.next(JSON.parse(content));
          } else {
            observer.next({});
          }
        } else {
          observer.next({});
        }
        observer.complete();
      } catch (err) {
        observer.error(err);
      }
    });
  }
}
