'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage(): React.JSX.Element {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-black text-[#242424] hover:text-[#7655F7]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Bosh sahifaga qaytish</span>
      </Link>

      <Card variant="white" className="p-8 sm:p-12 space-y-6">
        <Badge variant="purple" size="md">
          Huquqiy hujjat
        </Badge>

        <h1 className="text-3xl sm:text-4xl font-black text-[#242424]">
          Foydalanish Shartlari
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

