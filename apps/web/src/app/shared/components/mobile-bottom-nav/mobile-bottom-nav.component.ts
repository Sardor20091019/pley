import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-mobile-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    @if (themeService.theme() === 'editorial') {
      <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F5F0E8] border-t border-[#2D2926] px-4 py-2 flex items-center justify-around shadow-sm transition-colors">
        <a
          routerLink="/discover"
          routerLinkActive
          #rlaMDiscEd="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center gap-1 py-1 px-3 transition-all"
          [ngClass]="rlaMDiscEd.isActive
            ? 'text-[#1A1510] border-b-2 border-[#1A1510]'
            : 'text-[#8B7355] hover:text-[#1A1510]'"
        >
          <svg class="w-5 h-5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1.5-6.5l4-4-4 1.5-1.5 4z" />
          </svg>
          <span class="text-[10px] font-bold font-sans tracking-widest uppercase">{{ i18nService.t('navDiscover') }}</span>
        </a>

        <a
          routerLink="/my-games"
          routerLinkActive
          #rlaMGamesEd="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center gap-1 py-1 px-3 transition-all"
          [ngClass]="rlaMGamesEd.isActive
            ? 'text-[#1A1510] border-b-2 border-[#1A1510]'
            : 'text-[#8B7355] hover:text-[#1A1510]'"
        >
          <svg class="w-5 h-5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-[10px] font-bold font-sans tracking-widest uppercase">{{ i18nService.t('navMyGames') }}</span>
        </a>

        <a
          routerLink="/profile"
          routerLinkActive
          #rlaMProfEd="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center gap-1 py-1 px-3 transition-all"
          [ngClass]="rlaMProfEd.isActive
            ? 'text-[#1A1510] border-b-2 border-[#1A1510]'
            : 'text-[#8B7355] hover:text-[#1A1510]'"
        >
          <svg class="w-5 h-5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-[10px] font-bold font-sans tracking-widest uppercase">{{ i18nService.t('navProfile') }}</span>
        </a>

        @if (authService.isAdmin()) {
          <a
            routerLink="/admin"
            routerLinkActive
            #rlaMAdminEd="routerLinkActive"
            class="flex flex-col items-center gap-1 py-1 px-3 transition-all"
            [ngClass]="rlaMAdminEd.isActive
              ? 'text-[#1A1510] border-b-2 border-[#1A1510]'
              : 'text-[#8B7355] hover:text-[#1A1510]'"
          >
            <svg class="w-5 h-5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span class="text-[10px] font-bold font-sans tracking-widest uppercase">{{ i18nService.t('navAdmin') }}</span>
          </a>
        }
      </nav>
    } @else {
      <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-[2.5px] border-[#242424] px-4 py-2 flex items-center justify-around shadow-[0px_-4px_12px_rgba(0,0,0,0.06)]">
        <a
          routerLink="/discover"
          routerLinkActive
          #rlaMDisc="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all"
          [ngClass]="rlaMDisc.isActive
            ? 'bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] text-[#242424]'
            : 'text-[#666666] hover:text-[#242424]'"
        >
          <svg class="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1.5-6.5l4-4-4 1.5-1.5 4z" />
          </svg>
          <span class="text-[11px] font-black">{{ i18nService.t('navDiscover') }}</span>
        </a>

        <a
          routerLink="/my-games"
          routerLinkActive
          #rlaMGames="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all"
          [ngClass]="rlaMGames.isActive
            ? 'bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] text-[#242424]'
            : 'text-[#666666] hover:text-[#242424]'"
        >
          <svg class="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-[11px] font-black">{{ i18nService.t('navMyGames') }}</span>
        </a>

        <a
          routerLink="/profile"
          routerLinkActive
          #rlaMProf="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all"
          [ngClass]="rlaMProf.isActive
            ? 'bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] text-[#242424]'
            : 'text-[#666666] hover:text-[#242424]'"
        >
          <svg class="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-[11px] font-black">{{ i18nService.t('navProfile') }}</span>
        </a>

        @if (authService.isAdmin()) {
          <a
            routerLink="/admin"
            routerLinkActive
            #rlaMAdmin="routerLinkActive"
            class="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all"
            [ngClass]="rlaMAdmin.isActive
              ? 'bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] text-[#242424]'
              : 'text-[#666666] hover:text-[#242424]'"
          >
            <svg class="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span class="text-[11px] font-black">{{ i18nService.t('navAdmin') }}</span>
          </a>
        }
      </nav>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBottomNavComponent {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly i18nService = inject(I18nService);
}
