'use client';

import React from 'react';
import { useAppTheme } from '../../lib/theme/ThemeContext';

export interface CapacityMeterProps {
  maxSlots: number;
  bookedSlots: number;
  remainingSlots: number;
  size?: 'sm' | 'md' | 'lg';
}

export function CapacityMeter({
  maxSlots,
  bookedSlots,
  remainingSlots,
  size = 'md',
}: CapacityMeterProps): React.JSX.Element {
  const { theme } = useAppTheme();
  const isCartoon = theme === 'cartoon';
  const percentage = Math.min(100, Math.round((bookedSlots / maxSlots) * 100));
  const isFull = remainingSlots <= 0;
  const isAlmostFull = remainingSlots > 0 && remainingSlots <= 2;

  if (!isCartoon) {
    return (
      <div className="w-full space-y-1 font-sans">
        <div className="flex items-center justify-between text-xs text-[#8B7355]">
          <span>
            {bookedSlots}/{maxSlots} oʻyinchi
          </span>
          <span className="font-bold text-[#1A1510]">
            {isFull ? 'Barcha oʻrinlar band' : `${remainingSlots} ta joy mavjud`}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[rgba(45,41,38,0.15)] overflow-hidden">
          <div
            className="h-full bg-[#1A1510] transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  let barColor = 'bg-[#D7FF64]';
  if (isFull) {
    barColor = 'bg-[#FF795D]';
  } else if (isAlmostFull) {
    barColor = 'bg-[#FF795D]';
  }

  const height = size === 'sm' ? 'h-3' : size === 'lg' ? 'h-5' : 'h-4';

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-[#242424]">
        <span>
          {bookedSlots} / {maxSlots} oʻyinchi
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-black uppercase ${
            isFull
              ? 'bg-[#FF795D] text-white'
              : isAlmostFull
              ? 'bg-[#FF795D] text-white animate-pulse'
              : 'bg-[#D7FF64] text-[#242424]'
          }`}
        >
          {isFull ? 'Toʻlgan' : `${remainingSlots} ta joy qoldi`}
        </span>
      </div>

      <div
        className={`w-full ${height} bg-[#FFF9EF] border-2 border-[#242424] rounded-full overflow-hidden p-0.5`}
      >
        <div
          className={`${height} ${barColor} rounded-full transition-all duration-300 border border-[#242424]`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
