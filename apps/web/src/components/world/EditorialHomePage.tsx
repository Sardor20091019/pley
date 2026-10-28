'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SessionItem } from '../../lib/types';
import { TranslationKey } from '../../lib/i18n/translations';
import {
  ArrowRight,
  MapPin,
  Clock,
  Users,
  BookOpen,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import { format } from 'date-fns';

export interface EditorialHomePageProps {
  t: (key: TranslationKey) => string;
  upcomingSessions: SessionItem[];
  partnerForm: {
    contactName: string;
    phone: string;
    venueName: string;
    district: string;
    sportTypes: string;
    message: string;
  };
  setPartnerForm: React.Dispatch<
    React.SetStateAction<{
      contactName: string;
      phone: string;
      venueName: string;
      district: string;
      sportTypes: string;
      message: string;
    }>
  >;
  partnerSubmitting: boolean;
  partnerSuccess: boolean;
  handlePartnerSubmit: (e: React.FormEvent) => Promise<void>;
}

export function EditorialHomePage({
  t,
  upcomingSessions,
  partnerForm,
  setPartnerForm,
  partnerSubmitting,
  partnerSuccess,
  handlePartnerSubmit,
}: EditorialHomePageProps): React.JSX.Element {
  return (
    <div className="bg-[#F5F0E8] text-[#1A1510] min-h-screen pb-20 selection:bg-[#C5A55A]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <section className="pt-12 sm:pt-16 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#8B7355] border-b border-[#8B7355] pb-1">
                  Vol. I — 2026 Edition · Toshkent, Oʻzbekiston
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="text-4xl sm:text-6xl md:text-7xl font-black leading-[0.92] tracking-tight text-[#1A1510]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <span>{t('heroTitleLine1')}</span>
                <br />
                <span className="relative inline-block text-[#8B7355]">
                  {t('heroTitleLine2')}
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#C5A55A]" />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-lg sm:text-xl leading-relaxed text-[#4A3F30] max-w-xl italic"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {t('heroSubtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link href="/discover">
                  <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1A1510] text-[#F5F0E8] font-sans text-xs font-bold tracking-widest uppercase hover:bg-[#332B24] transition-all cursor-pointer">
                    <span>{t('findGameBtn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <a href="#editorial-how">
                  <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-[#1A1510] border border-[#1A1510] font-sans text-xs font-bold tracking-widest uppercase hover:bg-[#EDE6D5] transition-all cursor-pointer">
                    <span>{t('howItWorksBtn')}</span>
                  </button>
                </a>
              </motion.div>
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-4 border-l-2 border-[#2D2926] pl-6 sm:pl-8 pt-2 space-y-6"
            >
              <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B7355]">
                Gazeta eslatmalari
              </p>
              <div className="space-y-4">
                {[
                  { icon: BookOpen, label: 'Sport jamiyati', val: 'Est. 2026' },
                  { icon: MapPin, label: 'Faol tumanlar', val: '5 ta tuman' },
                  { icon: Users, label: 'Tekshirilgan oʻyinchilar', val: '500+ aʼzo' },
                  { icon: Clock, label: 'Haftalik oʻyinlar', val: '50+ sessiya' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 pb-3 border-b border-[rgba(45,41,38,0.15)]"
                    >
                      <Icon className="w-4 h-4 text-[#8B7355] mt-1 shrink-0" />
                      <div>
                        <div className="font-sans text-[10px] text-[#8B7355] tracking-wider uppercase font-bold">
                          {item.label}
                        </div>
                        <div className="text-base font-bold text-[#1A1510] mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
                          {item.val}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.aside>
          </div>
        </section>

        <EditorialDivider label="§ I — Ishlash tamoyili" />

        <section id="editorial-how" className="pb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 md:sticky md:top-24 space-y-2">
              <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-[#8B7355]">
                Tartib
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1510] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                {t('howItWorksTitle')}
              </h2>
              <p className="text-sm font-sans text-[#4A3F30] leading-relaxed">
                {t('howItWorksSubtitle')}
              </p>
            </div>

            <div className="md:col-span-8 divide-y divide-[rgba(45,41,38,0.2)]">
              {[
                { num: '01', title: t('step1Title'), desc: t('step1Desc'), tag: '#Chilonzor #Yunusobod' },
                { num: '02', title: t('step2Title'), desc: t('step2Desc'), tag: 'Adolatli UZS narx' },
                { num: '03', title: t('step3Title'), desc: t('step3Desc'), tag: 'Doʻstona jamoa kutmoqda' },
              ].map((step) => (
                <div key={step.num} className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-8 items-start">
                  <div className="sm:col-span-2 font-sans text-xs font-bold tracking-widest text-[#8B7355]">
                    {step.num}
                  </div>
                  <div className="sm:col-span-10 space-y-2">
                    <h3 className="text-xl font-bold text-[#1A1510]" style={{ fontFamily: 'Georgia, serif' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#4A3F30] leading-relaxed">
                      {step.desc}
                    </p>
                    <span className="inline-block font-sans text-[10px] font-bold tracking-wider uppercase text-[#C5A55A] pt-1">
                      {step.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <EditorialDivider label="§ II — Sport turlari katalogi" />

        <section className="pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgba(45,41,38,0.25)] border border-[rgba(45,41,38,0.25)]">
            {[
              { href: '/discover?sport=table-tennis', emoji: '🏓', label: t('tableTennis'), status: 'Faol', note: 'Eng ommabop' },
              { href: '/discover?sport=basketball-3x3', emoji: '🏀', label: t('basketball'), status: 'Faol', note: 'Ochiq & yopiq' },
              { href: '#', emoji: '🏸', label: t('badminton'), status: 'Yaqinda', note: 'Tez kunda' },
              { href: '#', emoji: '🏐', label: t('volleyball'), status: 'Yaqinda', note: 'Tez kunda' },
            ].map((sport) => (
              <Link key={sport.label} href={sport.href}>
                <div className="bg-[#F5F0E8] hover:bg-[#EDE6D5] p-6 sm:p-8 transition-colors h-full flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-4">{sport.emoji}</div>
                    <h4 className="text-lg font-bold text-[#1A1510] mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                      {sport.label}
                    </h4>
                    <span className="font-sans text-[10px] font-bold tracking-wider uppercase text-[#8B7355]">
                      {sport.status}
                    </span>
                  </div>
                  <span className="font-sans text-xs text-[#8B7355] mt-4 pt-3 border-t border-[rgba(45,41,38,0.1)] block">
                    {sport.note}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {upcomingSessions.length > 0 && (
          <>
            <EditorialDivider label="§ III — Jonli sessiyalar" />
            <section className="pb-16 space-y-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1510]" style={{ fontFamily: 'Georgia, serif' }}>
                  {t('upcomingGamesTitle')}
                </h2>
                <Link href="/discover" className="font-sans text-xs font-bold tracking-wider uppercase text-[#8B7355] hover:text-[#1A1510] flex items-center gap-1">
                  <span>Barchasini koʻrish</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(45,41,38,0.25)] border border-[rgba(45,41,38,0.25)]">
                {upcomingSessions.map((session) => {
                  const dateObj = new Date(session.scheduledAt);
                  const formattedDate = !isNaN(dateObj.getTime())
                    ? format(dateObj, 'EEE, d MMM · HH:mm')
                    : session.scheduledAt;
                  const fillPercent = Math.min(100, Math.round((session.bookedSlots / session.maxSlots) * 100));

                  return (
                    <div key={session.id} className="bg-[#F5F0E8] hover:bg-[#EDE6D5] p-6 transition-colors flex flex-col justify-between gap-6">
                      <div className="space-y-3">
                        <div className="font-sans text-[10px] font-bold tracking-widest uppercase text-[#C5A55A]">
                          {session.sport.name} · {session.venue.district}
                        </div>
                        <h3 className="text-lg font-bold text-[#1A1510] line-clamp-1" style={{ fontFamily: 'Georgia, serif' }}>
                          {session.title}
                        </h3>
                        <div className="font-sans text-xs text-[#4A3F30] flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#8B7355]" />
                          <span className="truncate">{session.venue.name}</span>
                        </div>
                        <div className="font-sans text-xs text-[#4A3F30] flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#8B7355]" />
                          <span suppressHydrationWarning>{formattedDate} ({session.durationMinutes} min)</span>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-[rgba(45,41,38,0.15)]">
                        <div className="space-y-1">
                          <div className="flex justify-between font-sans text-[11px] text-[#8B7355]">
                            <span>{session.bookedSlots}/{session.maxSlots} oʻyinchi</span>
                            <span>{fillPercent}% toʻlgan</span>
                          </div>
                          <div className="w-full h-1 bg-[rgba(45,41,38,0.15)] overflow-hidden">
                            <div className="h-full bg-[#1A1510]" style={{ width: `${fillPercent}%` }} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-sans text-[10px] uppercase tracking-wider text-[#8B7355] block">
                              Joy narxi
                            </span>
                            <span className="text-base font-bold text-[#1A1510]" style={{ fontFamily: 'Georgia, serif' }}>
                              {session.pricePerSlot.toLocaleString()} UZS
                            </span>
                          </div>
                          <Link href={`/sessions/${session.id}`}>
                            <button className="px-4 py-2 bg-[#1A1510] text-[#F5F0E8] font-sans text-xs font-bold tracking-widest uppercase hover:bg-[#332B24] transition-all cursor-pointer">
                              Band qilish
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        <EditorialDivider label="§ IV — Nega Pley?" />

        <section className="pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t-2 border-[#2D2926] pt-8">
            {[
              { num: 'I', title: t('whyPley1Title'), desc: t('whyPley1Desc') },
              { num: 'II', title: t('whyPley2Title'), desc: t('whyPley2Desc') },
              { num: 'III', title: t('whyPley3Title'), desc: t('whyPley3Desc') },
            ].map((item) => (
              <div key={item.num} className="space-y-3">
                <span className="font-sans text-xs font-bold tracking-[0.25em] text-[#8B7355] block uppercase">
                  Qism {item.num}
                </span>
                <h3 className="text-xl font-bold text-[#1A1510]" style={{ fontFamily: 'Georgia, serif' }}>
                  {item.title}
                </h3>
                <p className="text-sm text-[#4A3F30] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <EditorialDivider label="§ V — Zallar uchun hamkorlik" />

        <section id="venue-partner" className="pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-3xl font-extrabold text-[#1A1510]" style={{ fontFamily: 'Georgia, serif' }}>
                {t('venuePartnerTitle')}
              </h2>
              <p className="text-sm text-[#4A3F30] leading-relaxed italic" style={{ fontFamily: 'Georgia, serif' }}>
                {t('venuePartnerSubtitle')}
              </p>
              <div className="p-6 bg-[#EDE6D5] border border-[rgba(45,41,38,0.25)] space-y-3 font-sans text-xs text-[#2D2926]">
                <div className="font-bold uppercase tracking-wider text-[#8B7355] text-[10px]">
                  Hamkorlik afzalliklari
                </div>
                <div className="space-y-2">
                  <div>— Boʻsh vaqt slotlarini faol oʻyinchilar bilan toʻldirish</div>
                  <div>— Har bir band qilish boʻyicha tezkor xabarnomalar</div>
                  <div>— Boshlangʻich toʻlovlarsiz erkin roʻyxatdan oʻtish</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#EDE6D5] border-[1.5px] border-[#2D2926] p-6 sm:p-8">
              {partnerSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <Trophy className="w-10 h-10 mx-auto text-[#8B7355]" />
                  <h3 className="text-xl font-bold text-[#1A1510]" style={{ fontFamily: 'Georgia, serif' }}>
                    Arizangiz qabul qilindi!
                  </h3>
                  <p className="font-sans text-xs text-[#4A3F30]">
                    Tez orada mutaxassisimiz siz bilan bogʻlanadi va zalni platformaga ulaymiz.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePartnerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                        Ismingiz
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerForm.contactName}
                        onChange={(e) => setPartnerForm({ ...partnerForm, contactName: e.target.value })}
                        placeholder="Masalan, Alisher"
                        className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[rgba(45,41,38,0.3)] font-sans text-sm outline-none focus:border-[#1A1510]"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                        Telefon raqam
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerForm.phone}
                        onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                        placeholder="+998 90 123 45 67"
                        className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[rgba(45,41,38,0.3)] font-sans text-sm outline-none focus:border-[#1A1510]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                        Zal nomi
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerForm.venueName}
                        onChange={(e) => setPartnerForm({ ...partnerForm, venueName: e.target.value })}
                        placeholder="Masalan, Arena Club"
                        className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[rgba(45,41,38,0.3)] font-sans text-sm outline-none focus:border-[#1A1510]"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                        Tuman
                      </label>
                      <select
                        value={partnerForm.district}
                        onChange={(e) => setPartnerForm({ ...partnerForm, district: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[rgba(45,41,38,0.3)] font-sans text-sm outline-none focus:border-[#1A1510]"
                      >
                        <option value="Yunusobod">Yunusobod tumani</option>
                        <option value="Chilonzor">Chilonzor tumani</option>
                        <option value="Mirzo Ulugʻbek">Mirzo Ulugʻbek tumani</option>
                        <option value="Yakkasaroy">Yakkasaroy tumani</option>
                        <option value="Mirobod">Mirobod tumani</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                      Sport turlari
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerForm.sportTypes}
                      onChange={(e) => setPartnerForm({ ...partnerForm, sportTypes: e.target.value })}
                      placeholder="Stol tennisi, Basketbol, Badminton..."
                      className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[rgba(45,41,38,0.3)] font-sans text-sm outline-none focus:border-[#1A1510]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={partnerSubmitting}
                    className="w-full py-3.5 bg-[#1A1510] text-[#F5F0E8] font-sans text-xs font-bold tracking-widest uppercase hover:bg-[#332B24] disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {partnerSubmitting ? 'Yuborilmoqda...' : t('venuePartnerBtn')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function EditorialDivider({ label }: { label: string }): React.JSX.Element {
  return (
    <div className="flex items-center gap-6 my-12">
      <div className="flex-1 h-px bg-[rgba(45,41,38,0.2)]" />
      <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B7355] whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-[rgba(45,41,38,0.2)]" />
    </div>
  );
}

