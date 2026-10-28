'use client';

import React from 'react';
import Link from 'next/link';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import { useI18n } from '../../lib/i18n/useI18n';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Scroll } from 'lucide-react';

export default function TermsPage(): React.JSX.Element {
  const { theme } = useAppTheme();
  const { t } = useI18n();
  const isEditorial = theme === 'editorial';

  if (isEditorial) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-widest uppercase text-[#8B7355] hover:text-[#1A1510] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('termsBackHome')}</span>
        </Link>

        <div className="bg-[#EDE6D5] border-2 border-[#2D2926] p-8 sm:p-12 shadow-[3px_3px_0px_#2D2926] space-y-8">
          <div className="border-b-2 border-double border-[#2D2926] pb-6 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-sans font-bold tracking-widest uppercase text-[#8B7355]">
              <span>{t('termsOfficialDoc')}</span>
              <span>{t('termsCode')}</span>
            </div>
            <h1
              className="text-3xl sm:text-5xl font-bold text-[#1A1510]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {t('termsTitle')}
            </h1>
            <p className="text-xs font-serif italic text-[#8B7355]">
              {t('termsSubtitle')}
            </p>
          </div>

          <div className="space-y-6 text-sm font-serif text-[#1A1510] leading-relaxed">
            <p className="text-base font-serif italic border-l-2 border-[#C5A55A] pl-4 py-1 text-[#8B7355]">
              Pley.uz Toshkent shahrida havaskor sportchilar uchun oʻyinlarni tashkil etish, individual joylarni
              band qilish va maydoncha xarajatlarini teng taqsimlash uchun faoliyat yuritadi.
            </p>

            <div className="space-y-2 pt-2">
              <h3
                className="text-lg font-bold text-[#1A1510] flex items-center gap-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <span>§ I.</span>
                <span>Foydalanuvchi hisoblari va qoidalar</span>
              </h3>
              <p className="text-[#332B24]">
                Har bir foydalanuvchi oʻz shaxsiy maʼlumotlari toʻgʻriligini taʼminlaydi. Oʻyin davomida barcha
                ishtirokchilar sport odob-axloq qoidalariga qatʼiy rioya qilishi, boshqa oʻyinchilarga hurmat bilan
                munosabatda boʻlishi va sport zali ichki tartibiga boʻysunishi shart.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h3
                className="text-lg font-bold text-[#1A1510] flex items-center gap-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <span>§ II.</span>
                <span>Joylarni band qilish va toʻlovlar</span>
              </h3>
              <p className="text-[#332B24]">
                Joylar har bir sessiya uchun belgilangan sigʻim asosida transactional tartibda taqsimlanadi. Joy band
                qilinganda oʻyin narxi va xizmat haqi ochiq koʻrsatiladi. Tranzaksiyalar xavfsiz toʻlov protokollari
                asosida qabul qilinadi.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h3
                className="text-lg font-bold text-[#1A1510] flex items-center gap-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <span>§ III.</span>
                <span>Bekor qilish va kafolatlar</span>
              </h3>
              <p className="text-[#332B24]">
                Oʻyinchilar sessiya boshlanishiga belgilangan muddat (kamida 4 soat) qolgunga qadar oʻz bandliklarini
                jarimasiz bekor qilish huquqiga ega. Mazkur muddat oʻtgandan soʻng zal ijarasi xarajatlari sababli
                bekor qilish cheklanadi.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-black text-[#242424] hover:text-[#7655F7]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('termsBackHome')}</span>
      </Link>

      <Card variant="white" className="p-8 sm:p-12 space-y-6">
        <Badge variant="purple" size="md">
          {t('termsOfficialDoc')}
        </Badge>

        <h1 className="text-3xl sm:text-4xl font-black text-[#242424]">
          {t('termsTitle')}
        </h1>

        <div className="space-y-4 text-sm font-medium text-[#444444] leading-relaxed">
          <p>
            Pley.uz platformasi Toshkent shahridagi havaskor sportchilar uchun oʻyinlarni
            tashkil etish, individual joylarni band qilish va sport maydonchalari
            xarajatlarini oʻzaro adolatli taqsimlash imkoniyatini taqdim etadi.
          </p>

          <h3 className="text-lg font-black text-[#242424] pt-2">
            1. Foydalanuvchi hisoblari va qoidalar
          </h3>
          <p>
            Har bir foydalanuvchi oʻz shaxsiy maʼlumotlari toʻgʻriligini taʼminlaydi.
            Oʻyin davomida barcha ishtirokchilar sport odob-axloq qoidalariga rioya qilishi,
            boshqa oʻyinchilarga hurmat bilan munosabatda boʻlishi va sport zali talablariga
            boʻysunishi shart.
          </p>

          <h3 className="text-lg font-black text-[#242424] pt-2">
            2. Joylarni band qilish va toʻlovlar
          </h3>
          <p>
            Joylar har bir oʻyin uchun belgilangan sigʻim asosida transactional ravishda
            taqsimlanadi. Joy band qilinganda oʻyin narxi va xizmat haqi aniq
            koʻrsatiladi. Toʻlovlar mahalliy toʻlov tizimlari yoki test rejimida amalga
            oshiriladi.
          </p>

          <h3 className="text-lg font-black text-[#242424] pt-2">
            3. Bekor qilish va qaytarish
          </h3>
          <p>
            Oʻyinchilar sessiya boshlanishiga belgilangan muddat (odatda 2–6 soat)
            qolganga qadar oʻz bandliklarini bekor qilish huquqiga ega. Muddat oʻtgandan
            soʻng zal ijarasi xarajatlari sababli bekor qilish cheklanadi.
          </p>
        </div>
      </Card>
    </div>
  );
}
