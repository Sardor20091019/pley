import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="themeService.toggleTheme()"
      [disabled]="themeService.isTransitioning()"
      [title]="themeService.theme() === 'cartoon' ? 'Switch to Editorial Gazette' : 'Switch to Cartoon Playful Mode'"
      class="relative flex items-center select-none outline-none group cursor-pointer"
    >
      @if (themeService.theme() === 'cartoon') {
        <div
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] text-xs font-black text-[#242424] hover:bg-[#cbf556] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <span class="tracking-tight uppercase">Cartoon</span>
        </div>
      } @else {
        <div
          class="flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE6D5] border-[1.5px] border-[#2D2926] shadow-[2px_2px_0px_#8B7355] text-xs font-bold text-[#1A1510] hover:bg-[#E5DDC9] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          style="font-family: Georgia, serif"
        >
          <svg class="w-3.5 h-3.5 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span class="tracking-wider uppercase text-[11px] font-extrabold text-[#1A1510]">Editorial</span>
        </div>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent {
  protected readonly themeService = inject(ThemeService);
}
