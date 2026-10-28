'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { SessionItem } from '../../lib/types';
import { TranslationKey } from '../../lib/i18n/translations';
import { TurnstileWidget } from '../auth/TurnstileWidget';
import {
  ArrowRight,
  MapPin,
  Clock,
  Users,
  Zap,
  Sparkles,
  Trophy,
  Activity,
  Flame,
} from 'lucide-react';
import { format } from 'date-fns';

export interface KineticHomePageProps {
  t: (key: TranslationKey) => string;
  upcomingSessions: SessionItem[];
  partnerForm: {
    contactName: string;
    phone: string;
    venueName: string;
    district: string;
    sportTypes: string;
    message: string;
    turnstileToken: string;
  };
  setPartnerForm: React.Dispatch<
    React.SetStateAction<{
      contactName: string;
      phone: string;
      venueName: string;
      district: string;
      sportTypes: string;
      message: string;
      turnstileToken: string;
    }>
  >;
  partnerSubmitting: boolean;
  partnerSuccess: boolean;
  handlePartnerSubmit: (e: React.FormEvent) => Promise<void>;
}

function KineticFloatingBlobs(): React.JSX.Element {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[
        { x: '12%', y: '15%', size: 480, color: 'rgba(118,85,247,0.18)', dur: 18 },
        { x: '72%', y: '45%', size: 420, color: 'rgba(92,200,255,0.12)', dur: 22 },
        { x: '35%', y: '75%', size: 380, color: 'rgba(200,255,0,0.10)', dur: 25 },
        { x: '85%', y: '10%', size: 320, color: 'rgba(255,107,82,0.08)', dur: 20 },
      ].map((blob, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 25, -20, 15, 0],
            y: [0, -25, 20, -15, 0],
            scale: [1, 1.06, 0.96, 1.04, 1],
          }}
          transition={{
            duration: blob.dur,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: blob.color,
            filter: 'blur(90px)',
          }}
        />
      ))}
    </div>
  );
}

