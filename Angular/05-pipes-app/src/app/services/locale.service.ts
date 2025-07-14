import { Injectable, Signal, signal } from '@angular/core';
import { STORAGE_KEYS } from '@core/constants/storage-keys';

// 1. Lista literal de locales válidos
export const AVAILABLE_LOCALES = ['es', 'fr', 'en'] as const;

// 2. Tipo derivado automáticamente
export type AvailableLocale = typeof AVAILABLE_LOCALES[number];

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  private currentLocale = signal<AvailableLocale>('es');

  constructor() {
    const storedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE);
    const validatedLocale = this.isAvailableLocale(storedLocale) ? storedLocale : 'es';
    this.currentLocale.set(validatedLocale);
  }

  get getLocale(): AvailableLocale {
    return this.currentLocale();
  }

  changeLocale(locale: AvailableLocale) {
    this.currentLocale.set(locale);
    localStorage.setItem(STORAGE_KEYS.LOCALE, locale);
    window.location.reload();
  }

  // 3. Type guard seguro
  private isAvailableLocale(value: unknown): value is AvailableLocale {
    return typeof value === 'string' && AVAILABLE_LOCALES.includes(value as AvailableLocale);
  }

}
