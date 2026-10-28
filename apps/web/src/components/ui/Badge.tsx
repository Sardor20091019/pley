'use client';

import React from 'react';
import { useAppTheme } from '../../lib/theme/ThemeContext';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lime' | 'purple' | 'coral' | 'sky' | 'cream' | 'white';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'lime',
  size = 'md',
  className = '',
}: BadgeProps): React.JSX.Element {
  const { theme } = useAppTheme();
  const isCartoon = theme === 'cartoon';

  if (!isCartoon) {
    const editorialVariantStyles = {
      lime: 'bg-[#EDE6D5] text-[#8B7355] border-b-2 border-b-[#C5A55A]',
      purple: 'bg-[#1A1510] text-[#F5F0E8]',
      coral: 'bg-[#EDE6D5] text-[#8B7355]',
      sky: 'bg-[#EDE6D5] text-[#4A3F30]',
      cream: 'bg-[#F5F0E8] text-[#8B7355] border border-[rgba(45,41,38,0.2)]',
      white: 'bg-transparent text-[#1A1510] border-b border-[#1A1510]',
    };

    const editorialSizes = {
      sm: 'px-2 py-0.5 text-[9px] font-bold font-sans tracking-widest uppercase',
      md: 'px-2.5 py-1 text-[10px] font-bold font-sans tracking-[0.18em] uppercase',
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 border border-[rgba(45,41,38,0.25)] ${editorialVariantStyles[variant]} ${editorialSizes[size]} ${className}`}
      >
        {children}
      </span>
    );
  }

  const variantStyles = {
    lime: 'bg-[#D7FF64] text-[#242424]',
    purple: 'bg-[#7655F7] text-white',
    coral: 'bg-[#FF795D] text-white',
    sky: 'bg-[#78D8FF] text-[#242424]',
    cream: 'bg-[#FFF9EF] text-[#242424]',
    white: 'bg-white text-[#242424]',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs font-bold',
    md: 'px-3 py-1 text-xs font-extrabold tracking-wide uppercase',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border-2 border-[#242424] rounded-full shadow-[2px_2px_0px_#242424] ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
