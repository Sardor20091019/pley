'use client';

import React from 'react';
import Link from 'next/link';
import { SessionItem } from '../../lib/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CapacityMeter } from './CapacityMeter';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import { MapPin, Clock, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export interface SessionCardProps {
  session: SessionItem;
}

export function SessionCard({ session }: SessionCardProps): React.JSX.Element {
  const { theme } = useAppTheme();
  const isEditorial = theme === 'editorial';

  const dateObj = new Date(session.scheduledAt);
  const formattedDate = !isNaN(dateObj.getTime())
    ? format(dateObj, 'EEE, d MMM · HH:mm')
    : session.scheduledAt;

  const isFull = session.remainingSlots <= 0;
  const isAlmostFull = session.remainingSlots > 0 && session.remainingSlots <= 2;

  const sportColorMap: Record<string, 'lime' | 'purple' | 'coral' | 'sky'> = {
    'table-tennis': 'purple',
    'basketball-3x3': 'coral',
    badminton: 'sky',
    volleyball: 'lime',
  };

  const badgeVariant = sportColorMap[session.sport.slug] || 'lime';

  if (isEditorial) {
    return (
      <div className="flex flex-col justify-between h-full bg-[#EDE6D5] border border-[#2D2926] p-5 shadow-[2px_2px_0px_#8B7355] hover:shadow-[4px_4px_0px_#2D2926] hover:-translate-y-0.5 transition-all">
        <div className="space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#2D2926]/20">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A55A]" />
              <span className="text-[11px] font-sans font-extrabold uppercase tracking-widest text-[#1A1510]">
                {session.sport.name}
              </span>
            </div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8B7355] border border-[#8B7355]/40 px-2 py-0.5 bg-[#F5F0E8]">
              {session.skillLevel}
            </span>
          </div>

          <div>
            <h3
              className="text-lg font-bold text-[#1A1510] line-clamp-2 leading-snug"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {session.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#8B7355] font-sans mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1A1510] shrink-0" />
              <span className="truncate">
                {session.venue.name} · {session.venue.district}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#1A1510] bg-[#F5F0E8] p-2.5 border border-[#2D2926]/30 font-sans">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8B7355]" />
              <span suppressHydrationWarning className="font-semibold">{formattedDate}</span>
            </div>
            <span className="text-[#8B7355]/40">|</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8B7355]" />
              <span className="font-semibold">{session.durationMinutes} min</span>
            </div>
          </div>

          <CapacityMeter
            maxSlots={session.maxSlots}
            bookedSlots={session.bookedSlots}
            remainingSlots={session.remainingSlots}
            size="sm"
          />
        </div>

        <div className="pt-4 mt-4 border-t border-dashed border-[#2D2926]/30 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-sans font-bold text-[#8B7355] block uppercase tracking-widest">
              KIRISH NARXI
            </span>
            <span
              className="text-base font-bold text-[#1A1510]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {session.pricePerSlot.toLocaleString()} UZS
            </span>
          </div>

          <Link href={`/sessions/${session.id}`} className="shrink-0">
            <button
              disabled={isFull}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-sans font-bold tracking-widest uppercase transition-all cursor-pointer ${
                isFull
                  ? 'bg-[#E0D8C7] text-[#8B7355] border border-[#8B7355]/30 cursor-not-allowed'
                  : 'bg-[#1A1510] text-[#F5F0E8] hover:bg-[#332B24] border border-[#2D2926]'
              }`}
            >
              <span>{isFull ? 'Toʻlgan' : 'Joy olish'}</span>
              {!isFull && <ArrowRight className="w-3 h-3 text-[#C5A55A]" />}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Card
      variant="white"
      interactive
      className="flex flex-col justify-between h-full border-[2.5px] border-[#242424] hover:border-[#7655F7] transition-colors"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={badgeVariant} size="md">
            {session.sport.name}
          </Badge>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF9EF] border border-[#242424]">
            {session.skillLevel}
          </span>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#242424] line-clamp-1">
            {session.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#555555] font-semibold mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#7655F7] shrink-0" />
            <span className="truncate">
              {session.venue.name} · {session.venue.district}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-[#242424] bg-[#FFF9EF] p-2.5 rounded-xl border border-[#242424]">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#242424]" />
            <span suppressHydrationWarning>{formattedDate}</span>
          </div>
          <span className="text-[#888888]">|</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#242424]" />
            <span>{session.durationMinutes} min</span>
          </div>
        </div>

        <CapacityMeter
          maxSlots={session.maxSlots}
          bookedSlots={session.bookedSlots}
          remainingSlots={session.remainingSlots}
          size="sm"
        />
      </div>

      <div className="pt-4 mt-4 border-t-2 border-dashed border-[#E5E5E5] flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-[#777777] block uppercase tracking-wider">
            Joy narxi
          </span>
          <span className="text-base sm:text-lg font-black text-[#242424]">
            {session.pricePerSlot.toLocaleString()} UZS
          </span>
        </div>

        <Link href={`/sessions/${session.id}`} className="shrink-0">
          <Button
            size="sm"
            variant={isFull ? 'white' : isAlmostFull ? 'coral' : 'lime'}
            disabled={isFull}
          >
            {isFull ? 'Toʻlgan' : 'Joy olish'}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
