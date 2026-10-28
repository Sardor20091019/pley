'use client';

import React from 'react';

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
