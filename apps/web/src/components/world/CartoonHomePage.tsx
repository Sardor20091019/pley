'use client';

import React from 'react';
import Link from 'next/link';
import { SessionItem } from '../../lib/types';
import { TranslationKey } from '../../lib/i18n/translations';
import { SportsHeroIllustration } from '../illustrations/SportsHeroIllustration';
import { SessionCard } from '../session/SessionCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import {
  ArrowRight,
  Users,
  Wallet,
  Smile,
  CheckCircle2,
  Trophy,
} from 'lucide-react';

export interface CartoonHomePageProps {
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

export function CartoonHomePage({
  t,
  upcomingSessions,
  partnerForm,
  setPartnerForm,
  partnerSubmitting,
  partnerSuccess,
  handlePartnerSubmit,
}: CartoonHomePageProps): React.JSX.Element {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <section className="relative px-4 sm:px-8 pt-8 sm:pt-16 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#D7FF64] border-2 border-[#242424] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#242424]">
              <span>{t('brandTagline')}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] text-[#242424]">
              <span>{t('heroTitleLine1')}</span>
              <br />
              <span className="text-[#7655F7] underline decoration-[#D7FF64] decoration-8 underline-offset-4">
                {t('heroTitleLine2')}
              </span>
            </h1>

            <p className="text-base sm:text-xl font-medium text-[#4A4A4A] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/discover" className="w-full sm:w-auto">
                <Button size="lg" variant="lime" fullWidth className="text-lg">
                  <span>{t('findGameBtn')}</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="white" fullWidth className="text-lg">
                  <span>{t('howItWorksBtn')}</span>
                </Button>
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-xs font-bold text-[#666666]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7655F7]" />
                <span>{t('singleSpotPrice')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7655F7]" />
                <span>{t('verifiedVenues')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#7655F7]" />
                <span>{t('realPlayers')}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center">
            <SportsHeroIllustration />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <Badge variant="purple" size="md">
            {t('simpleAndEasy')}
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-[#242424]">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-base sm:text-lg font-medium text-[#666666] max-w-xl mx-auto">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <Card
            variant="cream"
            className="flex flex-col justify-between space-y-4 hover:border-[#7655F7] transition-all"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#D7FF64] border-2 border-[#242424] shadow-[3px_3px_0px_#242424] flex items-center justify-center font-black text-2xl text-[#242424]">
                1
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#242424]">
                {t('step1Title')}
              </h3>
              <p className="text-sm font-medium text-[#555555] leading-relaxed">
                {t('step1Desc')}
              </p>
            </div>
            <div className="pt-2 text-xs font-black text-[#7655F7]">
              #Chilonzor #Yunusobod
            </div>
          </Card>

          <Card
            variant="cream"
            className="flex flex-col justify-between space-y-4 hover:border-[#7655F7] transition-all"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#7655F7] text-white border-2 border-[#242424] shadow-[3px_3px_0px_#242424] flex items-center justify-center font-black text-2xl">
                2
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#242424]">
                {t('step2Title')}
              </h3>
              <p className="text-sm font-medium text-[#555555] leading-relaxed">
                {t('step2Desc')}
              </p>
            </div>
            <div className="pt-2 text-xs font-black text-[#7655F7]">
              {t('fairUzsPrice')}
            </div>
          </Card>

          <Card
            variant="cream"
            className="flex flex-col justify-between space-y-4 hover:border-[#7655F7] transition-all"
          >
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FF795D] text-white border-2 border-[#242424] shadow-[3px_3px_0px_#242424] flex items-center justify-center font-black text-2xl">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#242424]">
                {t('step3Title')}
              </h3>
              <p className="text-sm font-medium text-[#555555] leading-relaxed">
                {t('step3Desc')}
              </p>
            </div>
            <div className="pt-2 text-xs font-black text-[#7655F7]">
              {t('friendlyTeamAwaits')}
            </div>
          </Card>
        </div>
      </section>

      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <Badge variant="lime" size="md">
            {t('activities')}
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-[#242424]">
            {t('exploreSportsTitle')}
          </h2>
          <p className="text-base sm:text-lg font-medium text-[#666666] max-w-xl mx-auto">
            {t('exploreSportsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Link href="/discover?sport=table-tennis">
            <Card
              variant="white"
              interactive
              className="text-center space-y-3 hover:bg-[#D7FF64] transition-colors"
            >
              <div className="text-4xl sm:text-5xl">🏓</div>
              <h4 className="text-base sm:text-lg font-black text-[#242424]">
                {t('tableTennis')}
              </h4>
              <Badge variant="purple" size="sm">
                {t('active')}
              </Badge>
            </Card>
          </Link>

          <Link href="/discover?sport=basketball-3x3">
            <Card
              variant="white"
              interactive
              className="text-center space-y-3 hover:bg-[#FF795D] hover:text-white transition-colors"
            >
              <div className="text-4xl sm:text-5xl">🏀</div>
              <h4 className="text-base sm:text-lg font-black">
                {t('basketball')}
              </h4>
              <Badge variant="coral" size="sm">
                {t('active')}
              </Badge>
            </Card>
          </Link>

          <Card
            variant="cream"
            className="text-center space-y-3 opacity-80"
          >
            <div className="text-4xl sm:text-5xl">🏸</div>
            <h4 className="text-base sm:text-lg font-black text-[#242424]">
              {t('badminton')}
            </h4>
            <span className="text-[11px] font-bold text-[#888888] block">
              {t('comingSoon')}
            </span>
          </Card>

          <Card
            variant="cream"
            className="text-center space-y-3 opacity-80"
          >
            <div className="text-4xl sm:text-5xl">🏐</div>
            <h4 className="text-base sm:text-lg font-black text-[#242424]">
              {t('volleyball')}
            </h4>
            <span className="text-[11px] font-bold text-[#888888] block">
              {t('comingSoon')}
            </span>
          </Card>
        </div>
      </section>

      {upcomingSessions.length > 0 && (
        <section className="px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <Badge variant="coral" size="md">
                {t('liveSessions')}
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-black text-[#242424] mt-2">
                {t('upcomingGamesTitle')}
              </h2>
            </div>
            <Link href="/discover">
              <Button variant="white" size="sm">
                <span>{t('viewAll')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </section>
      )}

      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-[#7655F7] border-[3px] border-[#242424] rounded-4xl p-8 sm:p-14 text-white shadow-[8px_8px_0px_#242424]">
          <div className="max-w-3xl space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              {t('whyPleyTitle')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2 bg-[#5e3ed4] p-5 rounded-2xl border-2 border-[#242424]">
                <div className="w-10 h-10 rounded-xl bg-[#D7FF64] text-[#242424] flex items-center justify-center font-black">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-black text-white">
                  {t('whyPley1Title')}
                </h4>
                <p className="text-xs text-[#E0D8FF] leading-relaxed">
                  {t('whyPley1Desc')}
                </p>
              </div>

              <div className="space-y-2 bg-[#5e3ed4] p-5 rounded-2xl border-2 border-[#242424]">
                <div className="w-10 h-10 rounded-xl bg-[#FF795D] text-white flex items-center justify-center font-black">
                  <Wallet className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-black text-white">
                  {t('whyPley2Title')}
                </h4>
                <p className="text-xs text-[#E0D8FF] leading-relaxed">
                  {t('whyPley2Desc')}
                </p>
              </div>

              <div className="space-y-2 bg-[#5e3ed4] p-5 rounded-2xl border-2 border-[#242424]">
                <div className="w-10 h-10 rounded-xl bg-[#78D8FF] text-[#242424] flex items-center justify-center font-black">
                  <Smile className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-black text-white">
                  {t('whyPley3Title')}
                </h4>
                <p className="text-xs text-[#E0D8FF] leading-relaxed">
                  {t('whyPley3Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="venue-partner" className="px-4 sm:px-8 max-w-4xl mx-auto">
        <Card variant="white" className="p-8 sm:p-12 border-[3px]">
          <div className="text-center space-y-3 mb-8">
            <Badge variant="lime" size="md">
              {t('forVenues')}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-[#242424]">
              {t('venuePartnerTitle')}
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#666666]">
              {t('venuePartnerSubtitle')}
            </p>
          </div>

          {partnerSuccess ? (
            <div className="bg-[#D7FF64] border-2 border-[#242424] rounded-2xl p-6 text-center space-y-2 shadow-[4px_4px_0px_#242424]">
              <Trophy className="w-10 h-10 mx-auto text-[#7655F7]" />
              <h3 className="text-xl font-black text-[#242424]">
                {t('partnerSuccessTitle')}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#333333]">
                {t('partnerSuccessSubtitle')}
              </p>
            </div>
          ) : (
            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    {t('partnerNameLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.contactName}
                    onChange={(e) =>
                      setPartnerForm({ ...partnerForm, contactName: e.target.value })
                    }
                    placeholder="Masalan, Alisher"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] font-semibold text-sm outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    {t('partnerPhoneLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.phone}
                    onChange={(e) =>
                      setPartnerForm({ ...partnerForm, phone: e.target.value })
                    }
                    placeholder="+998 90 123 45 67"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] font-semibold text-sm outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    {t('partnerVenueNameLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerForm.venueName}
                    onChange={(e) =>
                      setPartnerForm({ ...partnerForm, venueName: e.target.value })
                    }
                    placeholder="Masalan, Arena Club"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] font-semibold text-sm outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    {t('partnerDistrictLabel')}
                  </label>
                  <select
                    value={partnerForm.district}
                    onChange={(e) =>
                      setPartnerForm({ ...partnerForm, district: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] font-bold text-sm outline-none focus:bg-white"
                  >
                    <option value="Yunusobod">Yunusobod</option>
                    <option value="Chilonzor">Chilonzor</option>
                    <option value="Mirzo Ulugʻbek">Mirzo Ulugʻbek</option>
                    <option value="Yakkasaroy">Yakkasaroy</option>
                    <option value="Mirobod">Mirobod</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                  {t('partnerSportLabel')}
                </label>
                <input
                  type="text"
                  required
                  value={partnerForm.sportTypes}
                  onChange={(e) =>
                    setPartnerForm({ ...partnerForm, sportTypes: e.target.value })
                  }
                  placeholder="Stol tennisi, Basketbol, Badminton..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] font-semibold text-sm outline-none focus:bg-white"
                />
              </div>

              <Button
                type="submit"
                variant="purple"
                size="md"
                fullWidth
                disabled={partnerSubmitting}
                className="mt-2 text-base font-black"
              >
                {partnerSubmitting ? t('partnerSubmittingBtn') : t('partnerSubmitBtn')}
              </Button>
            </form>
          )}
        </Card>
      </section>
    </div>
  );
}

