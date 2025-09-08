import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { STORAGE_KEYS } from '@core/constants/storage-keys';

// 1. Lista literal de locales válidos
export const THEMES = ['night', 'light'] as const;

// 2. Tipo derivado automáticamente
export type Theme = typeof THEMES[number];

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
    const next = this.currentTheme() === 'light' ? 'night' : 'light';
    this.setTheme(next);
  }

  private setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
    this.setThemeInLocalStorage(theme);
  }

  private setThemeInLocalStorage(theme: Theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  private getThemeFromLocalStorage(): Theme {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return this.isValidTheme(theme) ? theme : 'light';
  }

  // 3. Type guard seguro
  private isValidTheme(value: unknown): value is Theme {
    return typeof value === 'string' && THEMES.includes(value as Theme);
  }
}