function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 260, damping: 25 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 260, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    rotateY.set(deltaX * 5);
    rotateX.set(-deltaY * 5);
    x.set(deltaX * 3);
    y.set(deltaY * 3);
  };

  const handleMouseLeave = (): void => {
    rotateX.set(0);
    rotateY.set(0);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function KineticHomePage({
  t,
  upcomingSessions,
  partnerForm,
  setPartnerForm,
  partnerSubmitting,
  partnerSuccess,
  handlePartnerSubmit,
}: KineticHomePageProps): React.JSX.Element {
  return (
    <div className="relative min-h-screen text-[#F0EDFF] pb-20">
      <KineticFloatingBlobs />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-16 space-y-20 sm:space-y-28">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(118,85,247,0.15)] border border-[rgba(155,125,255,0.4)] text-[#C8FF00] text-xs font-extrabold uppercase tracking-widest shadow-[0_0_20px_rgba(118,85,247,0.3)]"
            >
              <Zap className="w-3.5 h-3.5 text-[#C8FF00]" />
              <span>{t('brandTagline')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95]"
            >
              <span className="text-[#F0EDFF]">{t('heroTitleLine1')}</span>
              <br />
              <span className="shimmer-text">
                {t('heroTitleLine2')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl font-medium text-[#8B80C8] max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link href="/discover" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(118,85,247,0.6)' }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7655F7] via-[#9B7DFF] to-[#7655F7] text-white text-base font-extrabold shadow-[0_0_25px_rgba(118,85,247,0.4)] border border-[rgba(255,255,255,0.2)] cursor-pointer"
                >
                  <span>{t('findGameBtn')}</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </motion.button>
              </Link>
              <a href="#kinetic-how" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[rgba(16,16,30,0.8)] text-[#C8C0F0] hover:text-[#F0EDFF] text-base font-bold border border-[rgba(118,85,247,0.3)] hover:border-[rgba(155,125,255,0.6)] cursor-pointer backdrop-blur-xl"
                >
                  <span>{t('howItWorksBtn')}</span>
                </motion.button>
              </a>
            </motion.div>

            <div className="grid grid-cols-3 gap-3 pt-4 max-w-md mx-auto lg:mx-0">
              {[
                { label: 'Oʻyinchilar', value: '500+' },
                { label: 'Zallar', value: '12+' },
                { label: 'Sessiyalar', value: '50+' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-2xl bg-[rgba(16,16,30,0.6)] border border-[rgba(118,85,247,0.25)] text-center backdrop-blur-md"
                >
                  <div className="text-xl font-black text-[#C8FF00]">{stat.value}</div>
                  <div className="text-[10px] font-bold text-[#8B80C8] uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <TiltCard className="p-6 rounded-3xl bg-[rgba(16,16,30,0.7)] border border-[rgba(118,85,247,0.35)] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(118,85,247,0.2)]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#C8FF00] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C8FF00]">
                    Toshkent Jonli Rejim
                  </span>
                </div>
                <Flame className="w-4 h-4 text-[#FF6B52]" />
              </div>
              <div className="py-4 space-y-3">
                <div className="text-2xl font-black text-[#F0EDFF]">
                  Stol tennisi & 3x3 Basketbol
                </div>
                <p className="text-xs text-[#8B80C8] leading-relaxed">
                  Chilonzor va Yunusobod zallarida boʻsh oʻrinlar soni cheklangan. Jamoa yigʻish shart emas — shunchaki bitta oʻrningizni band qiling.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-[#9B7DFF]">18:00 - 22:00 Har kuni</span>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[rgba(200,255,0,0.15)] text-[#C8FF00] border border-[rgba(200,255,0,0.3)]">
                  Faol
                </span>
              </div>
            </TiltCard>

            <div className="grid grid-cols-2 gap-4">
              <TiltCard className="p-4 rounded-2xl bg-[rgba(16,16,30,0.5)] border border-[rgba(118,85,247,0.25)] backdrop-blur-xl">
                <div className="text-3xl mb-1">🏓</div>
                <div className="text-sm font-black text-[#F0EDFF]">{t('tableTennis')}</div>
                <div className="text-[10px] text-[#8B80C8] font-semibold mt-1">4 ta ochiq zal</div>
              </TiltCard>
              <TiltCard className="p-4 rounded-2xl bg-[rgba(16,16,30,0.5)] border border-[rgba(118,85,247,0.25)] backdrop-blur-xl">
                <div className="text-3xl mb-1">🏀</div>
                <div className="text-sm font-black text-[#F0EDFF]">{t('basketball')}</div>
                <div className="text-[10px] text-[#8B80C8] font-semibold mt-1">3 ta maydon</div>
              </TiltCard>
            </div>
          </div>
        </section>

        <section id="kinetic-how" className="space-y-8">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(118,85,247,0.15)] text-[#C8FF00] text-xs font-black uppercase tracking-wider border border-[rgba(118,85,247,0.3)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Oqim</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F0EDFF] tracking-tight">
              {t('howItWorksTitle')}
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#8B80C8]">
              {t('howItWorksSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', title: t('step1Title'), desc: t('step1Desc'), color: '#9B7DFF' },
              { num: '02', title: t('step2Title'), desc: t('step2Desc'), color: '#C8FF00' },
              { num: '03', title: t('step3Title'), desc: t('step3Desc'), color: '#5CC8FF' },
            ].map((step) => (
              <TiltCard
                key={step.num}
                className="p-8 rounded-3xl bg-[rgba(16,16,30,0.7)] border border-[rgba(118,85,247,0.25)] backdrop-blur-xl hover:border-[rgba(155,125,255,0.6)] transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl"
                    style={{
                      background: `rgba(118,85,247,0.2)`,
                      color: step.color,
                      border: `1px solid ${step.color}50`,
                    }}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-xl font-black text-[#F0EDFF]">{step.title}</h3>
                  <p className="text-sm font-medium text-[#8B80C8] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[rgba(118,85,247,0.15)] flex items-center gap-2 text-xs font-bold text-[#8B80C8]">
                  <Activity className="w-3.5 h-3.5" style={{ color: step.color }} />
                  <span>Avtomatlashtirilgan jarayon</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {upcomingSessions.length > 0 && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(255,107,82,0.15)] text-[#FF6B52] text-xs font-bold uppercase tracking-wider border border-[rgba(255,107,82,0.3)] mb-2">
                  <span>Jonli slotlar</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#F0EDFF]">
                  {t('upcomingGamesTitle')}
                </h2>
              </div>
              <Link href="/discover">
                <button className="px-5 py-2.5 rounded-full bg-[rgba(118,85,247,0.18)] hover:bg-[rgba(118,85,247,0.3)] border border-[rgba(155,125,255,0.4)] text-xs font-extrabold text-[#F0EDFF] transition-all flex items-center gap-2">
                  <span>Barchasini koʻrish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingSessions.map((session) => {
                const dateObj = new Date(session.scheduledAt);
                const formattedDate = !isNaN(dateObj.getTime())
                  ? format(dateObj, 'EEE, d MMM · HH:mm')
                  : session.scheduledAt;

                const isFull = session.remainingSlots <= 0;
                const fillPercent = Math.min(100, Math.round((session.bookedSlots / session.maxSlots) * 100));

                return (
                  <TiltCard
                    key={session.id}
                    className="p-6 rounded-3xl bg-[rgba(16,16,30,0.8)] border border-[rgba(118,85,247,0.3)] backdrop-blur-xl flex flex-col justify-between gap-5 hover:border-[rgba(155,125,255,0.6)] hover:shadow-[0_0_30px_rgba(118,85,247,0.25)] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-[rgba(118,85,247,0.25)] text-[#C8FF00] border border-[rgba(118,85,247,0.4)] text-xs font-black uppercase">
                          {session.sport.name}
                        </span>
                        <span className="text-xs font-bold text-[#8B80C8]">
                          {session.skillLevel}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-[#F0EDFF] line-clamp-1">
                        {session.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-[#8B80C8] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#9B7DFF]" />
                        <span className="truncate">{session.venue.name} · {session.venue.district}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold text-[#C8C0F0] bg-[rgba(118,85,247,0.1)] p-2.5 rounded-xl border border-[rgba(118,85,247,0.2)]">
                        <Clock className="w-3.5 h-3.5 text-[#C8FF00]" />
                        <span suppressHydrationWarning>{formattedDate} ({session.durationMinutes}m)</span>
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-xs font-bold text-[#8B80C8]">
                          <span>{session.bookedSlots}/{session.maxSlots} oʻyinchi</span>
                          <span className={session.remainingSlots <= 2 ? 'text-[#FF6B52]' : 'text-[#C8FF00]'}>
                            {session.remainingSlots} ta joy
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[rgba(118,85,247,0.15)] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${fillPercent}%`,
                              background: fillPercent >= 85 ? '#FF6B52' : '#C8FF00',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[rgba(118,85,247,0.2)] flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#8B80C8]">Joy narxi</div>
                        <div className="text-base font-black text-[#F0EDFF]">
                          {session.pricePerSlot.toLocaleString()} UZS
                        </div>
                      </div>
                      <Link href={`/sessions/${session.id}`}>
                        <button
                          disabled={isFull}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7655F7] to-[#9B7DFF] text-white text-xs font-black hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer shadow-[0_0_15px_rgba(118,85,247,0.3)]"
                        >
                          {isFull ? 'Toʻlgan' : 'Band qilish'}
                        </button>
                      </Link>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </section>
        )}

        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[rgba(118,85,247,0.25)] via-[rgba(16,16,30,0.8)] to-[rgba(7,7,15,0.9)] border border-[rgba(118,85,247,0.35)] backdrop-blur-2xl space-y-6">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-[#F0EDFF]">
              {t('whyPleyTitle')}
            </h2>
            <p className="text-sm text-[#8B80C8]">
              Biz doʻstlar yigʻish muammosini hal qildik. Istalgan sportni tanlang va qolganini platformaga topshiring.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              { title: t('whyPley1Title'), desc: t('whyPley1Desc'), icon: Users, color: '#C8FF00' },
              { title: t('whyPley2Title'), desc: t('whyPley2Desc'), icon: Zap, color: '#9B7DFF' },
              { title: t('whyPley3Title'), desc: t('whyPley3Desc'), icon: Sparkles, color: '#5CC8FF' },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-5 rounded-2xl bg-[rgba(16,16,30,0.7)] border border-[rgba(118,85,247,0.25)] space-y-2"
                >
                  <Icon className="w-5 h-5" style={{ color: feature.color }} />
                  <h4 className="text-sm font-black text-[#F0EDFF]">{feature.title}</h4>
                  <p className="text-xs text-[#8B80C8] leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="venue-partner" className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-[rgba(16,16,30,0.85)] border border-[rgba(118,85,247,0.35)] backdrop-blur-2xl">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgba(200,255,0,0.15)] text-[#C8FF00] text-xs font-black uppercase tracking-wider border border-[rgba(200,255,0,0.3)]">
              <span>Zallar uchun</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F0EDFF]">
              {t('venuePartnerTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#8B80C8]">
              {t('venuePartnerSubtitle')}
            </p>
          </div>

          {partnerSuccess ? (
            <div className="bg-[rgba(118,85,247,0.2)] border border-[rgba(155,125,255,0.4)] rounded-2xl p-6 text-center space-y-2">
              <Trophy className="w-8 h-8 mx-auto text-[#C8FF00]" />
              <h3 className="text-lg font-black text-[#F0EDFF]">
                Arizangiz qabul qilindi!
              </h3>
              <p className="text-xs text-[#8B80C8]">
                Tez orada mutaxassisimiz siz bilan bogʻlanadi va zalni platformaga ulaymiz.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8B80C8] uppercase tracking-wider mb-1">
                    Ismingiz
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.contactName}
                    onChange={(e) =>
                      setPartnerForm({ ...partnerForm, contactName: e.target.value })
                    }
                    placeholder="Masalan, Alisher"
                    className="w-full px-4 py-3 rounded-xl border border-[rgba(118,85,247,0.3)] bg-[rgba(7,7,15,0.7)] text-[#F0EDFF] placeholder-[#5A5488] font-medium text-sm outline-none focus:border-[#C8FF00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B80C8] uppercase tracking-wider mb-1">
                    Telefon raqam
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.phone}
                    onChange={(e) =>
                      setPartnerForm({ ...partnerForm, phone: e.target.value })
                    }
                    placeholder="+998 90 123 45 67"
                    className="w-full px-4 py-3 rounded-xl border border-[rgba(118,85,247,0.3)] bg-[rgba(7,7,15,0.7)] text-[#F0EDFF] placeholder-[#5A5488] font-medium text-sm outline-none focus:border-[#C8FF00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8B80C8] uppercase tracking-wider mb-1">
                    Zal nomi
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.venueName}
                    onChange={(e) =>
                      setPartnerForm({ ...partnerForm, venueName: e.target.value })
                    }
                    placeholder="Masalan, Arena Club"
                    className="w-full px-4 py-3 rounded-xl border border-[rgba(118,85,247,0.3)] bg-[rgba(7,7,15,0.7)] text-[#F0EDFF] placeholder-[#5A5488] font-medium text-sm outline-none focus:border-[#C8FF00]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B80C8] uppercase tracking-wider mb-1">
                    Tuman
                  </label>
                  <select
                    value={partnerForm.district}
                    onChange={(e) =>
                      setPartnerForm({ ...partnerForm, district: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[rgba(118,85,247,0.3)] bg-[#07070F] text-[#F0EDFF] font-medium text-sm outline-none focus:border-[#C8FF00]"
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
                <label className="block text-xs font-bold text-[#8B80C8] uppercase tracking-wider mb-1">
                  Sport turlari
                </label>
                <input
                  type="text"
                  required
                  value={partnerForm.sportTypes}
                  onChange={(e) =>
                    setPartnerForm({ ...partnerForm, sportTypes: e.target.value })
                  }
                  placeholder="Stol tennisi, Basketbol, Badminton..."
                  className="w-full px-4 py-3 rounded-xl border border-[rgba(118,85,247,0.3)] bg-[rgba(7,7,15,0.7)] text-[#F0EDFF] placeholder-[#5A5488] font-medium text-sm outline-none focus:border-[#C8FF00]"
                />
              </div>

              <TurnstileWidget
                onVerify={(token) =>
                  setPartnerForm((prev) => ({ ...prev, turnstileToken: token }))
                }
              />

              <button
                type="submit"
                disabled={partnerSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7655F7] via-[#9B7DFF] to-[#7655F7] text-white text-sm font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(118,85,247,0.4)] hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {partnerSubmitting ? 'Yuborilmoqda...' : t('venuePartnerBtn')}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

