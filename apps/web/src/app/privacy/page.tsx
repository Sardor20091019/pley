'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage(): React.JSX.Element {
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
        <Badge variant="lime" size="md">
          Xavfsizlik
        </Badge>

        <h1 className="text-3xl sm:text-4xl font-black text-[#242424]">
          Maxfiylik va Bekor Qilish Siyosati
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

