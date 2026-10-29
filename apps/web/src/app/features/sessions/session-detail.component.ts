import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';
import { SessionDetail } from '../../core/models/types';
import { CapacityMeterComponent } from '../../shared/components/capacity-meter/capacity-meter.component';
import { MascotComponent } from '../../shared/components/mascot/mascot.component';

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CapacityMeterComponent, MascotComponent],
  template: `
    @if (loading()) {
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div
          class="h-96 animate-pulse"
          [class]="themeService.theme() === 'editorial' ? 'bg-[#EDE6D5] border border-[#2D2926]' : 'bg-white border-2 border-[#242424] rounded-3xl'"
        ></div>
      </div>
    } @else if (!session()) {
      <div class="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        @if (themeService.theme() === 'editorial') {
          <div class="bg-[#EDE6D5] border border-[#2D2926] p-8 space-y-4">
            <h2 class="text-2xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
              {{ i18nService.t('sessionNotFound') }}
            </h2>
            <p class="text-xs font-serif italic text-[#8B7355]">
              {{ i18nService.t('sessionNotFoundDescEditorial') }}
            </p>
            <a
              routerLink="/discover"
              class="inline-block px-4 py-2 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926]"
            >
              {{ i18nService.t('sessionBackToGames') }}
            </a>
          </div>
        } @else {
          <app-mascot size="lg" mood="sleepy" />
          <h2 class="text-2xl font-black text-[#242424]">{{ i18nService.t('sessionNotFound') }}</h2>
          <a
            routerLink="/discover"
            class="inline-block px-4 py-2 rounded-full bg-[#D7FF64] border-2 border-[#242424] text-xs font-black shadow-[2px_2px_0px_#242424]"
          >
            {{ i18nService.t('sessionNotFoundDescCartoon') }}
          </a>
        }
      </div>
    } @else {
      @let s = session()!;

      @if (themeService.theme() === 'editorial') {
        <div class="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
          <div class="flex items-center justify-between pb-4 border-b border-[#2D2926]/30">
            <a
              routerLink="/discover"
              class="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-widest uppercase text-[#8B7355] hover:text-[#1A1510] cursor-pointer"
            >
              <span>← {{ i18nService.t('sessionBackToSchedule') }}</span>
            </a>

            <span class="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
              {{ i18nService.t('sessionDossier') }} {{ s.id.slice(0, 8).toUpperCase() }}
            </span>
          </div>

          <div class="relative w-full h-56 sm:h-72 overflow-hidden border-2 border-[#2D2926] bg-[#EDE6D5] shadow-[3px_3px_0px_#2D2926]">
            <img [src]="displayImage(s)" [alt]="s.title" class="w-full h-full object-cover grayscale contrast-125" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#1A1510]/80 via-[#1A1510]/20 to-transparent"></div>
            <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div class="space-y-1">
                <span class="text-[10px] font-sans font-extrabold uppercase tracking-widest px-2.5 py-1 bg-[#F5F0E8] text-[#1A1510]">
                  {{ s.sport.name }}
                </span>
                <h2 class="text-xl sm:text-3xl font-bold text-[#F5F0E8] drop-shadow" style="font-family: Georgia, serif">
                  {{ s.title }}
                </h2>
              </div>
              <div class="text-right text-xs font-sans text-[#F5F0E8]/90 font-bold uppercase tracking-wider hidden sm:block">
                {{ s.venue.name }} · {{ s.venue.district }}
              </div>
            </div>
          </div>

          @if (successMessage()) {
            <div class="p-4 bg-[#EDE6D5] border-2 border-[#1A1510] text-[#1A1510] flex items-center gap-3">
              <span class="text-[#C5A55A] font-bold">✓</span>
              <div class="text-xs sm:text-sm font-sans font-bold uppercase tracking-wider">{{ successMessage() }}</div>
            </div>
          }

          @if (errorMessage()) {
            <div class="p-4 bg-[#F2DDD9] border-2 border-[#8B2E2E] text-[#8B2E2E] flex items-center gap-3">
              <span class="font-bold">⚠️</span>
              <div class="text-xs sm:text-sm font-sans font-bold">{{ errorMessage() }}</div>
            </div>
          }

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-[#EDE6D5] border border-[#2D2926] p-6 sm:p-8 shadow-[2px_2px_0px_#8B7355] space-y-6">
                <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#2D2926]/20">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-sans font-extrabold uppercase tracking-widest px-2.5 py-1 bg-[#1A1510] text-[#F5F0E8]">
                      {{ s.sport.name }}
                    </span>
                    <span class="text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 bg-[#F5F0E8] border border-[#2D2926]/40 text-[#8B7355]">
                      {{ s.skillLevel }}
                    </span>
                    <span class="text-xs font-sans font-bold uppercase tracking-wider px-2.5 py-1 bg-[#F5F0E8] border border-[#2D2926]/40 text-[#8B7355]">
                      {{ s.sessionVibe }}
                    </span>
                  </div>

                  <button
                    (click)="handleShare(s)"
                    class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-sans font-bold tracking-widest uppercase border border-[#2D2926] bg-[#F5F0E8] hover:bg-white text-[#1A1510] cursor-pointer"
                  >
                    <span>{{ i18nService.t('shareGame') }}</span>
                  </button>
                </div>

                <div>
                  <h1 class="text-2xl sm:text-4xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                    {{ s.title }}
                  </h1>
                  <div class="flex items-center gap-2 text-sm text-[#8B7355] font-sans mt-2">
                    <span class="font-semibold">{{ s.venue.name }} · {{ s.venue.district }}</span>
                  </div>
                  <div class="text-xs text-[#8B7355] font-serif italic pl-4 mt-0.5">
                    {{ s.venue.address }}
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F5F0E8] p-4 border border-[#2D2926]/30">
                  <div>
                    <div class="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">{{ i18nService.t('sessionTime') }}</div>
                    <div class="text-xs sm:text-sm font-sans font-bold text-[#1A1510]">{{ formattedDate(s.scheduledAt) }}</div>
                  </div>
                  <div>
                    <div class="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">{{ i18nService.t('sessionDuration') }}</div>
                    <div class="text-xs sm:text-sm font-sans font-bold text-[#1A1510]">{{ s.durationMinutes }} min</div>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">{{ i18nService.t('sessionCapacityState') }}</div>
                  <app-capacity-meter [maxSlots]="s.maxSlots" [bookedSlots]="s.bookedSlots" [remainingSlots]="s.remainingSlots" size="lg" />
                </div>

                <div class="space-y-3 pt-2">
                  <div class="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8B7355] border-b border-[#2D2926]/20 pb-1">
                    {{ i18nService.t('sessionParticipantsRegistry') }} ({{ s.participants.length }} / {{ s.maxSlots }})
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    @for (player of s.participants; track player.userId; let idx = $index) {
                      <div class="flex items-center justify-between p-2.5 bg-[#F5F0E8] border border-[#2D2926]/30">
                        <div class="flex items-center gap-2.5">
                          <span class="text-[10px] font-sans font-extrabold text-[#8B7355]">№ {{ idx + 1 }}</span>
                          <span class="text-xs font-sans font-bold text-[#1A1510]">{{ player.firstName }}</span>
                        </div>
                        <span class="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8B7355]">{{ player.skillLevel }}</span>
                      </div>
                    }
                  </div>
                </div>

                @if (s.equipmentDetails) {
                  <div class="p-4 bg-[#F5F0E8] border border-[#2D2926]/30 space-y-1">
                    <div class="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">§ {{ i18nService.t('equipmentProvided') }}</div>
                    <div class="text-xs font-serif text-[#1A1510]">{{ s.equipmentDetails }}</div>
                  </div>
                }

                @if (s.rulesNotes) {
                  <div class="p-4 bg-[#F5F0E8] border border-[#2D2926]/30 space-y-1">
                    <div class="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">§ {{ i18nService.t('rulesAndNotes') }}</div>
                    <div class="text-xs font-serif text-[#1A1510]">{{ s.rulesNotes }}</div>
                  </div>
                }
              </div>
            </div>

            <div class="space-y-6">
              <div class="bg-[#EDE6D5] border-2 border-[#2D2926] p-6 shadow-[3px_3px_0px_#2D2926] space-y-5">
                <div class="text-center pb-3 border-b-2 border-dashed border-[#2D2926]/40">
                  <span class="text-[10px] font-sans font-extrabold tracking-widest uppercase text-[#8B7355] block">{{ i18nService.t('sessionTicketPass') }}</span>
                  <span class="text-lg font-bold text-[#1A1510]" style="font-family: Georgia, serif">PLEY.UZ TICKET PASS</span>
                </div>

                <div class="space-y-2.5 text-xs font-sans">
                  <div class="flex justify-between text-[#8B7355]">
                    <span>{{ i18nService.t('sessionCardPriceLabelEditorial') }}</span>
                    <span class="font-bold text-[#1A1510]">{{ formatPrice(s.pricePerSlot) }} UZS</span>
                  </div>
                  <div class="flex justify-between text-[#8B7355]">
                    <span>{{ i18nService.t('serviceFee') }}</span>
                    <span class="font-bold text-[#1A1510]">{{ formatPrice(s.serviceFee) }} UZS</span>
                  </div>
                  <div class="pt-2 border-t border-[#2D2926]/20 flex justify-between items-baseline">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-[#1A1510]">{{ i18nService.t('totalPrice') }}</span>
                    <span class="text-2xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">{{ formatPrice(s.totalPrice) }} UZS</span>
                  </div>
                </div>

                <div class="pt-2">
                  @if (s.currentUserBookingStatus) {
                    <div class="space-y-3">
                      <div class="flex items-center justify-center gap-2 p-2.5 bg-[#F5F0E8] border border-[#2D2926] text-xs font-sans font-bold uppercase tracking-wider text-[#1A1510]">
                        <span>✓ {{ i18nService.t('sessionAlreadyBooked') }}</span>
                      </div>
                      <button
                        (click)="handleCancel()"
                        [disabled]="actionLoading()"
                        class="w-full py-2.5 text-xs font-sans font-bold tracking-widest uppercase bg-[#F2DDD9] border border-[#8B2E2E] text-[#8B2E2E] hover:bg-[#E8C5C0] cursor-pointer"
                      >
                        {{ actionLoading() ? i18nService.t('sessionCancelling') : i18nService.t('cancelBooking') }}
                      </button>
                    </div>
                  } @else if (s.remainingSlots <= 0) {
                    <button disabled class="w-full py-3 text-xs font-sans font-bold tracking-widest uppercase bg-[#E0D8C7] text-[#8B7355] border border-[#8B7355]/30 cursor-not-allowed">
                      {{ i18nService.t('spotsFull') }}
                    </button>
                  } @else if (!authService.isAuthenticated()) {
                    <button
                      (click)="authService.openAuthModal('/sessions/' + s.id)"
                      class="w-full py-3 text-xs font-sans font-extrabold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] hover:bg-[#332B24] border border-[#2D2926] transition-all cursor-pointer"
                    >
                      {{ i18nService.t('sessionLoginToBook') }}
                    </button>
                  } @else {
                    <button
                      (click)="handleBook()"
                      [disabled]="actionLoading()"
                      class="w-full py-3.5 text-xs font-sans font-extrabold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] hover:bg-[#332B24] border border-[#2D2926] transition-all cursor-pointer"
                    >
                      {{ actionLoading() ? i18nService.t('sessionBookingProcess') : i18nService.t('grabSpot') }}
                    </button>
                  }
                </div>

                <div class="pt-3 border-t border-[#2D2926]/20 flex items-start gap-2.5 text-[11px] font-sans text-[#8B7355] leading-relaxed">
                  <span>🛡️ Oʻyin boshlanishiga kamida {{ s.cancellationDeadlineHours }} soat qolganda jarimasiz bekor qilish kafolatlanadi.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-6">
          <a routerLink="/discover" class="inline-flex items-center gap-1.5 text-xs font-black text-[#242424] hover:text-[#7655F7] transition-colors cursor-pointer">
            <span>← {{ i18nService.t('sessionBackToGames') }}</span>
          </a>

          @if (successMessage()) {
            <div class="p-4 rounded-2xl bg-[#D7FF64] border-2 border-[#242424] shadow-[4px_4px_0px_#242424] flex items-center gap-3">
              <span class="text-sm font-black text-[#242424]">{{ successMessage() }}</span>
            </div>
          }

          @if (errorMessage()) {
            <div class="p-4 rounded-2xl bg-[#FF795D] text-white border-2 border-[#242424] shadow-[4px_4px_0px_#242424] flex items-center gap-3">
              <div class="text-xs sm:text-sm font-bold">{{ errorMessage() }}</div>
            </div>
          }

          <div class="relative w-full h-56 sm:h-72 overflow-hidden rounded-3xl border-3 border-[#242424] shadow-[6px_6px_0px_#242424] bg-[#FFEED5]">
            <img [src]="displayImage(s)" [alt]="s.title" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#242424]/80 via-transparent to-transparent"></div>
            <div class="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-end justify-between gap-2">
              <div>
                <span class="px-2.5 py-1 rounded-full bg-[#7655F7] text-white text-xs font-black uppercase">
                  {{ s.sport.name }}
                </span>
                <div class="text-lg sm:text-2xl font-black text-white mt-1 drop-shadow-md">
                  {{ s.venue.name }}
                </div>
              </div>
              <div class="text-xs sm:text-sm font-black text-white bg-[#242424]/80 px-3 py-1 rounded-full border border-white/20">
                {{ s.venue.district }}
              </div>
            </div>
          </div>

          <div class="space-y-6 p-6 sm:p-8 rounded-[28px] border-[2.5px] border-[#242424] bg-white cartoon-shadow">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-full bg-[#7655F7] text-white text-xs font-black uppercase">{{ s.sport.name }}</span>
                <span class="px-2.5 py-1 rounded-full bg-[#FFF9EF] border border-[#242424] text-xs font-black text-[#242424]">{{ s.skillLevel }}</span>
                <span class="px-2.5 py-1 rounded-full bg-[#D7FF64] border border-[#242424] text-xs font-black text-[#242424]">{{ s.sessionVibe }}</span>
              </div>

              <button
                (click)="handleShare(s)"
                class="px-3.5 py-1.5 rounded-full bg-white border-2 border-[#242424] text-xs font-black shadow-[2px_2px_0px_#242424]"
              >
                {{ i18nService.t('shareGame') }}
              </button>
            </div>

            <div>
              <h1 class="text-2xl sm:text-4xl font-black text-[#242424]">{{ s.title }}</h1>
              <div class="text-sm font-bold text-[#555555] mt-1">{{ s.venue.name }} · {{ s.venue.district }}</div>
              <div class="text-xs text-[#777777] font-medium pl-2">{{ s.venue.address }}</div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FFF9EF] p-4 rounded-2xl border-2 border-[#242424]">
              <div>
                <div class="text-[11px] font-black uppercase text-[#888888]">{{ i18nService.t('sessionTime') }}</div>
                <div class="text-sm font-black text-[#242424]">{{ formattedDate(s.scheduledAt) }}</div>
              </div>
              <div>
                <div class="text-[11px] font-black uppercase text-[#888888]">{{ i18nService.t('sessionDuration') }}</div>
                <div class="text-sm font-black text-[#242424]">{{ s.durationMinutes }} min</div>
              </div>
            </div>

            <div class="space-y-2">
              <div class="text-xs font-black uppercase text-[#888888]">{{ i18nService.t('sessionCapacityState') }}</div>
              <app-capacity-meter [maxSlots]="s.maxSlots" [bookedSlots]="s.bookedSlots" [remainingSlots]="s.remainingSlots" size="lg" />
            </div>

            <div class="space-y-3 pt-2">
              <div class="text-xs font-black uppercase text-[#888888]">{{ i18nService.t('registeredPlayers') }} ({{ s.participants.length }})</div>
              <div class="flex flex-wrap gap-2.5">
                @for (player of s.participants; track player.userId) {
                  <div class="flex items-center gap-2 bg-[#FFF9EF] border-2 border-[#242424] px-3 py-1.5 rounded-full shadow-[2px_2px_0px_#242424]">
                    <span class="text-xs font-black text-[#242424]">{{ player.firstName }}</span>
                    <span class="text-[10px] font-bold text-[#7655F7]">• {{ player.skillLevel }}</span>
                  </div>
                }
              </div>
            </div>

            @if (s.equipmentDetails) {
              <div class="p-4 rounded-2xl bg-white border-2 border-[#242424] space-y-1">
                <div class="text-xs font-black uppercase text-[#7655F7]">{{ i18nService.t('equipmentProvided') }}</div>
                <div class="text-xs sm:text-sm font-medium text-[#444444]">{{ s.equipmentDetails }}</div>
              </div>
            }

            @if (s.rulesNotes) {
              <div class="p-4 rounded-2xl bg-[#FFF9EF] border-2 border-[#242424] space-y-1">
                <div class="text-xs font-black uppercase text-[#242424]">{{ i18nService.t('rulesAndNotes') }}</div>
                <div class="text-xs sm:text-sm font-medium text-[#444444]">{{ s.rulesNotes }}</div>
              </div>
            }

            <div class="p-5 rounded-3xl bg-[#242424] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div class="text-xs font-bold text-[#AAAAAA] uppercase">{{ i18nService.t('totalPrice') }}</div>
                <div class="text-2xl sm:text-3xl font-black text-[#D7FF64]">{{ formatPrice(s.totalPrice) }} UZS</div>
              </div>

              <div class="w-full sm:w-auto">
                @if (s.currentUserBookingStatus) {
                  <div class="flex flex-col sm:flex-row items-center gap-3">
                    <span class="text-xs font-black text-[#D7FF64]">✓ {{ i18nService.t('sessionAlreadyBooked') }}</span>
                    <button
                      (click)="handleCancel()"
                      [disabled]="actionLoading()"
                      class="px-4 py-2 rounded-full bg-[#FF795D] text-white font-bold text-xs"
                    >
                      {{ actionLoading() ? i18nService.t('sessionCancelling') : i18nService.t('cancelBooking') }}
                    </button>
                  </div>
                } @else if (s.remainingSlots <= 0) {
                  <button disabled class="px-5 py-3 rounded-full bg-white text-[#888888] font-black text-sm">
                    {{ i18nService.t('spotsFull') }}
                  </button>
                } @else if (!authService.isAuthenticated()) {
                  <button
                    (click)="authService.openAuthModal('/sessions/' + s.id)"
                    class="px-5 py-3 rounded-full bg-[#7655F7] text-white font-black text-sm"
                  >
                    {{ i18nService.t('sessionLoginToBook') }}
                  </button>
                } @else {
                  <button
                    (click)="handleBook()"
                    [disabled]="actionLoading()"
                    class="px-6 py-3 rounded-full bg-[#D7FF64] text-[#242424] font-black text-base border-2 border-[#242424] shadow-[3px_3px_0px_#242424]"
                  >
                    {{ actionLoading() ? i18nService.t('sessionBookingProcess') : i18nService.t('grabSpot') }}
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDetailComponent implements OnInit {
  protected readonly api = inject(ApiService);
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly i18nService = inject(I18nService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly session: WritableSignal<SessionDetail | null> = signal<SessionDetail | null>(null);
  public readonly loading: WritableSignal<boolean> = signal<boolean>(true);
  public readonly actionLoading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly errorMessage: WritableSignal<string | null> = signal<string | null>(null);
  public readonly successMessage: WritableSignal<string | null> = signal<string | null>(null);

  public async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }
    await this.loadData(id);
  }

  public async loadData(id: string): Promise<void> {
    try {
      this.loading.set(true);
      const data = await this.api.fetchSessionById(id);
      this.session.set(data);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Failed to load session');
    } finally {
      this.loading.set(false);
    }
  }

  public async handleBook(): Promise<void> {
    const s = this.session();
    if (!s) return;
    this.actionLoading.set(true);
    this.errorMessage.set(null);
    try {
      await this.api.reserveSpot(s.id);
      this.successMessage.set(this.i18nService.t('bookingConfirmed'));
      await this.loadData(s.id);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Joy band qilishda xatolik yuz berdi');
    } finally {
      this.actionLoading.set(false);
    }
  }

  public async handleCancel(): Promise<void> {
    const s = this.session();
    if (!s?.currentUserBookingId) return;
    this.actionLoading.set(true);
    this.errorMessage.set(null);
    try {
      await this.api.cancelBooking(s.currentUserBookingId);
      this.successMessage.set('Bandlik bekor qilindi');
      await this.loadData(s.id);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Bekor qilishda xatolik');
    } finally {
      this.actionLoading.set(false);
    }
  }

  public async handleShare(s: SessionDetail): Promise<void> {
    const shareText = `Pley.uz orqali ${s.sport.name} oʻynashga qoʻshiling! ${s.venue.name} (${s.venue.district}). Joylar soni cheklangan!`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://pley.uz';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: s.title, text: shareText, url: shareUrl });
      } catch {}
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      this.successMessage.set('Havola nusxalandi!');
      setTimeout(() => this.successMessage.set(null), 3000);
    }
  }

  public displayImage(s: SessionDetail): string {
    const defaultSportPhotos: Record<string, string> = {
      'table-tennis': 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1200&q=80',
      'basketball-3x3': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
      volleyball: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
    };
    return s.imageUrl || defaultSportPhotos[s.sport.slug] || defaultSportPhotos['table-tennis'];
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
