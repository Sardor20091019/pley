import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mascot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full drop-shadow-[2px_3px_0px_#242424]"
      >
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="#D7FF64"
          stroke="#242424"
          strokeWidth="5"
        />

        <ellipse
          cx="42"
          cy="28"
          rx="18"
          ry="6"
          fill="#FFFFFF"
          opacity="0.6"
        />

        <rect
          x="18"
          y="28"
          width="64"
          height="12"
          rx="6"
          fill="#7655F7"
          stroke="#242424"
          strokeWidth="3.5"
        />
        <line
          x1="32"
          y1="34"
          x2="68"
          y2="34"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        @if (mood === 'celebrating') {
          <path
            d="M32 45 Q38 39 44 45"
            stroke="#242424"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M56 45 Q62 39 68 45"
            stroke="#242424"
            strokeWidth="4"
            strokeLinecap="round"
          />
        } @else {
          <circle cx="38" cy="48" r="6" fill="#242424" />
          <circle cx="40" cy="46" r="2.2" fill="#FFFFFF" />
          <circle cx="62" cy="48" r="6" fill="#242424" />
          <circle cx="64" cy="46" r="2.2" fill="#FFFFFF" />
        }

        <circle cx="28" cy="56" r="5" fill="#FF795D" opacity="0.8" />
        <circle cx="72" cy="56" r="5" fill="#FF795D" opacity="0.8" />

        @if (mood === 'celebrating') {
          <path
            d="M36 60 Q50 80 64 60 Z"
            fill="#FF795D"
            stroke="#242424"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M44 67 Q50 75 56 67"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        } @else {
          <path
            d="M38 60 Q50 72 62 60"
            stroke="#242424"
            strokeWidth="4"
            strokeLinecap="round"
          />
        }
      </svg>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MascotComponent {
  @Input() public mood: 'happy' | 'bouncing' | 'celebrating' | 'curious' | 'sleepy' = 'happy';
  @Input() public size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() public extraClass: string = '';

  public containerClasses(): string {
    const sizeMap: Record<string, string> = {
      sm: 'w-10 h-10',
      md: 'w-16 h-16',
      lg: 'w-24 h-24',
      xl: 'w-36 h-36',
    };
    return `relative inline-flex items-center justify-center ${sizeMap[this.size] || sizeMap['md']} ${this.extraClass}`;
  }
}
