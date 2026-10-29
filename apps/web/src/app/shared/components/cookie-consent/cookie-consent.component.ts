import { Component, inject, signal, ChangeDetectionStrategy, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieConsentService } from '../../../core/services/cookie-consent.service';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40">
      <button
        (click)="cookieService.openPreferences()"
        [title]="i18nService.t('cookieStickyLabel')"
        class="group relative flex items-center gap-2 select-none cursor-pointer transition-all duration-150"
        [class]="themeService.theme() === 'cartoon'
          ? 'p-3 rounded-full bg-[#FFF9EF] border-[2.5px] border-[#242424] shadow-[3px_3px_0px_#242424] hover:shadow-[4px_4px_0px_#242424] hover:bg-[#D7FF64] text-[#242424]'
          : 'p-2.5 bg-[#EDE6D5] border-[1.5px] border-[#2D2926] shadow-[2px_2px_0px_#8B7355] hover:bg-[#E5DDC9] text-[#1A1510]'"
      >
        <svg class="w-5 h-5 text-[#8B7355] group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm-3 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-4 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
        <span class="hidden sm:inline-block text-xs font-black tracking-tight max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
          {{ i18nService.t('cookieStickyLabel') }}
        </span>
        @if (!cookieService.consentState()) {
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-[#FF795D] border-2 border-white rounded-full animate-ping"></span>
        }
      </button>
    </div>

    @if (savedNotice()) {
      <div
        class="fixed bottom-24 md:bottom-20 left-4 sm:left-6 z-50 flex items-center gap-2 px-4 py-2.5 text-xs font-bold"
        [class]="themeService.theme() === 'cartoon'
          ? 'rounded-2xl border-2 border-[#242424] bg-[#D7FF64] text-[#242424] shadow-[4px_4px_0px_#242424]'
          : 'border border-[#2D2926] bg-[#EDE6D5] text-[#1A1510] shadow-[2px_2px_0px_#8B7355]'"
      >
        <span class="text-[#2E7D32]">✓</span>
        <span>{{ i18nService.t('cookieSavedNotice') }}</span>
      </div>
    }

    @if (cookieService.isBannerOpen() && !cookieService.showPreferencesModal()) {
      <div
        class="fixed bottom-20 md:bottom-6 right-4 sm:right-6 max-w-md z-40 p-5 sm:p-6"
        [class]="themeService.theme() === 'cartoon'
          ? 'rounded-[28px] border-[2.5px] border-[#242424] bg-[#FFF9EF] shadow-[6px_6px_0px_#242424]'
          : 'border-[1.5px] border-[#2D2926] bg-[#F5F0E8] shadow-[4px_4px_0px_#8B7355]'"
      >
        <div class="flex items-start justify-between gap-3 mb-2">
          <div class="flex items-center gap-2">
            <div
              class="p-2 rounded-xl"
              [class]="themeService.theme() === 'cartoon'
                ? 'bg-[#D7FF64] border-2 border-[#242424]'
                : 'bg-[#EDE6D5] border border-[#2D2926]'"
            >
              <svg class="w-5 h-5 text-[#1A1510]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
              </svg>
            </div>
            <h4
              class="text-base font-black"
              [class.text-[#242424]]="themeService.theme() === 'cartoon'"
              [class.text-[#1A1510]]="themeService.theme() !== 'cartoon'"
              [style.font-family]="themeService.theme() === 'cartoon' ? 'inherit' : 'Georgia, serif'"
            >
              {{ i18nService.t('cookieBannerTitle') }}
            </h4>
          </div>
          <button (click)="cookieService.isBannerOpen.set(false)" class="text-[#888888] hover:text-[#242424] p-1 cursor-pointer">
            ✕
          </button>
        </div>

        <p class="text-xs text-[#555555] font-medium leading-relaxed mb-4">
          {{ i18nService.t('cookieBannerDesc') }}
        </p>

        <div class="flex items-center gap-2 flex-wrap">
          <button
            (click)="handleAcceptAll()"
            class="flex-1 py-2 px-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            [class]="themeService.theme() === 'cartoon'
              ? 'rounded-xl border-2 border-[#242424] bg-[#D7FF64] hover:bg-[#cbf556] text-[#242424] shadow-[2px_2px_0px_#242424]'
              : 'bg-[#1A1510] text-[#F5F0E8] border border-[#1A1510] hover:bg-[#332B24]'"
          >
            {{ i18nService.t('cookieAcceptAll') }}
          </button>

          <button
            (click)="openModalFromBanner()"
            class="py-2 px-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
            [class]="themeService.theme() === 'cartoon'
              ? 'rounded-xl border-2 border-[#242424] bg-white hover:bg-[#FFF9EF] text-[#242424] shadow-[2px_2px_0px_#242424]'
              : 'bg-[#EDE6D5] text-[#1A1510] border border-[#2D2926] hover:bg-[#E5DDC9]'"
          >
            {{ i18nService.t('cookieCustomize') }}
          </button>
        </div>
      </div>
    }

    @if (cookieService.showPreferencesModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div (click)="cookieService.closePreferences()" class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>

        <div
          class="relative w-full max-w-lg z-10 overflow-hidden max-h-[90vh] flex flex-col p-6 sm:p-8"
          [class]="themeService.theme() === 'cartoon'
            ? 'bg-[#FFF9EF] border-[2.5px] border-[#242424] rounded-[32px] shadow-[6px_6px_0px_#242424]'
            : 'bg-[#F5F0E8] border-[1.5px] border-[#2D2926] shadow-[4px_4px_0px_#8B7355]'"
        >
          <div class="flex items-start justify-between gap-4 pb-4 border-b border-[#242424]/10 mb-4">
            <div class="flex items-center gap-3">
              <div
                class="p-2.5 rounded-2xl"
                [class]="themeService.theme() === 'cartoon'
                  ? 'bg-[#D7FF64] border-2 border-[#242424]'
                  : 'bg-[#EDE6D5] border border-[#2D2926]'"
              >
                <svg class="w-5 h-5 text-[#1A1510]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3
                  class="text-xl sm:text-2xl font-black"
                  [class.text-[#242424]]="themeService.theme() === 'cartoon'"
                  [class.text-[#1A1510]]="themeService.theme() !== 'cartoon'"
                  [style.font-family]="themeService.theme() === 'cartoon' ? 'inherit' : 'Georgia, serif'"
                >
                  {{ i18nService.t('cookieModalTitle') }}
                </h3>
                <p class="text-xs text-[#777777] font-medium mt-0.5">
                  {{ i18nService.t('cookieModalSubtitle') }}
                </p>
              </div>
            </div>

            <button
              (click)="cookieService.closePreferences()"
              class="p-1.5 transition-colors cursor-pointer shrink-0"
              [class]="themeService.theme() === 'cartoon'
                ? 'border-2 border-[#242424] bg-white rounded-full hover:bg-[#D7FF64] text-[#242424]'
                : 'border border-[#2D2926] bg-[#EDE6D5] hover:bg-[#E5DDC9] text-[#1A1510]'"
            >
              ✕
            </button>
          </div>

          <div class="overflow-y-auto space-y-4 pr-1 flex-1">
            <div
              class="p-4 transition-all"
              [class]="themeService.theme() === 'cartoon'
                ? 'bg-white rounded-2xl border-2 border-[#242424]'
                : 'bg-[#EDE6D5] border border-[#2D2926]/20'"
            >
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-black text-[#242424]">
                    {{ i18nService.t('cookieCategoryNecessary') }}
                  </span>
                </div>
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider"
                  [class]="themeService.theme() === 'cartoon'
                    ? 'rounded-full bg-[#EADEFF] border border-[#242424] text-[#7655F7]'
                    : 'border border-[#2D2926] bg-[#F5F0E8] text-[#1A1510]'"
                >
                  <span>{{ i18nService.t('cookieAlwaysActive') }}</span>
                </span>
              </div>
              <p class="text-xs text-[#666666] leading-relaxed">
                {{ i18nService.t('cookieCategoryNecessaryDesc') }}
              </p>
            </div>

            <div
              class="p-4 transition-all"
              [class]="themeService.theme() === 'cartoon'
                ? 'bg-white rounded-2xl border-2 border-[#242424]'
                : 'bg-[#EDE6D5] border border-[#2D2926]/20'"
            >
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm font-black text-[#242424]">
                  {{ i18nService.t('cookieCategoryPreferences') }}
                </span>
                <button
                  type="button"
                  (click)="togglePreferencesOnly()"
                  class="w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200"
                  [class]="cookieService.preferencesOnly()
                    ? (themeService.theme() === 'cartoon' ? 'bg-[#7655F7] border border-[#242424]' : 'bg-[#1A1510]')
                    : 'bg-[#CCCCCC]'"
                >
                  <div
                    class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200"
                    [class.translate-x-5]="cookieService.preferencesOnly()"
                    [class.translate-x-0]="!cookieService.preferencesOnly()"
                  ></div>
                </button>
              </div>
              <p class="text-xs text-[#666666] leading-relaxed">
                {{ i18nService.t('cookieCategoryPreferencesDesc') }}
              </p>
            </div>

            <div
              class="p-4 transition-all"
              [class]="themeService.theme() === 'cartoon'
                ? 'bg-white rounded-2xl border-2 border-[#242424]'
                : 'bg-[#EDE6D5] border border-[#2D2926]/20'"
            >
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm font-black text-[#242424]">
                  {{ i18nService.t('cookieCategoryAnalytics') }}
                </span>
                <button
                  type="button"
                  (click)="toggleAnalyticsOnly()"
                  class="w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200"
                  [class]="cookieService.analyticsOnly()
                    ? (themeService.theme() === 'cartoon' ? 'bg-[#7655F7] border border-[#242424]' : 'bg-[#1A1510]')
                    : 'bg-[#CCCCCC]'"
                >
                  <div
                    class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200"
                    [class.translate-x-5]="cookieService.analyticsOnly()"
                    [class.translate-x-0]="!cookieService.analyticsOnly()"
                  ></div>
                </button>
              </div>
              <p class="text-xs text-[#666666] leading-relaxed">
                {{ i18nService.t('cookieCategoryAnalyticsDesc') }}
              </p>
            </div>
          </div>

          <div class="pt-5 mt-4 border-t border-[#242424]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <button
              type="button"
              (click)="handleRejectOptional()"
              class="py-2.5 px-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              [class]="themeService.theme() === 'cartoon'
                ? 'rounded-2xl border-2 border-[#242424] bg-white hover:bg-[#FFF9EF] text-[#242424] shadow-[2px_2px_0px_#242424]'
                : 'bg-[#EDE6D5] text-[#1A1510] border border-[#2D2926] hover:bg-[#E5DDC9]'"
            >
              {{ i18nService.t('cookieRejectOptional') }}
            </button>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="handleSavePreferences()"
                class="flex-1 sm:flex-none py-2.5 px-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                [class]="themeService.theme() === 'cartoon'
                  ? 'rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] hover:bg-[#FFE5B4] text-[#242424] shadow-[2px_2px_0px_#242424]'
                  : 'bg-[#F5F0E8] text-[#1A1510] border border-[#2D2926] hover:bg-[#E5DDC9]'"
              >
                {{ i18nService.t('cookieSavePreferences') }}
              </button>

              <button
                type="button"
                (click)="handleAcceptAll()"
                class="flex-1 sm:flex-none py-2.5 px-5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                [class]="themeService.theme() === 'cartoon'
                  ? 'rounded-2xl border-2 border-[#242424] bg-[#D7FF64] hover:bg-[#cbf556] text-[#242424] shadow-[2px_2px_0px_#242424]'
                  : 'bg-[#1A1510] text-[#F5F0E8] border border-[#1A1510] hover:bg-[#332B24]'"
              >
                {{ i18nService.t('cookieAcceptAll') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentComponent {
  protected readonly cookieService = inject(CookieConsentService);
  protected readonly themeService = inject(ThemeService);
  protected readonly i18nService = inject(I18nService);

  public readonly savedNotice: WritableSignal<boolean> = signal<boolean>(false);

  public togglePreferencesOnly(): void {
    this.cookieService.preferencesOnly.set(!this.cookieService.preferencesOnly());
  }

  public toggleAnalyticsOnly(): void {
    this.cookieService.analyticsOnly.set(!this.cookieService.analyticsOnly());
  }

  public openModalFromBanner(): void {
    this.cookieService.isBannerOpen.set(false);
    this.cookieService.openPreferences();
  }

  public handleAcceptAll(): void {
    this.cookieService.acceptAll();
    this.triggerNotice();
  }

  public handleRejectOptional(): void {
    this.cookieService.rejectAll();
    this.themeService.setTheme('cartoon');
    this.i18nService.setLanguage('uz');
    this.triggerNotice();
  }

  public handleSavePreferences(): void {
    this.cookieService.savePreferences();
    if (!this.cookieService.preferencesOnly()) {
      this.themeService.setTheme('cartoon');
      this.i18nService.setLanguage('uz');
    }
    this.triggerNotice();
  }

  private triggerNotice(): void {
    this.savedNotice.set(true);
    setTimeout((): void => {
      this.savedNotice.set(false);
    }, 2800);
  }
}
