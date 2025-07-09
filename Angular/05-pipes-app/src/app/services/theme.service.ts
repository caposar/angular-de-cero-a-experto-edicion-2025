import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Theme = 'dracula' | 'light'

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly currentTheme = signal<Theme>('light');

  constructor() {
    this.setTheme(this.getThemeFromLocalStorage());
  }

  getCurrentTheme() {
    return this.currentTheme.asReadonly();
  }

  toggleTheme() {
    if (this.currentTheme() === 'light') {
      this.setTheme('dracula');
    } else {
      this.setTheme('light');
    }
  }

  private setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
    this.setThemeInLocalStorage(theme);
  }

  private setThemeInLocalStorage(theme: Theme) {
    localStorage.setItem('preferred-theme', theme);
  }

  private getThemeFromLocalStorage(): Theme {
    return localStorage.getItem('preferred-theme') as Theme ?? 'light';
  }
}
