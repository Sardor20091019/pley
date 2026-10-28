'use client';

import React from 'react';

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
