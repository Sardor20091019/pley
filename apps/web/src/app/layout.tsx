import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { I18nProvider, LanguageTransition } from '../lib/i18n/useI18n';
import { ThemeProvider } from '../lib/theme/ThemeContext';
import { AuthModalProvider } from '../lib/auth/AuthModalContext';
import { Navbar } from '../components/layout/Navbar';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { Footer } from '../components/layout/Footer';
import { CookieConsent } from '../components/cookies/CookieConsent';

export const metadata: Metadata = {
  title: 'Pley.uz — No Team? No Problem. Just Show Up and Play.',
  description:
    'Discover sports sessions, claim your individual spot, meet other players, and share the cost in Tashkent, Uzbekistan.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const themeInitScript = `
(function() {
  try {
    var c = document.cookie.match(/(^|;\\s*)pley_cookie_consent=([^;]*)/);
    if (c) {
      try {
        var p = JSON.parse(decodeURIComponent(c[2]));
        if (p && p.preferences === false) {
          document.documentElement.setAttribute('data-theme', 'cartoon');
          return;
        }
      } catch(e) {}
    }

    var m = document.cookie.match(/(^|;\\s*)pley_theme_mode=([^;]*)/);
    var t = m ? decodeURIComponent(m[2]) : null;
    if (!t) {
      t = localStorage.getItem('pley_theme_mode');
    }
    if (t === 'editorial' || t === 'cartoon') {
      document.documentElement.setAttribute('data-theme', t);
    } else {
      document.documentElement.setAttribute('data-theme', 'cartoon');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col font-sans selection:bg-[#D7FF64]"
      >
        <I18nProvider>
          <ThemeProvider>
            <AuthModalProvider>
              <Navbar />
              <main className="flex-1 flex flex-col">
                <LanguageTransition>{children}</LanguageTransition>
              </main>
              <Footer />
              <CookieConsent />
              <MobileBottomNav />
            </AuthModalProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
