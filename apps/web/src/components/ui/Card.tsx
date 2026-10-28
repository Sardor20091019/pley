'use client';

import React from 'react';
import { useAppTheme } from '../../lib/theme/ThemeContext';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'white' | 'cream' | 'lime' | 'sky' | 'purple' | 'coral';
  interactive?: boolean;
}

export function Card({
  children,
  variant = 'white',
  interactive = false,
  className = '',
  ...props
}: CardProps): React.JSX.Element {
  const { theme } = useAppTheme();
  const isCartoon = theme === 'cartoon';

  if (!isCartoon) {
    const editorialBg = {
      white: 'bg-[#F5F0E8] text-[#1A1510] border border-[rgba(45,41,38,0.25)]',
      cream: 'bg-[#EDE6D5] text-[#1A1510] border border-[#2D2926]',
      lime: 'bg-[#EDE6D5] text-[#1A1510] border-l-4 border-l-[#C5A55A] border-y border-r border-[rgba(45,41,38,0.25)]',
      sky: 'bg-[#EDE6D5] text-[#1A1510] border border-[rgba(45,41,38,0.25)]',
      purple: 'bg-[#1A1510] text-[#F5F0E8] border border-[#1A1510]',
      coral: 'bg-[#EDE6D5] text-[#8B7355] border border-[rgba(45,41,38,0.25)]',
    };

    const interactiveStyle = interactive
      ? 'hover:bg-[#E5DDC9] hover:shadow-[2px_2px_0px_#8B7355] transition-all cursor-pointer'
      : '';

    return (
      <div
        className={`p-5 sm:p-6 transition-all duration-150 ${editorialBg[variant]} ${interactiveStyle} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }

  const bgStyles = {
    white: 'bg-white text-[#242424]',
    cream: 'bg-[#FFF9EF] text-[#242424]',
    lime: 'bg-[#D7FF64] text-[#242424]',
    sky: 'bg-[#78D8FF] text-[#242424]',
    purple: 'bg-[#7655F7] text-white',
    coral: 'bg-[#FF795D] text-white',
  };

  const interactiveStyle = interactive
    ? 'hover:-translate-y-1 hover:shadow-[6px_6px_0px_#242424] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#242424] cursor-pointer'
    : '';

  return (
    <div
      className={`border-[2.5px] border-[#242424] rounded-[24px] shadow-[4px_4px_0px_#242424] p-5 sm:p-6 transition-all duration-150 ${bgStyles[variant]} ${interactiveStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
