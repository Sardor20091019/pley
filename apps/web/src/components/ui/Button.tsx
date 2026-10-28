'use client';

import React from 'react';
import { useAppTheme } from '../../lib/theme/ThemeContext';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'lime' | 'purple' | 'coral' | 'sky' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'lime',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps): React.JSX.Element {
  const { theme } = useAppTheme();
  const isCartoon = theme === 'cartoon';

  if (!isCartoon) {
    const editorialVariants = {
      lime: 'bg-[#C5A55A] text-[#1A1510] hover:bg-[#b89547]',
      purple: 'bg-[#1A1510] text-[#F5F0E8] hover:bg-[#332B24]',
      coral: 'bg-[#8B7355] text-[#F5F0E8] hover:bg-[#786144]',
      sky: 'bg-[#EDE6D5] text-[#1A1510] border border-[#1A1510] hover:bg-[#E5DDC9]',
      white: 'bg-transparent text-[#1A1510] border border-[#1A1510] hover:bg-[#EDE6D5]',
      dark: 'bg-[#1A1510] text-[#F5F0E8] hover:bg-[#332B24]',
    };

    const editorialSizes = {
      sm: 'px-3.5 py-1.5 text-xs font-bold font-sans tracking-widest uppercase',
      md: 'px-5 py-2.5 text-xs font-bold font-sans tracking-widest uppercase',
      lg: 'px-7 py-3.5 text-xs font-extrabold font-sans tracking-[0.15em] uppercase',
    };

    return (
      <button
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-2 transition-all cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed ${editorialVariants[variant]} ${editorialSizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  const variantStyles = {
    lime: 'bg-[#D7FF64] hover:bg-[#cbf556] text-[#242424]',
    purple: 'bg-[#7655F7] hover:bg-[#6844eb] text-white',
    coral: 'bg-[#FF795D] hover:bg-[#f26a4e] text-white',
    sky: 'bg-[#78D8FF] hover:bg-[#66cbf5] text-[#242424]',
    white: 'bg-white hover:bg-[#FFF9EF] text-[#242424]',
    dark: 'bg-[#242424] hover:bg-[#333333] text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm font-bold rounded-2xl',
    md: 'px-6 py-3.5 text-base font-bold rounded-full',
    lg: 'px-8 py-4 text-lg font-extrabold rounded-full',
  };

  const baseStyle =
    'inline-flex items-center justify-center gap-2 border-[2.5px] border-[#242424] transition-all duration-100 select-none';
  const shadowStyle = disabled
    ? 'opacity-50 cursor-not-allowed shadow-none'
    : 'shadow-[4px_4px_0px_#242424] hover:shadow-[5px_5px_0px_#242424] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#242424]';

  return (
    <button
      disabled={disabled}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${shadowStyle} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
