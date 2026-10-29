import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';
import { MascotComponent } from '../mascot/mascot.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, MascotComponent],
  template: `
    @if (themeService.theme() === 'editorial') {
      <footer class="bg-[#EDE6D5] text-[#1A1510] pt-14 pb-24 md:pb-14 px-6 sm:px-12 border-t border-[#2D2926] mt-20 transition-colors">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div class="space-y-4 md:col-span-1">
            <div class="flex items-center gap-2">
              <app-mascot size="sm" mood="happy" />
              <span class="text-2xl font-black text-[#1A1510]" style="font-family: Georgia, serif">
                PLEY<span class="text-[#8B7355]">.UZ</span>
              </span>
            </div>
            <p class="text-xs text-[#4A3F30] leading-relaxed italic" style="font-family: Georgia, serif">
              {{ i18nService.t('brandTagline') }}
            </p>
            <div class="inline-flex items-center gap-2 bg-[#F5F0E8] px-3 py-1.5 text-[10px] font-bold font-sans uppercase tracking-widest text-[#8B7355] border border-[rgba(45,41,38,0.25)]">
              <span>📍 {{ i18nService.t('footerLocation') }}</span>
            </div>
          </div>

          <div>
            <h4 class="font-bold text-[10px] font-sans uppercase tracking-[0.2em] text-[#8B7355] mb-3">
              {{ i18nService.t('footerSportsCatalog') }}
            </h4>
            <ul class="space-y-2 text-xs font-sans font-medium text-[#4A3F30]">
              <li>
                <a routerLink="/discover" [queryParams]="{ sport: 'table-tennis' }" class="hover:text-[#1A1510] transition-colors">
                  {{ i18nService.t('tableTennis') }}
                </a>
              </li>
              <li>
                <a routerLink="/discover" [queryParams]="{ sport: 'basketball-3x3' }" class="hover:text-[#1A1510] transition-colors">
                  {{ i18nService.t('basketball') }}
                </a>
              </li>
              <li>
                <a routerLink="/discover" [queryParams]="{ district: 'Chilonzor' }" class="hover:text-[#1A1510] transition-colors">
                  {{ i18nService.t('footerChilonzorZones') }}
                </a>
              </li>
              <li>
                <a routerLink="/discover" [queryParams]="{ district: 'Yunusobod' }" class="hover:text-[#1A1510] transition-colors">
                  {{ i18nService.t('footerYunusobodZones') }}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-[10px] font-sans uppercase tracking-[0.2em] text-[#8B7355] mb-3">
              {{ i18nService.t('footerPlatform') }}
            </h4>
            <ul class="space-y-2 text-xs font-sans font-medium text-[#4A3F30]">
              <li>
                <a routerLink="/" fragment="editorial-how" class="hover:text-[#1A1510] transition-colors">
                  {{ i18nService.t('howItWorksBtn') }}
                </a>
              </li>
              <li>
                <a routerLink="/" fragment="venue-partner" class="hover:text-[#1A1510] transition-colors">
                  {{ i18nService.t('footerVenuePartners') }}
                </a>
              </li>
              <li>
                <a routerLink="/terms" class="hover:text-[#1A1510] transition-colors">
                  {{ i18nService.t('footerTerms') }}
                </a>
              </li>
              <li>
                <a routerLink="/privacy" class="hover:text-[#1A1510] transition-colors">
                  {{ i18nService.t('footerPrivacy') }}
                </a>
              </li>
            </ul>
          </div>

          <div class="space-y-3">
            <h4 class="font-bold text-[10px] font-sans uppercase tracking-[0.2em] text-[#8B7355] mb-1">
              {{ i18nService.t('footerCommunity') }}
            </h4>
            <p class="text-xs font-sans text-[#4A3F30] leading-relaxed">
              {{ i18nService.t('footerCommunityDesc') }}
            </p>
            <a
              href="https://t.me/astro_spectrum"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 bg-[#1A1510] text-[#F5F0E8] px-4 py-2 text-xs font-bold font-sans uppercase tracking-wider hover:bg-[#332B24] transition-all"
            >
              <span>&#64;astro_spectrum Telegram</span>
            </a>
          </div>
        </div>

        <div class="max-w-7xl mx-auto pt-8 mt-8 border-t border-[rgba(45,41,38,0.15)] flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-[#8B7355] gap-3">
          <div>© 2026 Pley.uz. {{ i18nService.t('footerRights') }}</div>
          <div class="flex items-center gap-1 font-bold text-[#4A3F30]">
            <span>{{ i18nService.t('footerMadeWithLove') }}</span>
            <span class="text-[#B85450]">♥</span>
          </div>
        </div>
      </footer>
    } @else {
      <footer class="bg-[#242424] text-white pt-12 pb-24 md:pb-12 px-6 sm:px-12 border-t-[3px] border-[#242424] mt-20">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div class="space-y-4 md:col-span-1">
            <div class="flex items-center gap-2">
              <app-mascot size="sm" mood="happy" />
              <span class="text-2xl font-black text-white">
                PLEY<span class="text-[#D7FF64]">.UZ</span>
              </span>
            </div>
            <p class="text-sm text-[#CCCCCC] leading-relaxed">
              {{ i18nService.t('brandTagline') }}
            </p>
            <div class="inline-flex items-center gap-2 bg-[#333333] px-3 py-1.5 rounded-full text-xs font-bold text-[#D7FF64] border border-[#444444]">
              <span>📍 {{ i18nService.t('footerLocation') }}</span>
            </div>
          </div>

          <div>
            <h4 class="font-extrabold text-sm uppercase tracking-wider text-[#D7FF64] mb-3">
              {{ i18nService.t('footerSportsCatalog') }}
            </h4>
            <ul class="space-y-2 text-sm text-[#DDDDDD] font-medium">
              <li>
                <a routerLink="/discover" [queryParams]="{ sport: 'table-tennis' }" class="hover:text-[#D7FF64] transition-colors">
                  {{ i18nService.t('tableTennis') }}
                </a>
              </li>
              <li>
                <a routerLink="/discover" [queryParams]="{ sport: 'basketball-3x3' }" class="hover:text-[#D7FF64] transition-colors">
                  {{ i18nService.t('basketball') }}
                </a>
              </li>
              <li>
                <a routerLink="/discover" [queryParams]="{ sport: 'badminton' }" class="hover:text-[#D7FF64] transition-colors">
                  {{ i18nService.t('badminton') }} ({{ i18nService.t('comingSoon') }})
                </a>
              </li>
              <li>
                <a routerLink="/discover" [queryParams]="{ district: 'Chilonzor' }" class="hover:text-[#D7FF64] transition-colors">
                  {{ i18nService.t('footerChilonzorZones') }}
                </a>
              </li>
              <li>
                <a routerLink="/discover" [queryParams]="{ district: 'Yunusobod' }" class="hover:text-[#D7FF64] transition-colors">
                  {{ i18nService.t('footerYunusobodZones') }}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-extrabold text-sm uppercase tracking-wider text-[#D7FF64] mb-3">
              {{ i18nService.t('footerPlatform') }}
            </h4>
            <ul class="space-y-2 text-sm text-[#DDDDDD] font-medium">
              <li>
                <a routerLink="/" fragment="how-it-works" class="hover:text-[#D7FF64] transition-colors">
                  {{ i18nService.t('howItWorksBtn') }}
                </a>
              </li>
              <li>
                <a routerLink="/" fragment="venue-partner" class="hover:text-[#D7FF64] transition-colors">
                  {{ i18nService.t('footerVenuePartners') }}
                </a>
              </li>
              <li>
                <a routerLink="/terms" class="hover:text-[#D7FF64] transition-colors">
                  {{ i18nService.t('footerTerms') }}
                </a>
              </li>
              <li>
                <a routerLink="/privacy" class="hover:text-[#D7FF64] transition-colors">
                  {{ i18nService.t('footerPrivacy') }}
                </a>
              </li>
            </ul>
          </div>

          <div class="space-y-3">
            <h4 class="font-extrabold text-sm uppercase tracking-wider text-[#D7FF64] mb-1">
              {{ i18nService.t('footerCommunity') }}
            </h4>
            <p class="text-xs text-[#BBBBBB] leading-relaxed">
              {{ i18nService.t('footerCommunityDesc') }}
            </p>
            <a
              href="https://t.me/astro_spectrum"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 bg-[#7655F7] hover:bg-[#6844eb] text-white px-4 py-2.5 rounded-full text-xs font-black border-2 border-white shadow-[2px_2px_0px_#FFFFFF] transition-transform hover:-translate-y-0.5"
            >
              <span>&#64;astro_spectrum Telegram</span>
            </a>
          </div>
        </div>

        <div class="max-w-7xl mx-auto pt-8 mt-8 border-t border-[#3A3A3A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#888888] gap-3">
          <div>© 2026 Pley.uz. {{ i18nService.t('footerRights') }}</div>
          <div class="flex items-center gap-1 font-bold">
            <span>{{ i18nService.t('footerMadeWithLove') }}</span>
            <span class="text-[#FF795D]">♥</span>
          </div>
        </div>
      </footer>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly i18nService = inject(I18nService);
}
