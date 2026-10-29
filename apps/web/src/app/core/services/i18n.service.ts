import { Injectable, signal, WritableSignal } from '@angular/core';
import { Language, translations, TranslationKey } from '../models/translations';
import { getCookie, setCookie, canStorePreferences } from './cookies';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  public readonly language: WritableSignal<Language> = signal<Language>('uz');
  public readonly isTransitioning: WritableSignal<boolean> = signal<boolean>(false);

  public init(): void {
    try {
      if (!canStorePreferences()) {
        this.language.set('uz');
        document.documentElement.setAttribute('lang', 'uz');
        return;
      }

      const saved = (getCookie('pley_lang') || localStorage.getItem('pley_lang')) as Language;
      if (saved && (saved === 'uz' || saved === 'ru' || saved === 'en')) {
        this.language.set(saved);
        document.documentElement.setAttribute('lang', saved);
      }
    } catch {}
  }

  public setLanguage(lang: Language): void {
    if (lang === this.language()) return;
    this.isTransitioning.set(true);

    setTimeout(() => {
      this.language.set(lang);
      if (canStorePreferences()) {
        try {
          setCookie('pley_lang', lang, 365);
          localStorage.setItem('pley_lang', lang);
        } catch {}
      }
      document.documentElement.setAttribute('lang', lang);

      setTimeout(() => {
        this.isTransitioning.set(false);
      }, 150);
    }, 150);
  }

  public t(key: TranslationKey): string {
    const currentLang = this.language();
    const langDict = translations[currentLang];
    if (langDict && key in langDict) {
      return langDict[key];
    }
    return translations.en[key] || String(key);
  }
}
