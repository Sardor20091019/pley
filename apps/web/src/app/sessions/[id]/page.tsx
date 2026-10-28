'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchSessionById, reserveSpot, cancelBooking } from '../../../lib/api';
import { SessionDetail } from '../../../lib/types';
import { useAuth } from '../../../hooks/useAuth';
import { useI18n } from '../../../lib/i18n/useI18n';
import { useAppTheme } from '../../../lib/theme/ThemeContext';
import { useAuthModal } from '../../../lib/auth/AuthModalContext';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { CapacityMeter } from '../../../components/session/CapacityMeter';
import { Mascot } from '../../../components/mascot/Mascot';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Award,
  Scroll,
} from 'lucide-react';
import { format } from 'date-fns';

export default function SessionDetailPage(): React.JSX.Element {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const { user, isAuthenticated } = useAuth();
  const { openLoginModal } = useAuthModal();
  const { t } = useI18n();
  const { theme } = useAppTheme();
  const isEditorial = theme === 'editorial';

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await fetchSessionById(sessionId);
      setSession(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      loadData();
    }
  }, [sessionId]);

  const handleBook = async (): Promise<void> => {
    setActionLoading(true);
    setErrorMessage(null);
    try {
      await reserveSpot(sessionId);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D7FF64', '#7655F7', '#FF795D', '#78D8FF'],
      });
      setSuccessMessage(t('bookingConfirmed'));
      await loadData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Joy band qilishda xatolik yuz berdi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (): Promise<void> => {
    if (!session?.currentUserBookingId) return;
    setActionLoading(true);
    setErrorMessage(null);
    try {
      await cancelBooking(session.currentUserBookingId);
      setSuccessMessage('Bandlik bekor qilindi');
      await loadData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Bekor qilishda xatolik');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = async (): Promise<void> => {
    if (!session) return;
    const shareText = `Pley.uz orqali ${session.sport.name} oʻynashga qoʻshiling! ${session.venue.name} (${session.venue.district}). Joylar soni cheklangan!`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://pley.uz';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: session.title,
          text: shareText,
          url: shareUrl,
        });
      } catch {}
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setSuccessMessage('Havola nusxalandi!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className={`h-96 animate-pulse ${isEditorial ? 'bg-[#EDE6D5] border border-[#2D2926]' : 'bg-white border-2 border-[#242424] rounded-3xl'}`} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        {isEditorial ? (
          <div className="bg-[#EDE6D5] border border-[#2D2926] p-8 space-y-4">
            <Scroll className="w-10 h-10 text-[#8B7355] mx-auto" />
            <h2 className="text-2xl font-bold text-[#1A1510]" style={{ fontFamily: 'Georgia, serif' }}>
              {t('sessionNotFound')}
            </h2>
            <p className="text-xs font-serif italic text-[#8B7355]">
              {t('sessionNotFoundDescEditorial')}
            </p>
            <button
              onClick={() => router.push('/discover')}
              className="px-4 py-2 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926]"
            >
              {t('sessionBackToGames')}
            </button>
          </div>
        ) : (
          <>
            <Mascot size="lg" mood="sleepy" />
            <h2 className="text-2xl font-black text-[#242424]">{t('sessionNotFound')}</h2>
            <Button variant="lime" size="sm" onClick={() => router.push('/discover')}>
              {t('sessionNotFoundDescCartoon')}
            </Button>
          </>
        )}
      </div>
    );
  }

  const dateObj = new Date(session.scheduledAt);
  const formattedDate = !isNaN(dateObj.getTime())
    ? format(dateObj, 'EEEE, d MMMM · HH:mm')
    : session.scheduledAt;

  const isUserBooked = !!session.currentUserBookingStatus;
  const isFull = session.remainingSlots <= 0;

  if (isEditorial) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#2D2926]/30">
          <button
            onClick={() => router.push('/discover')}
            className="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-widest uppercase text-[#8B7355] hover:text-[#1A1510] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('sessionBackToSchedule')}</span>
          </button>

          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
            {t('sessionDossier')} {session.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        {successMessage && (
          <div className="p-4 bg-[#EDE6D5] border-2 border-[#1A1510] text-[#1A1510] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#C5A55A] shrink-0" />
            <div className="text-xs sm:text-sm font-sans font-bold uppercase tracking-wider">
              {successMessage}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-[#F2DDD9] border-2 border-[#8B2E2E] text-[#8B2E2E] flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="text-xs sm:text-sm font-sans font-bold">{errorMessage}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#EDE6D5] border border-[#2D2926] p-6 sm:p-8 shadow-[2px_2px_0px_#8B7355] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#2D2926]/20">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-sans font-extrabold uppercase tracking-widest px-2.5 py-1 bg-[#1A1510] text-[#F5F0E8]">
                    {session.sport.name}
                  </span>
                  <span className="text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 bg-[#F5F0E8] border border-[#2D2926]/40 text-[#8B7355]">
                    {session.skillLevel}
                  </span>
                  <span className="text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 bg-[#F5F0E8] border border-[#2D2926]/40 text-[#8B7355]">
                    {session.sessionVibe}
                  </span>
                </div>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-sans font-bold tracking-widest uppercase border border-[#2D2926] bg-[#F5F0E8] hover:bg-white text-[#1A1510] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('shareGame')}</span>
                </button>
              </div>

              <div>
                <h1
                  className="text-2xl sm:text-4xl font-bold text-[#1A1510]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {session.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-[#8B7355] font-sans mt-2">
                  <MapPin className="w-4 h-4 text-[#1A1510] shrink-0" />
                  <span className="font-semibold">
                    {session.venue.name} · {session.venue.district}
                  </span>
                </div>
                <div className="text-xs text-[#8B7355] font-serif italic pl-6 mt-0.5">
                  {session.venue.address}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F5F0E8] p-4 border border-[#2D2926]/30">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#8B7355]" />
                  <div>
                    <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                      {t('sessionTime')}
                    </div>
                    <div className="text-xs sm:text-sm font-sans font-bold text-[#1A1510]" suppressHydrationWarning>
                      {formattedDate}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#8B7355]" />
                  <div>
                    <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                      {t('sessionDuration')}
                    </div>
                    <div className="text-xs sm:text-sm font-sans font-bold text-[#1A1510]">
                      {session.durationMinutes} min
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                  {t('sessionCapacityState')}
                </div>
                <CapacityMeter
                  maxSlots={session.maxSlots}
                  bookedSlots={session.bookedSlots}
                  remainingSlots={session.remainingSlots}
                  size="lg"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8B7355] border-b border-[#2D2926]/20 pb-1">
                  {t('sessionParticipantsRegistry')} ({session.participants.length} / {session.maxSlots})
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {session.participants.map((player, idx) => (
                    <div
                      key={player.userId}
                      className="flex items-center justify-between p-2.5 bg-[#F5F0E8] border border-[#2D2926]/30"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-sans font-extrabold text-[#8B7355]">
                          № {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-xs font-sans font-bold text-[#1A1510]">
                          {player.firstName}
                        </span>
                      </div>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8B7355]">
                        {player.skillLevel}
                      </span>
                    </div>
                  ))}

                  {Array.from({ length: session.remainingSlots }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 border border-dashed border-[#8B7355]/40 text-[#8B7355] bg-transparent"
                    >
                      <span className="text-[10px] font-sans font-bold">
                        № {String(session.participants.length + i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-sans uppercase tracking-wider font-semibold">
                        {t('sessionEmptySlot')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {session.equipmentDetails && (
                <div className="p-4 bg-[#F5F0E8] border border-[#2D2926]/30 space-y-1">
                  <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                    § {t('equipmentProvided')}
                  </div>
                  <div className="text-xs font-serif text-[#1A1510]">
                    {session.equipmentDetails}
                  </div>
                </div>
              )}

              {session.rulesNotes && (
                <div className="p-4 bg-[#F5F0E8] border border-[#2D2926]/30 space-y-1">
                  <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                    § {t('rulesAndNotes')}
                  </div>
                  <div className="text-xs font-serif text-[#1A1510]">
                    {session.rulesNotes}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#EDE6D5] border-2 border-[#2D2926] p-6 shadow-[3px_3px_0px_#2D2926] space-y-5">
              <div className="text-center pb-3 border-b-2 border-dashed border-[#2D2926]/40">
                <span className="text-[10px] font-sans font-extrabold tracking-widest uppercase text-[#8B7355] block">
                  {t('sessionTicketPass')}
                </span>
                <span
                  className="text-lg font-bold text-[#1A1510]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  PLEY.UZ TICKET PASS
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-sans">
                <div className="flex justify-between text-[#8B7355]">
                  <span>{t('sessionCardPriceLabelEditorial')}</span>
                  <span className="font-bold text-[#1A1510]">
                    {session.pricePerSlot.toLocaleString()} UZS
                  </span>
                </div>
                <div className="flex justify-between text-[#8B7355]">
                  <span>{t('serviceFee')}</span>
                  <span className="font-bold text-[#1A1510]">
                    {session.serviceFee.toLocaleString()} UZS
                  </span>
                </div>
                <div className="pt-2 border-t border-[#2D2926]/20 flex justify-between items-baseline">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A1510]">
                    {t('totalPrice')}
                  </span>
                  <span
                    className="text-2xl font-bold text-[#1A1510]"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {session.totalPrice.toLocaleString()} UZS
                  </span>
                </div>
              </div>

              <div className="pt-2">
                {isUserBooked ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 p-2.5 bg-[#F5F0E8] border border-[#2D2926] text-xs font-sans font-bold uppercase tracking-wider text-[#1A1510]">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A55A]" />
                      <span>{t('sessionAlreadyBooked')}</span>
                    </div>
                    <button
                      onClick={handleCancel}
                      disabled={actionLoading}
                      className="w-full py-2.5 text-xs font-sans font-bold tracking-widest uppercase bg-[#F2DDD9] border border-[#8B2E2E] text-[#8B2E2E] hover:bg-[#E8C5C0] cursor-pointer"
                    >
                      {actionLoading ? t('sessionCancelling') : t('cancelBooking')}
                    </button>
                  </div>
                ) : isFull ? (
                  <button
                    disabled
                    className="w-full py-3 text-xs font-sans font-bold tracking-widest uppercase bg-[#E0D8C7] text-[#8B7355] border border-[#8B7355]/30 cursor-not-allowed"
                  >
                    {t('spotsFull')}
                  </button>
                ) : !isAuthenticated ? (
                  <button
                    onClick={() => openLoginModal(`/sessions/${sessionId}`)}
                    className="w-full py-3 text-xs font-sans font-extrabold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] hover:bg-[#332B24] border border-[#2D2926] transition-all cursor-pointer"
                  >
                    {t('sessionLoginToBook')}
                  </button>
                ) : (
                  <button
                    onClick={handleBook}
                    disabled={actionLoading}
                    className="w-full py-3.5 text-xs font-sans font-extrabold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] hover:bg-[#332B24] border border-[#2D2926] transition-all cursor-pointer"
                  >
                    {actionLoading ? t('sessionBookingProcess') : t('grabSpot')}
                  </button>
                )}
              </div>

              <div className="pt-3 border-t border-[#2D2926]/20 flex items-start gap-2.5 text-[11px] font-sans text-[#8B7355] leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-[#C5A55A] shrink-0 mt-0.5" />
                <span>
                  Oʻyin boshlanishiga kamida {session.cancellationDeadlineHours} soat qolganda jarimasiz bekor qilish kafolatlanadi.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6">
      <button
        onClick={() => router.push('/discover')}
        className="inline-flex items-center gap-1.5 text-xs font-black text-[#242424] hover:text-[#7655F7] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('sessionBackToGames')}</span>
      </button>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#D7FF64] border-2 border-[#242424] shadow-[4px_4px_0px_#242424] flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-[#7655F7] shrink-0" />
          <div className="text-sm font-black text-[#242424]">
            {successMessage}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#FF795D] text-white border-2 border-[#242424] shadow-[4px_4px_0px_#242424] flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div className="text-xs sm:text-sm font-bold">{errorMessage}</div>
        </div>
      )}

      <Card variant="white" className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="md">
              {session.sport.name}
            </Badge>
            <Badge variant="cream" size="md">
              {session.skillLevel}
            </Badge>
            <Badge variant="lime" size="md">
              {session.sessionVibe}
            </Badge>
          </div>

          <Button size="sm" variant="white" onClick={handleShare}>
            <Send className="w-3.5 h-3.5" />
            <span>{t('shareGame')}</span>
          </Button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#242424]">
            {session.title}
          </h1>
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#555555] mt-1.5">
            <MapPin className="w-4 h-4 text-[#7655F7]" />
            <span>
              {session.venue.name} · {session.venue.district}
            </span>
          </div>
          <div className="text-xs text-[#777777] font-medium pl-6">
            {session.venue.address}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FFF9EF] p-4 rounded-2xl border-2 border-[#242424]">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#242424]" />
            <div>
              <div className="text-[11px] font-black uppercase text-[#888888]">
                {t('sessionTime')}
              </div>
              <div className="text-sm font-black text-[#242424]" suppressHydrationWarning>
                {formattedDate}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#242424]" />
            <div>
              <div className="text-[11px] font-black uppercase text-[#888888]">
                {t('sessionDuration')}
              </div>
              <div className="text-sm font-black text-[#242424]">
                {session.durationMinutes} min
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-black uppercase text-[#888888]">
            {t('sessionCapacityState')}
          </div>
          <CapacityMeter
            maxSlots={session.maxSlots}
            bookedSlots={session.bookedSlots}
            remainingSlots={session.remainingSlots}
            size="lg"
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="text-xs font-black uppercase text-[#888888]">
            {t('registeredPlayers')} ({session.participants.length})
          </div>

          <div className="flex flex-wrap gap-2.5">
            {session.participants.map((player) => (
              <div
                key={player.userId}
                className="flex items-center gap-2 bg-[#FFF9EF] border-2 border-[#242424] px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#242424]"
              >
                <div className="w-6 h-6 rounded-full bg-[#D7FF64] border border-[#242424] flex items-center justify-center text-xs font-black">
                  {player.firstName[0]}
                </div>
                <span className="text-xs font-black text-[#242424]">
                  {player.firstName}
                </span>
                <span className="text-[10px] font-bold text-[#7655F7]">
                  • {player.skillLevel}
                </span>
              </div>
            ))}

            {Array.from({ length: session.remainingSlots }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 border-2 border-dashed border-[#CCCCCC] px-3 py-1.5 rounded-full text-xs font-bold text-[#888888]"
              >
                <span>{t('sessionEmptySlot')}</span>
              </div>
            ))}
          </div>
        </div>

        {session.equipmentDetails && (
          <div className="p-4 rounded-2xl bg-white border-2 border-[#242424] space-y-1">
            <div className="text-xs font-black uppercase text-[#7655F7]">
              {t('equipmentProvided')}
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#444444]">
              {session.equipmentDetails}
            </div>
          </div>
        )}

        {session.rulesNotes && (
          <div className="p-4 rounded-2xl bg-[#FFF9EF] border-2 border-[#242424] space-y-1">
            <div className="text-xs font-black uppercase text-[#242424]">
              {t('rulesAndNotes')}
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#444444]">
              {session.rulesNotes}
            </div>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-white border border-[#DDDDDD] flex items-center gap-3 text-xs text-[#666666] font-medium">
          <ShieldCheck className="w-5 h-5 text-[#7655F7] shrink-0" />
          <span>
            {t('cancellationNotice')}: oʻyin boshlanishiga kamida{' '}
            {session.cancellationDeadlineHours} soat qolganda jarimasiz bekor
            qilish mumkin.
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-[#242424] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#AAAAAA] uppercase">
              {t('totalPrice')}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#D7FF64]">
              {session.totalPrice.toLocaleString()} UZS
            </div>
            <div className="text-[11px] text-[#888888]">
              {session.pricePerSlot.toLocaleString()} zal +{' '}
              {session.serviceFee.toLocaleString()} {t('serviceFee')}
            </div>
          </div>

          <div className="w-full sm:w-auto">
            {isUserBooked ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#D7FF64]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('sessionAlreadyBooked')}</span>
                </div>
                <Button
                  variant="coral"
                  size="md"
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="w-full sm:w-auto"
                >
                  {actionLoading ? t('sessionCancelling') : t('cancelBooking')}
                </Button>
              </div>
            ) : isFull ? (
              <Button variant="white" size="lg" disabled fullWidth>
                {t('spotsFull')}
              </Button>
            ) : !isAuthenticated ? (
              <Button
                variant="purple"
                size="lg"
                onClick={() => openLoginModal(`/sessions/${sessionId}`)}
                fullWidth
                className="text-base font-black"
              >
                {t('sessionLoginToBook')}
              </Button>
            ) : (
              <Button
                variant="lime"
                size="lg"
                onClick={handleBook}
                disabled={actionLoading}
                fullWidth
                className="text-lg font-black"
              >
                {actionLoading ? t('sessionBookingProcess') : t('grabSpot')}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
