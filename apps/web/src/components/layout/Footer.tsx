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
      <footer className="bg-[#05050E] text-[#C8C0F0] pt-14 pb-24 md:pb-14 px-6 sm:px-12 border-t border-[rgba(118,85,247,0.2)] mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <Mascot size="sm" mood="happy" />
              <span className="text-2xl font-black text-[#F0EDFF]">
                PLEY<span className="text-[#9B7DFF]">.UZ</span>
              </span>
            </div>
            <p className="text-sm text-[#8B80C8] leading-relaxed">
              {t('brandTagline')}
            </p>
            <div className="inline-flex items-center gap-2 bg-[rgba(118,85,247,0.12)] px-3 py-1.5 rounded-full text-xs font-semibold text-[#C8FF00] border border-[rgba(118,85,247,0.3)]">
              <span>📍 Toshkent, Oʻzbekiston</span>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#C8FF00] mb-3">
              Oʻyinlar & Sport
            </h4>
            <ul className="space-y-2 text-sm text-[#8B80C8] font-medium">
              <li>
                <Link href="/discover?sport=table-tennis" className="hover:text-[#F0EDFF] transition-colors">
                  {t('tableTennis')}
                </Link>
              </li>
              <li>
                <Link href="/discover?sport=basketball-3x3" className="hover:text-[#F0EDFF] transition-colors">
                  {t('basketball')}
                </Link>
              </li>
              <li>
                <Link href="/discover?district=Chilonzor" className="hover:text-[#F0EDFF] transition-colors">
                  Chilonzor zonalari
                </Link>
              </li>
              <li>
                <Link href="/discover?district=Yunusobod" className="hover:text-[#F0EDFF] transition-colors">
                  Yunusobod zonalari
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#C8FF00] mb-3">
              Pley haqida
            </h4>
            <ul className="space-y-2 text-sm text-[#8B80C8] font-medium">
              <li>
                <Link href="/#how-it-works" className="hover:text-[#F0EDFF] transition-colors">
                  {t('howItWorksBtn')}
                </Link>
              </li>
              <li>
                <Link href="/#venue-partner" className="hover:text-[#F0EDFF] transition-colors">
                  Zal egalari uchun
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#F0EDFF] transition-colors">
                  Foydalanish shartlari
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#F0EDFF] transition-colors">
                  Maxfiylik va bekor qilish
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#C8FF00] mb-1">
              Telegram Jamiyati
            </h4>
            <p className="text-xs text-[#5A5488] leading-relaxed">
              Yangi oʻyinlar, doʻstlar va chellenjlar uchun rasmiy kanalimizga qoʻshiling.
            </p>
            <a
              href="https://t.me/pleyuz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[rgba(118,85,247,0.25)] hover:bg-[rgba(118,85,247,0.35)] text-white px-4 py-2.5 rounded-full text-xs font-bold border border-[rgba(155,125,255,0.4)] shadow-[0_0_16px_rgba(118,85,247,0.3)] transition-transform hover:-translate-y-0.5"
            >
              <Send className="w-3.5 h-3.5 text-[#C8FF00]" />
              <span>@pleyuz Telegram</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[rgba(118,85,247,0.15)] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5A5488] gap-3">
          <div>© 2026 Pley.uz. Barcha huquqlar himoyalangan.</div>
          <div className="flex items-center gap-1 font-bold text-[#8B80C8]">
            <span>Toshkent sportchilari uchun muhabbat bilan</span>
            <Heart className="w-3.5 h-3.5 text-[#FF6B52] fill-current" />
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
            <span>📍 Toshkent, Oʻzbekiston</span>
          </div>
        </div>

        <div>
          <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#D7FF64] mb-3">
            Oʻyinlar & Sport
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
                {t('badminton')} (Yaqinda)
              </Link>
            </li>
            <li>
              <Link href="/discover?district=Chilonzor" className="hover:text-[#D7FF64] transition-colors">
                Chilonzor zonalari
              </Link>
            </li>
            <li>
              <Link href="/discover?district=Yunusobod" className="hover:text-[#D7FF64] transition-colors">
                Yunusobod zonalari
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#D7FF64] mb-3">
            Pley haqida
          </h4>
          <ul className="space-y-2 text-sm text-[#DDDDDD] font-medium">
            <li>
              <Link href="/#how-it-works" className="hover:text-[#D7FF64] transition-colors">
                {t('howItWorksBtn')}
              </Link>
            </li>
            <li>
              <Link href="/#venue-partner" className="hover:text-[#D7FF64] transition-colors">
                Zal egalari uchun
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#D7FF64] transition-colors">
                Foydalanish shartlari
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[#D7FF64] transition-colors">
                Maxfiylik va bekor qilish
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-extrabold text-sm uppercase tracking-wider text-[#D7FF64] mb-1">
            Telegram Jamiyati
          </h4>
          <p className="text-xs text-[#BBBBBB] leading-relaxed">
            Yangi oʻyinlar, doʻstlar va chellenjlar uchun rasmiy kanalimizga qoʻshiling.
          </p>
          <a
            href="https://t.me/pleyuz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#7655F7] hover:bg-[#6844eb] text-white px-4 py-2.5 rounded-full text-xs font-black border-2 border-white shadow-[2px_2px_0px_#FFFFFF] transition-transform hover:-translate-y-0.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>@pleyuz Telegram</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#3A3A3A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#888888] gap-3">
        <div>© 2026 Pley.uz. Barcha huquqlar himoyalangan.</div>
        <div className="flex items-center gap-1 font-bold">
          <span>Toshkent sportchilari uchun muhabbat bilan</span>
          <Heart className="w-3.5 h-3.5 text-[#FF795D] fill-current" />
        </div>
      </div>
    </footer>
  );
}
