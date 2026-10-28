'use client';

import React from 'react';

export function EmptyStateIllustration(): React.JSX.Element {
  return (
    <div className="w-48 h-48 mx-auto flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[3px_4px_0px_#242424]"
      >
        <circle
          cx="100"
          cy="110"
          r="60"
          fill="#FFF9EF"
          stroke="#242424"
          strokeWidth="5"
        />

        <circle
          cx="85"
          cy="85"
          r="45"
          fill="#D7FF64"
          stroke="#242424"
          strokeWidth="5"
        />

        <circle cx="70" cy="78" r="6" fill="#242424" />
        <circle cx="72" cy="76" r="2" fill="#FFFFFF" />
        <circle cx="98" cy="78" r="6" fill="#242424" />
        <circle cx="100" cy="76" r="2" fill="#FFFFFF" />

        <path
          d="M74 96 Q85 88 96 96"
          stroke="#242424"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <circle
          cx="135"
          cy="75"
          r="26"
          fill="#78D8FF"
          stroke="#242424"
          strokeWidth="4"
        />
        <line
          x1="152"
          y1="94"
          x2="175"
          y2="120"
          stroke="#242424"
          strokeWidth="7"
          strokeLinecap="round"
        />

        <text
          x="126"
          y="84"
          fontFamily="sans-serif"
          fontWeight="bold"
          fontSize="24"
          fill="#242424"
        >
          ?
        </text>
      </svg>
    </div>
  );
}

export function BookingSuccessIllustration(): React.JSX.Element {
  return (
    <div className="w-56 h-56 mx-auto flex items-center justify-center">
      <svg
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[4px_6px_0px_#242424]"
      >
        <path
          d="M80 60 L140 60 L130 110 Q110 135 90 110 Z"
          fill="#D7FF64"
          stroke="#242424"
          strokeWidth="5"
        />
        <path
          d="M100 125 L120 125 L125 155 L95 155 Z"
          fill="#FFF9EF"
          stroke="#242424"
          strokeWidth="4"
        />
        <rect
          x="80"
          y="155"
          width="60"
          height="16"
          rx="6"
          fill="#7655F7"
          stroke="#242424"
          strokeWidth="4"
        />
        <path
          d="M80 75 Q55 75 60 95 Q65 110 85 105"
          fill="none"
          stroke="#242424"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M140 75 Q165 75 160 95 Q155 110 135 105"
          fill="none"
          stroke="#242424"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <circle cx="110" cy="85" r="14" fill="#FF795D" stroke="#242424" strokeWidth="3" />
        <path d="M104 85 L108 89 L116 80" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        <circle cx="45" cy="45" r="6" fill="#78D8FF" />
        <circle cx="175" cy="40" r="8" fill="#FF795D" />
        <circle cx="185" cy="130" r="5" fill="#D7FF64" />
        <rect x="35" y="110" width="8" height="8" rx="2" fill="#7655F7" transform="rotate(25 35 110)" />
      </svg>
    </div>
  );
}

