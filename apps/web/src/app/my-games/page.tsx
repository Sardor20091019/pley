'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchMyBookings, cancelBooking } from '../../lib/api';
import { UserBooking } from '../../lib/types';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../lib/i18n/useI18n';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyStateIllustration } from '../../components/illustrations/EmptyStateIllustration';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';

export default function MyGamesPage(): React.JSX.Element {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>(
    'upcoming',
  );
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadBookings = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await fetchMyBookings();
      setBookings(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCancelBooking = async (bookingId: string): Promise<void> => {
    setCancellingId(bookingId);
    setErrorMessage(null);
    try {
      await cancelBooking(bookingId);
      await loadBookings();
    } catch (err: any) {
      setErrorMessage(err.message || 'Bekor qilishda xatolik yuz berdi');
    } finally {
      setCancellingId(null);
    }
  };

  const now = Date.now();

  const upcomingBookings = bookings.filter((b) => {
    const time = new Date(b.scheduledAt).getTime();
    return b.status === 'CONFIRMED' && time >= now;
  });

  const pastBookings = bookings.filter((b) => {
    const time = new Date(b.scheduledAt).getTime();
    return (b.status === 'CONFIRMED' && time < now) || b.status === 'COMPLETED';
  });

  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED');

  const currentList =
    activeTab === 'upcoming'
      ? upcomingBookings
      : activeTab === 'past'
      ? pastBookings
      : cancelledBookings;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center space-y-4">
        <EmptyStateIllustration />
        <h2 className="text-2xl font-black text-[#242424]">
          Mening oʻyinlarim
        </h2>
        <p className="text-sm font-semibold text-[#666666]">
          Band qilgan oʻyinlaringizni koʻrish va boshqarish uchun Google hisobingiz orqali tizimga kiring.
        </p>
        <div className="pt-2">
          <GoogleSignInButton redirectPath="/my-games" className="w-full text-sm font-bold" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-2">
        <Badge variant="purple" size="md">
          {t('navMyGames')}
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-[#242424]">
          MENING OʻYINLARIM
        </h1>
        <p className="text-sm sm:text-base font-semibold text-[#555555]">
          Barcha bandliklaringiz, oʻyin jadvallari va qatnashish tarixi.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#FF795D] text-white border-2 border-[#242424] shadow-[4px_4px_0px_#242424] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="text-xs sm:text-sm font-bold">{errorMessage}</div>
        </div>
      )}

      <div className="flex items-center gap-2 border-b-2 border-[#E5E5E5] pb-3">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm border-2 transition-all ${
            activeTab === 'upcoming'
              ? 'bg-[#D7FF64] border-[#242424] text-[#242424] shadow-[2px_2px_0px_#242424]'
              : 'bg-white border-transparent text-[#666666] hover:border-[#242424]'
          }`}
        >
          {t('myUpcomingGames')} ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm border-2 transition-all ${
            activeTab === 'past'
              ? 'bg-[#78D8FF] border-[#242424] text-[#242424] shadow-[2px_2px_0px_#242424]'
              : 'bg-white border-transparent text-[#666666] hover:border-[#242424]'
          }`}
        >
          {t('myPastGames')} ({pastBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm border-2 transition-all ${
            activeTab === 'cancelled'
              ? 'bg-[#FF795D] border-[#242424] text-white shadow-[2px_2px_0px_#242424]'
              : 'bg-white border-transparent text-[#666666] hover:border-[#242424]'
          }`}
        >
          {t('myCancelledGames')} ({cancelledBookings.length})
        </button>
      </div>

      <div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-36 rounded-3xl bg-white border-2 border-[#242424] animate-pulse"
              />
            ))}
          </div>
        ) : currentList.length > 0 ? (
          <div className="space-y-4">
            {currentList.map((item) => {
              const dateObj = new Date(item.scheduledAt);
              const formattedDate = !isNaN(dateObj.getTime())
                ? format(dateObj, 'EEE, d MMM · HH:mm')
                : item.scheduledAt;

              return (
                <Card
                  key={item.id}
                  variant="white"
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="purple" size="sm">
                        {item.sportName}
                      </Badge>
                      <span className="text-xs font-bold text-[#888888]">
                        ID: {item.id}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-[#242424]">
                      {item.sessionTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#555555]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#7655F7]" />
                        <span>
                          {item.venueName} ({item.venueDistrict})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#242424]" />
                        <span suppressHydrationWarning>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#242424]" />
                        <span>{item.durationMinutes} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#EEEEEE] gap-3">
                    <div className="text-left sm:text-right">
                      <div className="text-[11px] font-bold text-[#888888] uppercase">
                        Toʻlangan
                      </div>
                      <div className="text-base sm:text-lg font-black text-[#242424]">
                        {item.totalPrice.toLocaleString()} UZS
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/sessions/${item.sessionId}`}>
                        <Button size="sm" variant="white">
                          <span>Tafsilotlar</span>
                        </Button>
                      </Link>

                      {item.isEligibleForCancel && (
                        <Button
                          size="sm"
                          variant="coral"
                          onClick={() => handleCancelBooking(item.id)}
                          disabled={cancellingId === item.id}
                        >
                          {cancellingId === item.id
                            ? '...'
                            : t('cancelBooking')}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <EmptyStateIllustration />
            <h3 className="text-2xl font-black text-[#242424]">
              {t('emptyGamesTitle')}
            </h3>
            <p className="text-sm font-semibold text-[#666666] max-w-sm mx-auto">
              Hozircha ushbu boʻlimda oʻyinlar yoʻq.
            </p>
            <Link href="/discover">
              <Button size="md" variant="lime">
                <span>Oʻyin qidirish</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

