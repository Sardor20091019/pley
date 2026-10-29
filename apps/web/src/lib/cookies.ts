export interface CookieConsentPreferences {
  necessary: boolean;
  preferences: boolean;
  updatedAt: string;
} 

export const DEFAULT_COOKIE_CONSENT: CookieConsentPreferences = {
  necessary: true,
  preferences: true,
  updatedAt: new Date().toISOString(),
};

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const match = document.cookie.match(
    new RegExp('(^|;\\s*)' + encodeURIComponent(name) + '=([^;]*)'),
  );
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') {
    return;
  }
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

export function getCookieConsent(): CookieConsentPreferences | null {
  const raw = getCookie('pley_cookie_consent');
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      necessary: true,
      preferences: parsed.preferences ?? true,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function canStorePreferences(): boolean {
  const consent = getCookieConsent();
  if (!consent) {
    return true;
  }
  return consent.preferences;
}

export function saveCookieConsent(
  prefs: Partial<CookieConsentPreferences>,
): CookieConsentPreferences {
  const complete: CookieConsentPreferences = {
    necessary: true,
    preferences: prefs.preferences ?? true,
    updatedAt: new Date().toISOString(),
  };
  setCookie('pley_cookie_consent', JSON.stringify(complete), 365);

  if (!complete.preferences) {
    deleteCookie('pley_theme_mode');
    deleteCookie('pley_lang');
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('pley_theme_mode');
        localStorage.removeItem('pley_lang');
      } catch {}
    }
  }

  return complete;
}
