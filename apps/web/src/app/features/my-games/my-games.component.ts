import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  WritableSignal,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserBooking } from '../../core/models/types';

@Component({
  selector: 'app-my-games',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (!authService.isAuthenticated()) {
      <div class="max-w-xl mx-auto my-16 px-4 text-center space-y-4">
        <h2 class="text-2xl font-black text-[#242424]">
          {{ themeService.theme() === 'editorial' ? i18nService.t('myGamesTitleEditorial') : i18nService.t('myGamesTitleCartoon') }}
        </h2>
        <p class="text-sm font-semibold text-[#666666]">
          {{ themeService.theme() === 'editorial' ? i18nService.t('myGamesSubtitleEditorial') : i18nService.t('myGamesSubtitleCartoon') }}
        </p>
        <button
          (click)="authService.openAuthModal('/my-games')"
          class="px-6 py-3 rounded-full bg-[#7655F7] text-white font-black text-sm"
        >
          {{ i18nService.t('myGamesGoogleLogin') }}
        </button>
      </div>
    } @else {
      @if (themeService.theme() === 'editorial') {
        <div class="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
          <div class="border-b-2 border-double border-[#2D2926] pb-6 space-y-2">
            <div class="text-[11px] font-sans font-bold tracking-widest uppercase text-[#8B7355]">
              ISHTIROKCHI HUJJATLARI
            </div>
            <h1 class="text-3xl sm:text-5xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
              {{ i18nService.t('navMyGames') }}
            </h1>
            <p class="text-sm font-serif italic text-[#8B7355]">
              Siz band qilgan jadvallar, kirish chiptalari va ishtirok hisoboti.
            </p>
          </div>

          @if (errorMessage()) {
            <div class="p-4 bg-[#F2DDD9] border-2 border-[#8B2E2E] text-[#8B2E2E] flex items-center gap-3">
              <span class="font-bold">⚠️</span>
              <div class="text-xs sm:text-sm font-sans font-bold">{{ errorMessage() }}</div>
            </div>
          }

          <div class="flex flex-wrap items-center gap-2 border-b border-[#2D2926]/30 pb-3">
            <button
              (click)="activeTab.set('upcoming')"
              class="px-4 py-2 text-xs font-sans font-bold tracking-widest uppercase border transition-all cursor-pointer"
              [class]="activeTab() === 'upcoming'
                ? 'bg-[#1A1510] text-[#F5F0E8] border-[#1A1510]'
                : 'bg-[#EDE6D5] text-[#1A1510] border-[#2D2926]/40 hover:border-[#1A1510]'"
            >
              § I {{ i18nService.t('myGamesTabUpcoming') }} ({{ upcomingBookings().length }})
            </button>
            <button
              (click)="activeTab.set('past')"
              class="px-4 py-2 text-xs font-sans font-bold tracking-widest uppercase border transition-all cursor-pointer"
              [class]="activeTab() === 'past'
                ? 'bg-[#1A1510] text-[#F5F0E8] border-[#1A1510]'
                : 'bg-[#EDE6D5] text-[#1A1510] border-[#2D2926]/40 hover:border-[#1A1510]'"
            >
              § II {{ i18nService.t('myGamesTabPast') }} ({{ pastBookings().length }})
            </button>
            <button
              (click)="activeTab.set('cancelled')"
              class="px-4 py-2 text-xs font-sans font-bold tracking-widest uppercase border transition-all cursor-pointer"
              [class]="activeTab() === 'cancelled'
                ? 'bg-[#1A1510] text-[#F5F0E8] border-[#1A1510]'
                : 'bg-[#EDE6D5] text-[#1A1510] border-[#2D2926]/40 hover:border-[#1A1510]'"
            >
              § III {{ i18nService.t('myGamesTabCancelled') }} ({{ cancelledBookings().length }})
            </button>
          </div>

          <div>
            @if (loading()) {
              <div class="space-y-4">
                @for (n of [1, 2]; track n) {
                  <div class="h-32 bg-[#EDE6D5] border border-[#2D2926] animate-pulse"></div>
                }
              </div>
            } @else if (currentList().length > 0) {
              <div class="space-y-4">
                @for (item of currentList(); track item.id) {
                  <div class="bg-[#EDE6D5] border border-[#2D2926] p-5 sm:p-6 shadow-[2px_2px_0px_#8B7355] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="space-y-2">
                      <div class="flex items-center gap-2">
                        <span class="text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 bg-[#1A1510] text-[#F5F0E8]">
                          {{ item.sportName }}
                        </span>
                        <span class="text-[11px] font-sans font-bold text-[#8B7355]">
                          PASS #{{ item.id.slice(0, 8).toUpperCase() }}
                        </span>
                      </div>

                      <h3 class="text-lg sm:text-xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                        {{ item.sessionTitle }}
                      </h3>

                      <div class="flex flex-wrap items-center gap-4 text-xs font-sans text-[#8B7355]">
                        <div>{{ item.venueName }} ({{ item.venueDistrict }})</div>
                        <div class="font-semibold text-[#1A1510]">{{ formattedDate(item.scheduledAt) }}</div>
                        <div>{{ item.durationMinutes }} min</div>
                      </div>
                    </div>

                    <div class="flex flex-row sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#2D2926]/20 gap-3">
                      <div class="text-left sm:text-right">
                        <div class="text-[10px] font-sans font-bold text-[#8B7355] uppercase tracking-widest">
                          {{ i18nService.t('totalPrice') }}
                        </div>
                        <div class="text-base sm:text-lg font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                          {{ formatPrice(item.totalPrice) }} UZS
                        </div>
                      </div>

                      <div class="flex items-center gap-2">
                        <a [routerLink]="['/sessions', item.sessionId]">
                          <button class="px-3.5 py-1.5 text-xs font-sans font-bold tracking-widest uppercase bg-[#F5F0E8] border border-[#2D2926] text-[#1A1510] hover:bg-white cursor-pointer">
                            {{ i18nService.t('myGamesViewSession') }}
                          </button>
                        </a>

                        @if (item.isEligibleForCancel) {
                          <button
                            (click)="handleCancelBooking(item.id)"
                            [disabled]="cancellingId() === item.id"
                            class="px-3.5 py-1.5 text-xs font-sans font-bold tracking-widest uppercase bg-[#F2DDD9] border border-[#8B2E2E] text-[#8B2E2E] hover:bg-[#E8C5C0] cursor-pointer"
                          >
                            {{ cancellingId() === item.id ? '...' : i18nService.t('cancelBooking') }}
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-16 px-4 bg-[#EDE6D5] border border-[#2D2926] space-y-4">
                <h3 class="text-2xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                  {{ i18nService.t('emptyGamesTitle') }}
                </h3>
                <p class="text-xs sm:text-sm font-serif italic text-[#8B7355] max-w-md mx-auto">
                  {{ i18nService.t('emptyGamesSubtitle') }}
                </p>
                <a routerLink="/discover">
                  <button class="inline-flex items-center gap-2 px-5 py-2 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] hover:bg-[#332B24] cursor-pointer">
                    <span>{{ i18nService.t('myGamesExploreBtn') }}</span>
                    <span>→</span>
                  </button>
                </a>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
          <div class="space-y-2">
            <span class="inline-block px-3 py-1 rounded-full bg-[#7655F7] text-white text-xs font-black">
              {{ i18nService.t('navMyGames') }}
            </span>
            <h1 class="text-3xl sm:text-5xl font-black text-[#242424]">
              {{ i18nService.t('navMyGames') }}
            </h1>
            <p class="text-sm sm:text-base font-semibold text-[#555555]">
              Barcha bandliklaringiz, oʻyin jadvallari va qatnashish tarixi.
            </p>
          </div>

          @if (errorMessage()) {
            <div class="p-4 rounded-2xl bg-[#FF795D] text-white border-2 border-[#242424] shadow-[4px_4px_0px_#242424] flex items-center gap-3">
              <div class="text-xs sm:text-sm font-bold">{{ errorMessage() }}</div>
            </div>
          }

          <div class="flex items-center gap-2 border-b-2 border-[#E5E5E5] pb-3">
            <button
              (click)="activeTab.set('upcoming')"
              class="px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer"
              [class]="activeTab() === 'upcoming'
                ? 'bg-[#D7FF64] border-[#242424] text-[#242424] shadow-[2px_2px_0px_#242424]'
                : 'bg-white border-transparent text-[#666666] hover:border-[#242424]'"
            >
              {{ i18nService.t('myUpcomingGames') }} ({{ upcomingBookings().length }})
            </button>
            <button
              (click)="activeTab.set('past')"
              class="px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer"
              [class]="activeTab() === 'past'
                ? 'bg-[#78D8FF] border-[#242424] text-[#242424] shadow-[2px_2px_0px_#242424]'
                : 'bg-white border-transparent text-[#666666] hover:border-[#242424]'"
            >
              {{ i18nService.t('myPastGames') }} ({{ pastBookings().length }})
            </button>
            <button
              (click)="activeTab.set('cancelled')"
              class="px-4 py-2 rounded-full font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer"
              [class]="activeTab() === 'cancelled'
                ? 'bg-[#FF795D] border-[#242424] text-white shadow-[2px_2px_0px_#242424]'
                : 'bg-white border-transparent text-[#666666] hover:border-[#242424]'"
            >
              {{ i18nService.t('myCancelledGames') }} ({{ cancelledBookings().length }})
            </button>
          </div>

          <div>
            @if (loading()) {
              <div class="space-y-4">
                @for (n of [1, 2]; track n) {
                  <div class="h-36 rounded-3xl bg-white border-2 border-[#242424] animate-pulse"></div>
                }
              </div>
            } @else if (currentList().length > 0) {
              <div class="space-y-4">
                @for (item of currentList(); track item.id) {
                  <div class="border-[2.5px] border-[#242424] rounded-3xl bg-white p-5 sm:p-6 cartoon-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="space-y-2">
                      <div class="flex items-center gap-2">
                        <span class="px-2.5 py-0.5 rounded-full bg-[#D7FF64] border border-[#242424] text-xs font-black">
                          {{ item.sportName }}
                        </span>
                        <span class="text-xs font-bold text-[#888888]">
                          #{{ item.id.slice(0, 8).toUpperCase() }}
                        </span>
                      </div>

                      <h3 class="text-lg sm:text-xl font-black text-[#242424]">
                        {{ item.sessionTitle }}
                      </h3>

                      <div class="flex flex-wrap items-center gap-4 text-xs font-bold text-[#555555]">
                        <div>{{ item.venueName }} ({{ item.venueDistrict }})</div>
                        <div class="text-[#242424] font-black">{{ formattedDate(item.scheduledAt) }}</div>
                        <div>{{ item.durationMinutes }} min</div>
                      </div>
                    </div>

                    <div class="flex flex-row sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#EEEEEE] gap-3">
                      <div class="text-left sm:text-right">
                        <div class="text-[11px] font-bold text-[#888888] uppercase">
                          {{ i18nService.t('totalPrice') }}
                        </div>
                        <div class="text-base sm:text-lg font-black text-[#242424]">
                          {{ formatPrice(item.totalPrice) }} UZS
                        </div>
                      </div>

                      <div class="flex items-center gap-2">
                        <a [routerLink]="['/sessions', item.sessionId]">
                          <button class="px-3.5 py-2 rounded-full bg-white border-2 border-[#242424] text-xs font-black shadow-[2px_2px_0px_#242424]">
                            {{ i18nService.t('myGamesViewSession') }}
                          </button>
                        </a>

                        @if (item.isEligibleForCancel) {
                          <button
                            (click)="handleCancelBooking(item.id)"
                            [disabled]="cancellingId() === item.id"
                            class="px-3.5 py-2 rounded-full bg-[#FF795D] text-white border-2 border-[#242424] text-xs font-black shadow-[2px_2px_0px_#242424]"
                          >
                            {{ cancellingId() === item.id ? '...' : i18nService.t('cancelBooking') }}
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-16 space-y-4">
                <h3 class="text-2xl font-black text-[#242424]">
                  {{ i18nService.t('emptyGamesTitle') }}
                </h3>
                <p class="text-sm font-semibold text-[#666666] max-w-sm mx-auto">
                  {{ i18nService.t('emptyGamesSubtitle') }}
                </p>
                <a routerLink="/discover">
                  <button class="px-6 py-3 rounded-full bg-[#D7FF64] border-2 border-[#242424] text-sm font-black shadow-[3px_3px_0px_#242424]">
                    {{ i18nService.t('myGamesExploreBtn') }}
                  </button>
                </a>
              </div>
            }
          </div>
        </div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyGamesComponent implements OnInit {
  protected readonly api = inject(ApiService);
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly i18nService = inject(I18nService);

  public readonly bookings: WritableSignal<UserBooking[]> = signal<UserBooking[]>([]);
  public readonly loading: WritableSignal<boolean> = signal<boolean>(true);
  public readonly activeTab: WritableSignal<'upcoming' | 'past' | 'cancelled'> = signal<'upcoming' | 'past' | 'cancelled'>('upcoming');
  public readonly cancellingId: WritableSignal<string | null> = signal<string | null>(null);
  public readonly errorMessage: WritableSignal<string | null> = signal<string | null>(null);

  public readonly upcomingBookings: Signal<UserBooking[]> = computed(() => {
    const now = Date.now();
    return this.bookings().filter((b) => {
      const time = new Date(b.scheduledAt).getTime();
      return b.status === 'CONFIRMED' && time >= now;
    });
  });

  public readonly pastBookings: Signal<UserBooking[]> = computed(() => {
    const now = Date.now();
    return this.bookings().filter((b) => {
      const time = new Date(b.scheduledAt).getTime();
      return (b.status === 'CONFIRMED' && time < now) || b.status === 'COMPLETED';
    });
  });

  public readonly cancelledBookings: Signal<UserBooking[]> = computed(() => {
    return this.bookings().filter((b) => b.status === 'CANCELLED');
  });

  public readonly currentList: Signal<UserBooking[]> = computed(() => {
    const tab = this.activeTab();
    if (tab === 'upcoming') return this.upcomingBookings();
    if (tab === 'past') return this.pastBookings();
    return this.cancelledBookings();
  });

  public async ngOnInit(): Promise<void> {
    if (this.authService.isAuthenticated()) {
      await this.loadBookings();
    } else {
      this.loading.set(false);
    }
  }

  public async loadBookings(): Promise<void> {
    try {
      this.loading.set(true);
      const data = await this.api.fetchMyBookings();
      this.bookings.set(data);
    } catch {
      this.bookings.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  public async handleCancelBooking(bookingId: string): Promise<void> {
    this.cancellingId.set(bookingId);
    this.errorMessage.set(null);
    try {
      await this.api.cancelBooking(bookingId);
      await this.loadBookings();
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Bekor qilishda xatolik yuz berdi');
    } finally {
      this.cancellingId.set(null);
    }
  }

  public formattedDate(dateStr: string): string {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('uz-UZ', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  }

  public formatPrice(price: number): string {
    return Number(price).toLocaleString();
  }
}
