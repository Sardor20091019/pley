'use client';

import React from 'react';
import Link from 'next/link';
import { Mascot } from '../mascot/Mascot';
import { useI18n } from '../../lib/i18n/useI18n';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import { Send, Heart } from 'lucide-react';

export function Footer(): React.JSX.Element {
  const { t } = useI18n();
  const { theme } = useAppTheme();
  const isCartoon = theme === 'cartoon';

  if (!isCartoon) {
    return (
      <footer className="bg-[#EDE6D5] text-[#1A1510] pt-14 pb-24 md:pb-14 px-6 sm:px-12 border-t border-[#2D2926] mt-20 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <Mascot size="sm" mood="happy" />
              <span className="text-2xl font-black text-[#1A1510]" style={{ fontFamily: 'Georgia, serif' }}>
                PLEY<span className="text-[#8B7355]">.UZ</span>
              </span>
            </div>
            <p className="text-xs text-[#4A3F30] leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
              {t('brandTagline')}
            </p>
            <div className="inline-flex items-center gap-2 bg-[#F5F0E8] px-3 py-1.5 text-[10px] font-bold font-sans uppercase tracking-widest text-[#8B7355] border border-[rgba(45,41,38,0.25)]">
              <span>📍 {t('footerLocation')}</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[10px] font-sans uppercase tracking-[0.2em] text-[#8B7355] mb-3">
              {t('footerSportsCatalog')}
            </h4>
            <ul className="space-y-2 text-xs font-sans font-medium text-[#4A3F30]">
              <li>
                <Link href="/discover?sport=table-tennis" className="hover:text-[#1A1510] transition-colors">
                  {t('tableTennis')}
                </Link>
              </li>
              <li>
                <Link href="/discover?sport=basketball-3x3" className="hover:text-[#1A1510] transition-colors">
                  {t('basketball')}
                </Link>
              </li>
              <li>
                <Link href="/discover?district=Chilonzor" className="hover:text-[#1A1510] transition-colors">
                  {t('footerChilonzorZones')}
                </Link>
              </li>
              <li>
                <Link href="/discover?district=Yunusobod" className="hover:text-[#1A1510] transition-colors">
                  {t('footerYunusobodZones')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[10px] font-sans uppercase tracking-[0.2em] text-[#8B7355] mb-3">
              {t('footerPlatform')}
            </h4>
            <ul className="space-y-2 text-xs font-sans font-medium text-[#4A3F30]">
              <li>
                <Link href="/#editorial-how" className="hover:text-[#1A1510] transition-colors">
                  {t('howItWorksBtn')}
                </Link>
              </li>
              <li>
                <Link href="/#venue-partner" className="hover:text-[#1A1510] transition-colors">
                  {t('footerVenuePartners')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#1A1510] transition-colors">
                  {t('footerTerms')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#1A1510] transition-colors">
                  {t('footerPrivacy')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[10px] font-sans uppercase tracking-[0.2em] text-[#8B7355] mb-1">
              {t('footerCommunity')}
            </h4>
            <p className="text-xs font-sans text-[#4A3F30] leading-relaxed">
              {t('footerCommunityDesc')}
            </p>
            <a
              href="https://t.me/astro_spectrum"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1A1510] text-[#F5F0E8] px-4 py-2 text-xs font-bold font-sans uppercase tracking-wider hover:bg-[#332B24] transition-all"
            >
              <Send className="w-3.5 h-3.5 text-[#C5A55A]" />
              <span>@astro_spectrum Telegram</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[rgba(45,41,38,0.15)] flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-[#8B7355] gap-3">
          <div>© 2026 Pley.uz. {t('footerRights')}</div>
          <div className="flex items-center gap-1 font-bold text-[#4A3F30]">
            <span>{t('footerMadeWithLove')}</span>
            <Heart className="w-3.5 h-3.5 text-[#B85450] fill-current" />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#242424] text-white pt-12 pb-24 md:pb-12 px-6 sm:px-12 border-t-[3px] border-[#242424] mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <Mascot size="sm" mood="happy" />
            <span className="text-2xl font-black text-white">
              PLEY<span className="text-[#D7FF64]">.UZ</span>
            </span>
          </div>
          <p className="text-sm text-[#CCCCCC] leading-relaxed">
            {t('brandTagline')}
          </p>
          <div className="inline-flex items-center gap-2 bg-[#333333] px-3 py-1.5 rounded-full text-xs font-bold text-[#D7FF64] border border-[#444444]">
            <span>📍 {t('footerLocation')}</span>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#D7FF64] mb-3">
            {t('footerSportsCatalog')}
          </h4>
          <ul className="space-y-2 text-sm text-[#DDDDDD] font-medium">
            <li>
              <Link href="/discover?sport=table-tennis" className="hover:text-[#D7FF64] transition-colors">
                {t('tableTennis')}
              </Link>
            </li>
            <li>
              <Link href="/discover?sport=basketball-3x3" className="hover:text-[#D7FF64] transition-colors">
                {t('basketball')}
              </Link>
            </li>
            <li>
              <Link href="/discover?sport=badminton" className="hover:text-[#D7FF64] transition-colors">
                {t('badminton')} ({t('comingSoon')})
              </Link>
            </li>
            <li>
              <Link href="/discover?district=Chilonzor" className="hover:text-[#D7FF64] transition-colors">
                {t('footerChilonzorZones')}
              </Link>
            </li>
            <li>
              <Link href="/discover?district=Yunusobod" className="hover:text-[#D7FF64] transition-colors">
                {t('footerYunusobodZones')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#D7FF64] mb-3">
            {t('footerPlatform')}
          </h4>
          <ul className="space-y-2 text-sm text-[#DDDDDD] font-medium">
            <li>
              <Link href="/#how-it-works" className="hover:text-[#D7FF64] transition-colors">
                {t('howItWorksBtn')}
              </Link>
            </li>
            <li>
              <Link href="/#venue-partner" className="hover:text-[#D7FF64] transition-colors">
                {t('footerVenuePartners')}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#D7FF64] transition-colors">
                {t('footerTerms')}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[#D7FF64] transition-colors">
                {t('footerPrivacy')}
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#D7FF64] mb-1">
            {t('footerCommunity')}
          </h4>
          <p className="text-xs text-[#BBBBBB] leading-relaxed">
            {t('footerCommunityDesc')}
          </p>
          <a
            href="https://t.me/astro_spectrum"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#7655F7] hover:bg-[#6844eb] text-white px-4 py-2.5 rounded-full text-xs font-black border-2 border-white shadow-[2px_2px_0px_#FFFFFF] transition-transform hover:-translate-y-0.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>@astro_spectrum Telegram</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#3A3A3A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#888888] gap-3">
        <div>© 2026 Pley.uz. {t('footerRights')}</div>
        <div className="flex items-center gap-1 font-bold">
          <span>{t('footerMadeWithLove')}</span>
          <Heart className="w-3.5 h-3.5 text-[#FF795D] fill-current" />
        </div>
      </div>
    </footer>
  );
}
