import React from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '../components/layout/Navbar';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { Footer } from '../components/layout/Footer';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
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
        className="bg-[#FFF9EF] text-[#242424] min-h-screen flex flex-col font-sans selection:bg-[#D7FF64]"
      >
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="afterInteractive"
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
