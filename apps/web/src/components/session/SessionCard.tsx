'use client';

import React from 'react';
import Link from 'next/link';
import { SessionItem } from '../../lib/types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CapacityMeter } from './CapacityMeter';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export interface SessionCardProps {
  session: SessionItem;
}

export function SessionCard({ session }: SessionCardProps): React.JSX.Element {
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

