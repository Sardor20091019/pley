import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  CookieConsentPreferences,
  getCookieConsent,
  saveCookieConsent,
} from './cookies';

@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  public readonly consentState: WritableSignal<CookieConsentPreferences | null> =
    signal<CookieConsentPreferences | null>(null);
  public readonly isBannerOpen: WritableSignal<boolean> = signal<boolean>(false);
  public readonly showPreferencesModal: WritableSignal<boolean> =
    signal<boolean>(false);
  public readonly preferencesOnly: WritableSignal<boolean> = signal<boolean>(true);
  public readonly analyticsOnly: WritableSignal<boolean> = signal<boolean>(true);

  constructor() {
    this.init();
  }

  public init(): void {
    const existing = getCookieConsent();
    if (!existing) {
      this.isBannerOpen.set(true);
    } else {
      this.consentState.set(existing);
      this.preferencesOnly.set(existing.preferences);
      this.analyticsOnly.set(existing.analytics);
    }
  }

  public acceptAll(): void {
    const saved = saveCookieConsent({ preferences: true, analytics: true });
    this.consentState.set(saved);
    this.preferencesOnly.set(true);
    this.analyticsOnly.set(true);
    this.isBannerOpen.set(false);
    this.showPreferencesModal.set(false);
  }

  public rejectAll(): void {
    const saved = saveCookieConsent({ preferences: false, analytics: false });
    this.consentState.set(saved);
    this.preferencesOnly.set(false);
    this.analyticsOnly.set(false);
    this.isBannerOpen.set(false);
    this.showPreferencesModal.set(false);
  }

  public savePreferences(): void {
    const saved = saveCookieConsent({
      preferences: this.preferencesOnly(),
      analytics: this.analyticsOnly(),
    });
    this.consentState.set(saved);
    this.isBannerOpen.set(false);
    this.showPreferencesModal.set(false);
  }

  public openPreferences(): void {
    const current = this.consentState();
    this.preferencesOnly.set(current ? current.preferences : true);
    this.analyticsOnly.set(current ? current.analytics : true);
    this.showPreferencesModal.set(true);
  }

  public closePreferences(): void {
    this.showPreferencesModal.set(false);
  }
}
