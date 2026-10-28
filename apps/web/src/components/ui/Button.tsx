'use client';

import React from 'react';

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

