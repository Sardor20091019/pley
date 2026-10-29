import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sports-hero-illustration',
  standalone: true,
  template: `
    <div class="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center">
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full drop-shadow-[6px_8px_0px_#242424]"
      >
        <path
          d="M60 380 Q250 460 440 380 L420 440 Q250 490 80 440 Z"
          fill="#D7FF64"
          stroke="#242424"
          strokeWidth="6"
        />

        <rect
          x="320"
          y="70"
          width="130"
          height="95"
          rx="12"
          fill="#FFFFFF"
          stroke="#242424"
          strokeWidth="6"
        />
        <rect
          x="355"
          y="105"
          width="60"
          height="45"
          rx="4"
          fill="none"
          stroke="#FF795D"
          strokeWidth="5"
        />
        <path
          d="M360 165 L410 165 L395 210 L375 210 Z"
          fill="none"
          stroke="#242424"
          strokeWidth="4"
          strokeDasharray="6 4"
        />
        <line
          x1="385"
          y1="165"
          x2="385"
          y2="210"
          stroke="#242424"
          strokeWidth="3"
        />

        <g class="animate-float">
          <circle
            cx="260"
            cy="120"
            r="44"
            fill="#FF795D"
            stroke="#242424"
            strokeWidth="6"
          />
          <path
            d="M230 120 Q260 90 290 120"
            stroke="#242424"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M230 120 Q260 150 290 120"
            stroke="#242424"
            strokeWidth="4"
            fill="none"
          />
          <line
            x1="260"
            y1="76"
            x2="260"
            y2="164"
            stroke="#242424"
            strokeWidth="4"
          />
        </g>

        <path
          d="M190 150 Q160 180 180 230"
          stroke="#242424"
          strokeWidth="4"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />
        <path
          d="M200 170 Q180 200 195 240"
          stroke="#78D8FF"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <g transform="rotate(-20 160 300)">
          <rect
            x="145"
            y="320"
            width="28"
            height="55"
            rx="8"
            fill="#FFF9EF"
            stroke="#242424"
            strokeWidth="5"
          />
          <circle
            cx="160"
            cy="270"
            r="55"
            fill="#7655F7"
            stroke="#242424"
            strokeWidth="6"
          />
          <circle
            cx="140"
            cy="250"
            r="16"
            fill="#FFFFFF"
            opacity="0.3"
          />
        </g>

        <circle
          cx="240"
          cy="260"
          r="16"
          fill="#FFFFFF"
          stroke="#242424"
          strokeWidth="4"
        />

        <g transform="translate(180, 270)">
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="#D7FF64"
            stroke="#242424"
            strokeWidth="6"
          />
          <rect
            x="24"
            cy="36"
            width="92"
            height="18"
            rx="9"
            fill="#7655F7"
            stroke="#242424"
            strokeWidth="4"
          />
          <circle cx="50" cy="65" r="7" fill="#242424" />
          <circle cx="52" cy="63" r="2.5" fill="#FFFFFF" />
          <circle cx="90" cy="65" r="7" fill="#242424" />
          <circle cx="92" cy="63" r="2.5" fill="#FFFFFF" />
          <circle cx="36" cy="76" r="6" fill="#FF795D" />
          <circle cx="104" cy="76" r="6" fill="#FF795D" />
          <path
            d="M52 82 Q70 106 88 82 Z"
            fill="#FF795D"
            stroke="#242424"
            strokeWidth="4"
          />
        </g>

        <path
          d="M80 120 L86 138 L104 140 L90 152 L94 170 L78 160 L62 170 L66 152 L52 140 L70 138 Z"
          fill="#D7FF64"
          stroke="#242424"
          strokeWidth="3.5"
        />
        <path
          d="M420 280 L424 292 L436 294 L426 302 L429 314 L418 307 L407 314 L410 302 L400 294 L412 292 Z"
          fill="#78D8FF"
          stroke="#242424"
          strokeWidth="3.5"
        />
      </svg>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportsHeroIllustrationComponent {}
