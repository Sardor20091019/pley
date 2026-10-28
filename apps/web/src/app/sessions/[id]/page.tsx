'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchSessionById, reserveSpot, cancelBooking } from '../../../lib/api';
import { SessionDetail } from '../../../lib/types';
import { useAuth } from '../../../hooks/useAuth';
import { useI18n } from '../../../lib/i18n/useI18n';
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
} from 'lucide-react';
import { format } from 'date-fns';

export default function SessionDetailPage(): React.JSX.Element {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const { user, isAuthenticated } = useAuth();
  const { openLoginModal } = useAuthModal();
  const { t } = useI18n();

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
        await navigator.share({ title: session.title, text: shareText, url: shareUrl });
      } catch {}
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setSuccessMessage('Havola nusxalandi!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="h-64 rounded-3xl bg-white border-2 border-[#242424] animate-pulse" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <Mascot size="lg" mood="sleepy" />
        <h2 className="text-2xl font-black text-[#242424]">Oʻyin topilmadi</h2>
        <Button variant="lime" size="sm" onClick={() => router.push('/discover')}>
          Boshqa oʻyinlarni koʻrish
        </Button>
      </div>
    );
  }

  const dateObj = new Date(session.scheduledAt);
  const formattedDate = !isNaN(dateObj.getTime())
    ? format(dateObj, 'EEEE, d MMMM · HH:mm')
    : session.scheduledAt;

  const isUserBooked = !!session.currentUserBookingStatus;
  const isFull = session.remainingSlots <= 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6">
      <button
        onClick={() => router.push('/discover')}
        className="inline-flex items-center gap-1.5 text-xs font-black text-[#242424] hover:text-[#7655F7] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Barcha oʻyinlarga qaytish</span>
      </button>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#D7FF64] border-2 border-[#242424] shadow-[4px_4px_0px_#242424] flex items-center gap-3 animate-bounce">
          <Sparkles className="w-6 h-6 text-[#7655F7] shrink-0" />
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
                Sana va vaqt
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
                Davomiyligi
              </div>
              <div className="text-sm font-black text-[#242424]">
                {session.durationMinutes} daqiqa
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-black uppercase text-[#888888]">
            Joylar holati
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
                <span>Boʻsh joy</span>
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
                  <span>Siz roʻyxatdasiz!</span>
                </div>
                <Button
                  variant="coral"
                  size="md"
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="w-full sm:w-auto"
                >
                  {actionLoading ? 'Kutilmoqda...' : t('cancelBooking')}
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
                Kirish va band qilish
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
                {actionLoading ? 'Band qilinmoqda...' : t('grabSpot')}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

