import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SessionItem } from '../../../core/models/types';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';
import { CapacityMeterComponent } from '../capacity-meter/capacity-meter.component';

@Component({
  selector: 'app-session-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CapacityMeterComponent],
  template: `
    @if (themeService.theme() === 'editorial') {
      <div class="flex flex-col justify-between h-full bg-[#EDE6D5] border border-[#2D2926] p-5 shadow-[2px_2px_0px_#8B7355] hover:shadow-[4px_4px_0px_#2D2926] hover:-translate-y-0.5 transition-all">
        <div class="space-y-3.5">
          <div class="relative w-full h-36 overflow-hidden border border-[#2D2926] bg-[#D8CFBC]">
            <img
              [src]="displayImage()"
              [alt]="session.title"
              class="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
              loading="lazy"
            />
            <div class="absolute top-2 left-2 px-2 py-0.5 bg-[#1A1510] text-[#F5F0E8] text-[9px] font-sans font-extrabold uppercase tracking-widest">
              {{ session.sport.name }}
            </div>
            <div class="absolute top-2 right-2 px-2 py-0.5 bg-[#F5F0E8]/90 text-[#1A1510] border border-[#2D2926] text-[9px] font-sans font-bold uppercase tracking-wider backdrop-blur-xs">
              {{ session.skillLevel }}
            </div>
          </div>

          <div>
            <h3 class="text-lg font-bold text-[#1A1510] line-clamp-2 leading-snug" style="font-family: Georgia, serif">
              {{ session.title }}
            </h3>
            <div class="flex items-center gap-1.5 text-xs text-[#8B7355] font-sans mt-1.5">
              <svg class="w-3.5 h-3.5 text-[#1A1510] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="truncate">{{ session.venue.name }} · {{ session.venue.district }}</span>
            </div>
          </div>

          <div class="flex items-center gap-3 text-xs text-[#1A1510] bg-[#F5F0E8] p-2.5 border border-[#2D2926]/30 font-sans">
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="font-semibold">{{ formattedDate() }}</span>
            </div>
            <span class="text-[#8B7355]/40">|</span>
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-semibold">{{ session.durationMinutes }} min</span>
            </div>
          </div>

          <app-capacity-meter
            [maxSlots]="session.maxSlots"
            [bookedSlots]="session.bookedSlots"
            [remainingSlots]="session.remainingSlots"
            size="sm"
          />
        </div>

        <div class="pt-4 mt-4 border-t border-dashed border-[#2D2926]/30 flex items-center justify-between gap-3">
          <div>
            <span class="text-[10px] font-sans font-bold text-[#8B7355] block uppercase tracking-widest">
              {{ i18nService.t('sessionCardPriceLabelEditorial') }}
            </span>
            <span class="text-base font-bold text-[#1A1510]" style="font-family: Georgia, serif">
              {{ formatPrice(session.pricePerSlot) }} UZS
            </span>
          </div>

          <a [routerLink]="['/sessions', session.id]" class="shrink-0">
            <button
              [disabled]="isFull()"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-sans font-bold tracking-widest uppercase transition-all cursor-pointer"
              [class]="isFull()
                ? 'bg-[#E0D8C7] text-[#8B7355] border border-[#8B7355]/30 cursor-not-allowed'
                : 'bg-[#1A1510] text-[#F5F0E8] hover:bg-[#332B24] border border-[#2D2926]'"
            >
              <span>{{ isFull() ? i18nService.t('sessionCardFullBtn') : i18nService.t('sessionCardBookBtn') }}</span>
              @if (!isFull()) {
                <span class="text-[#C5A55A]">→</span>
              }
            </button>
          </a>
        </div>
      </div>
    } @else {
      <div class="flex flex-col justify-between h-full border-[2.5px] border-[#242424] hover:border-[#7655F7] transition-colors overflow-hidden rounded-[24px] bg-white p-5 cartoon-shadow">
        <div class="space-y-3">
          <div class="relative w-full h-36 overflow-hidden rounded-xl border-2 border-[#242424] bg-[#FFEED5] group">
            <img
              [src]="displayImage()"
              [alt]="session.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div class="absolute top-2.5 left-2.5">
              <span
                class="px-2.5 py-1 rounded-full text-xs font-black uppercase border-2 border-[#242424]"
                [class]="sportBadgeClass()"
              >
                {{ session.sport.name }}
              </span>
            </div>
            <div class="absolute top-2.5 right-2.5 text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFF9EF] border border-[#242424] shadow-[1px_1px_0px_#242424]">
              {{ session.skillLevel }}
            </div>
          </div>

          <div>
            <h3 class="text-lg sm:text-xl font-extrabold text-[#242424] line-clamp-1">
              {{ session.title }}
            </h3>
            <div class="flex items-center gap-1.5 text-xs sm:text-sm text-[#555555] font-semibold mt-1">
              <svg class="w-3.5 h-3.5 text-[#7655F7] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="truncate">{{ session.venue.name }} · {{ session.venue.district }}</span>
            </div>
          </div>

          <div class="flex items-center gap-3 text-xs sm:text-sm font-bold text-[#242424] bg-[#FFF9EF] p-2.5 rounded-xl border border-[#242424]">
            <div class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-[#242424]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formattedDate() }}</span>
            </div>
            <span class="text-[#888888]">|</span>
            <div class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-[#242424]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ session.durationMinutes }} min</span>
            </div>
          </div>

          <app-capacity-meter
            [maxSlots]="session.maxSlots"
            [bookedSlots]="session.bookedSlots"
            [remainingSlots]="session.remainingSlots"
            size="sm"
          />
        </div>

        <div class="pt-4 mt-4 border-t-2 border-dashed border-[#E5E5E5] flex items-center justify-between gap-3">
          <div>
            <span class="text-[11px] font-bold text-[#777777] block uppercase tracking-wider">
              {{ i18nService.t('sessionCardPriceLabelCartoon') }}
            </span>
            <span class="text-base sm:text-lg font-black text-[#242424]">
              {{ formatPrice(session.pricePerSlot) }} UZS
            </span>
          </div>

          <a [routerLink]="['/sessions', session.id]" class="shrink-0">
            <button
              [disabled]="isFull()"
              class="px-4 py-2 rounded-full font-black text-xs border-2 border-[#242424] shadow-[2px_2px_0px_#242424] hover:shadow-[3px_3px_0px_#242424] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              [class]="isFull()
                ? 'bg-white text-[#888888] cursor-not-allowed border-[#888888] shadow-none'
                : isAlmostFull()
                ? 'bg-[#FF795D] text-white hover:bg-[#e65c3e]'
                : 'bg-[#D7FF64] text-[#242424] hover:bg-[#cbf556]'"
            >
              {{ isFull() ? i18nService.t('sessionCardFullBtn') : i18nService.t('sessionCardBookBtn') }}
            </button>
          </a>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionCardComponent {
  @Input({ required: true }) public session!: SessionItem;

  protected readonly themeService = inject(ThemeService);
  protected readonly i18nService = inject(I18nService);

  public displayImage(): string {
    const defaultSportPhotos: Record<string, string> = {
      'table-tennis':
        'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=600&q=80',
      'basketball-3x3':
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
      badminton:
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
      volleyball:
        'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=600&q=80',
    };

    return (
      this.session.imageUrl ||
      defaultSportPhotos[this.session.sport.slug] ||
      defaultSportPhotos['table-tennis']
    );
  }

  public formattedDate(): string {
    try {
      const d = new Date(this.session.scheduledAt);
      if (isNaN(d.getTime())) return this.session.scheduledAt;
      return d.toLocaleDateString('uz-UZ', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return this.session.scheduledAt;
    }
  }

  public isFull(): boolean {
    return this.session.remainingSlots <= 0;
  }

  public isAlmostFull(): boolean {
    return this.session.remainingSlots > 0 && this.session.remainingSlots <= 2;
  }

  public formatPrice(price: number): string {
    return Number(price).toLocaleString();
  }

  public sportBadgeClass(): string {
    const slug = this.session.sport.slug;
    if (slug === 'basketball-3x3') return 'bg-[#FF795D] text-white';
    if (slug === 'table-tennis') return 'bg-[#7655F7] text-white';
    if (slug === 'badminton') return 'bg-[#78D8FF] text-[#242424]';
    return 'bg-[#D7FF64] text-[#242424]';
  }
}
