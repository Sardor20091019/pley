'use client';

import React from 'react';
import Link from 'next/link';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import { useI18n } from '../../lib/i18n/useI18n';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage(): React.JSX.Element {
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
              <span>BAYONOT № SEC-2026</span>
            </div>
            <h1
              className="text-3xl sm:text-5xl font-bold text-[#1A1510]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {t('privacyTitle')}
            </h1>
            <p className="text-xs font-serif italic text-[#8B7355]">
              {t('privacySubtitle')}
            </p>
          </div>

          <div className="space-y-6 text-sm font-serif text-[#1A1510] leading-relaxed">
            <p className="text-base font-serif italic border-l-2 border-[#C5A55A] pl-4 py-1 text-[#8B7355]">
              Pley.uz shaxsiy maʼlumotlar daxlsizligini qatʼiy taʼminlaydi. Biz hech qachon telefon raqamlari yoki toʻliq
              bank hisobotlarini ommaviy reyestrlarda oshkor qilmaymiz.
            </p>

            <div className="space-y-2 pt-2">
              <h3
                className="text-lg font-bold text-[#1A1510] flex items-center gap-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <span>§ I.</span>
                <span>Yigʻiladigan maʼlumotlar</span>
              </h3>
              <p className="text-[#332B24]">
                Roʻyxatdan oʻtishda faqat ism-familiya, Google elektron pochta manzili, sport toifasi va yosh oraligʻi
                qayd etiladi. Ushbu parametrlar faqat oʻyinlar tashkiliy yaxlitligini taʼminlash uchun xizmat qiladi.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h3
                className="text-lg font-bold text-[#1A1510] flex items-center gap-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <span>§ II.</span>
                <span>Xavfsiz toʻlovlar</span>
              </h3>
              <p className="text-[#332B24]">
                Karta maʼlumotlari platforma serverlarida saqlanmaydi. Barcha tranzaksiyalar litsenziyalangan toʻlov
                tizimlari shifrlangan kanallari orqali xavfsiz rejimda amalga oshiriladi.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h3
                className="text-lg font-bold text-[#1A1510] flex items-center gap-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <span>§ III.</span>
                <span>Maʼlumotlarni oʻchirish</span>
              </h3>
              <p className="text-[#332B24]">
                Har bir foydalanuvchi istalgan vaqtda oʻz akkauntini yopish va kiritilgan maʼlumotlarni serverlardan
                toʻliq tozalashni talab qilish huquqiga ega.
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
        <Badge variant="lime" size="md">
          {t('termsOfficialDoc')}
        </Badge>

        <h1 className="text-3xl sm:text-4xl font-black text-[#242424]">
          {t('privacyTitle')}
        </h1>

        <div className="space-y-4 text-sm font-medium text-[#444444] leading-relaxed">
          <p>
            Pley.uz platformasi foydalanuvchilarning shaxsiy maʼlumotlarini qatʼiy himoya qiladi.
            Biz hech qachon telefon raqamlari, bank kartasi maʼlumotlari yoki toʻliq shaxsiy
            identifikatorlarni ochiq holda koʻrsatmaymiz.
          </p>

          <h3 className="text-lg font-black text-[#242424] pt-2">
            1. Yigʻiladigan maʼlumotlar
          </h3>
          <p>
            Profil yaratishda faqat ism, Telegram foydalanuvchi nomi, oʻyin darajasi va
            yosh toifasi saqlanadi. Bu maʼlumotlar faqat oʻyin tashkiliy jarayoni uchun
            zarurdir.
          </p>

          <h3 className="text-lg font-black text-[#242424] pt-2">
            2. Xavfsiz toʻlovlar
          </h3>
          <p>
            Karta maʼlumotlari platforma serverlarida saqlanmaydi. Barcha tranzaksiyalar
            faqat litsenziyalangan toʻlov provayderlari (Click, Payme) orqali xavfsiz
            shifrlangan kanal orqali yuboriladi.
          </p>

          <h3 className="text-lg font-black text-[#242424] pt-2">
            3. Maʼlumotlarni oʻchirish
          </h3>
          <p>
            Har qanday foydalanuvchi oʻz hisobini toʻxtatish yoki maʼlumotlarini butunlay
            oʻchirishni talab qilish huquqiga ega. Buning uchun qoʻllab-quvvatlash
            xizmatiga murojaat qilish kifoya.
          </p>
        </div>
      </Card>
    </div>
  );
}
