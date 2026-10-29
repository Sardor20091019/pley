import { Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { getCookie, setCookie, canStorePreferences } from './cookies';

export type AppTheme = 'cartoon' | 'editorial';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public readonly theme: WritableSignal<AppTheme> = signal<AppTheme>('cartoon');
  public readonly isTransitioning: WritableSignal<boolean> = signal<boolean>(false);
  public readonly isEditorial: Signal<boolean> = computed(() => this.theme() === 'editorial');
  public readonly isCartoon: Signal<boolean> = computed(() => this.theme() === 'cartoon');

  public init(): void {
    try {
      if (!canStorePreferences()) {
        this.theme.set('cartoon');
        document.documentElement.setAttribute('data-theme', 'cartoon');
        return;
      }

      const saved = (getCookie('pley_theme_mode') || localStorage.getItem('pley_theme_mode')) as AppTheme;
      if (saved === 'cartoon' || saved === 'editorial') {
        this.theme.set(saved);
        document.documentElement.setAttribute('data-theme', saved);
      } else {
        this.theme.set('cartoon');
        document.documentElement.setAttribute('data-theme', 'cartoon');
      }
    } catch {
      document.documentElement.setAttribute('data-theme', 'cartoon');
    }
  }

  public setTheme(next: AppTheme): void {
    if (this.isTransitioning()) return;
    this.isTransitioning.set(true);

    setTimeout(() => {
      this.theme.set(next);
      document.documentElement.setAttribute('data-theme', next);

      if (canStorePreferences()) {
        try {
          setCookie('pley_theme_mode', next, 365);
          localStorage.setItem('pley_theme_mode', next);
        } catch {}
      }

      setTimeout(() => {
        this.isTransitioning.set(false);
      }, 400);
    }, 200);
  }

  public toggleTheme(): void {
    this.setTheme(this.theme() === 'cartoon' ? 'editorial' : 'cartoon');
  }
}
