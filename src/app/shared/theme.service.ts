import { Injectable, afterNextRender, signal } from '@angular/core';

const THEME_KEY = 'orhas-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly isDark = signal(false);

  constructor() {
    afterNextRender(() => {
      this.apply(localStorage.getItem(THEME_KEY) === 'dark', false);
    });
  }

  toggle(): void {
    this.apply(!this.isDark());
  }

  private apply(dark: boolean, persist = true): void {
    this.isDark.set(dark);
    document.documentElement.classList.toggle('dark', dark);

    if (persist) {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    }
  }
}
