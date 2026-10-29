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
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';
import { SessionItem } from '../../core/models/types';
import { SessionCardComponent } from '../../shared/components/session-card/session-card.component';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule, FormsModule, SessionCardComponent],
  template: `
    @if (themeService.theme() === 'editorial') {
      <div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        <div class="border-b-2 border-double border-[#2D2926] pb-6 space-y-3">
          <div class="flex items-center justify-between text-[11px] font-sans font-bold tracking-widest uppercase text-[#8B7355]">
            <span>{{ i18nService.t('discoverEditorialSection') }}</span>
            <span>{{ i18nService.t('discoverEditorialVolume') }}</span>
            <span>{{ i18nService.t('discoverEditorialChapter') }}</span>
          </div>

          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
            <div>
              <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1510]" style="font-family: Georgia, serif">
                {{ i18nService.t('discoverEditorialTitle') }}
              </h1>
              <p class="text-sm font-serif italic text-[#8B7355] mt-1 max-w-2xl">
                {{ i18nService.t('discoverEditorialSubtitle') }}
              </p>
            </div>

            <div class="border border-[#2D2926] bg-[#EDE6D5] p-3 text-right shrink-0">
              <div class="text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#8B7355]">
                {{ i18nService.t('discoverEditorialListed') }}
              </div>
              <div class="text-2xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                {{ filteredSessions().length }} {{ i18nService.t('discoverEditorialDatesCount') }}
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#EDE6D5] border border-[#2D2926] p-5 sm:p-7 shadow-[2px_2px_0px_#8B7355] space-y-6">
          <div class="flex items-center justify-between border-b border-[#2D2926]/20 pb-3">
            <div class="flex items-center gap-2 text-xs font-sans font-bold tracking-widest uppercase text-[#1A1510]">
              <span>🔍</span>
              <span>{{ i18nService.t('discoverFilterCriteria') }}</span>
            </div>
            @if (hasActiveFilters()) {
              <button
                (click)="resetFilters()"
                class="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#8B7355] hover:text-[#1A1510] cursor-pointer"
              >
                <span>↺</span>
                <span>{{ i18nService.t('discoverResetFilters') }}</span>
              </button>
            }
          </div>

          <div class="relative">
            <input
              type="text"
              [ngModel]="search()"
              (ngModelChange)="search.set($event); loadSessions()"
              [placeholder]="i18nService.t('discoverSearchInputPlaceholder')"
              class="w-full pl-4 pr-4 py-3 bg-[#F5F0E8] border border-[#2D2926] font-sans text-xs sm:text-sm text-[#1A1510] placeholder:text-[#8B7355]/60 outline-none focus:border-[#1A1510]"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div class="space-y-2">
              <div class="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                {{ i18nService.t('discoverSectionSport') }}
              </div>
              <div class="flex flex-wrap gap-2">
                @for (sport of sportsList; track sport.id) {
                  <button
                    (click)="setSport(sport.id)"
                    class="px-3.5 py-1.5 text-xs font-sans font-bold tracking-wider uppercase border transition-all cursor-pointer"
                    [class]="selectedSport() === sport.id
                      ? 'bg-[#1A1510] text-[#F5F0E8] border-[#1A1510]'
                      : 'bg-[#F5F0E8] text-[#1A1510] border-[#2D2926]/40 hover:border-[#1A1510]'"
                  >
                    {{ sport.label }}
                  </button>
                }
              </div>
            </div>

            <div class="space-y-2">
              <div class="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                {{ i18nService.t('discoverSectionDistrict') }}
              </div>
              <div class="flex flex-wrap gap-2">
                @for (dist of districtsList; track dist.id) {
                  <button
                    (click)="setDistrict(dist.id)"
                    class="px-3.5 py-1.5 text-xs font-sans font-bold tracking-wider uppercase border transition-all cursor-pointer"
                    [class]="selectedDistrict() === dist.id
                      ? 'bg-[#1A1510] text-[#F5F0E8] border-[#1A1510]'
                      : 'bg-[#F5F0E8] text-[#1A1510] border-[#2D2926]/40 hover:border-[#1A1510]'"
                  >
                    {{ dist.label }}
                  </button>
                }
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-[#2D2926]/20 flex items-center justify-between">
            <label class="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#1A1510] cursor-pointer">
              <input
                type="checkbox"
                [checked]="onlyAvailable()"
                (change)="onlyAvailable.set(!onlyAvailable())"
                class="w-4 h-4 accent-[#1A1510] rounded-none border-[#2D2926]"
              />
              <span>{{ i18nService.t('discoverOnlyAvailable') }}</span>
            </label>
            <div class="text-[11px] font-sans text-[#8B7355] italic">
              {{ i18nService.t('discoverGuaranteeNotice') }}
            </div>
          </div>
        </div>

        <div>
          @if (loading()) {
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              @for (n of [1, 2, 3]; track n) {
                <div class="h-64 bg-[#EDE6D5] border border-[#2D2926] animate-pulse p-6"></div>
              }
            </div>
          } @else if (filteredSessions().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (session of filteredSessions(); track session.id) {
                <app-session-card [session]="session" />
              }
            </div>
          } @else {
            <div class="text-center py-16 px-4 bg-[#EDE6D5] border border-[#2D2926] space-y-4">
              <h3 class="text-2xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                {{ i18nService.t('discoverNoGamesTitle') }}
              </h3>
              <p class="text-xs sm:text-sm font-serif italic text-[#8B7355] max-w-md mx-auto">
                {{ i18nService.t('discoverNoGamesSubtitle') }}
              </p>
              <button
                (click)="resetFilters()"
                class="px-5 py-2 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] hover:bg-[#332B24]"
              >
                {{ i18nService.t('discoverShowAllGames') }}
              </button>
            </div>
          }
        </div>
      </div>
    } @else {
      <div class="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        <div class="space-y-2 text-center sm:text-left">
          <span class="inline-block px-3 py-1 rounded-full bg-[#D7FF64] border-2 border-[#242424] text-xs font-black text-[#242424]">
            {{ i18nService.t('brandTagline') }}
          </span>
          <h1 class="text-3xl sm:text-5xl font-black text-[#242424]">
            {{ i18nService.t('discoverHeroTitle') }}
          </h1>
          <p class="text-sm sm:text-base font-semibold text-[#555555]">
            {{ i18nService.t('discoverHeroSubtitle') }}
          </p>
        </div>

        <div class="bg-white border-[2.5px] border-[#242424] rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_#242424] space-y-5">
          <div class="relative">
            <input
              type="text"
              [ngModel]="search()"
              (ngModelChange)="search.set($event); loadSessions()"
              [placeholder]="i18nService.t('searchPlaceholder')"
              class="w-full px-4 py-3.5 rounded-2xl bg-[#FFF9EF] border-2 border-[#242424] font-bold text-sm outline-none focus:bg-white transition-colors"
            />
          </div>

          <div class="space-y-2">
            <div class="text-xs font-black uppercase text-[#888888]">
              {{ i18nService.t('discoverSportLabel') }}
            </div>
            <div class="flex flex-wrap gap-2">
              @for (sport of sportsList; track sport.id) {
                <button
                  (click)="setSport(sport.id)"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold border-2 border-[#242424] transition-all"
                  [class]="selectedSport() === sport.id
                    ? 'bg-[#7655F7] text-white shadow-[2px_2px_0px_#242424]'
                    : 'bg-[#FFF9EF] text-[#242424] hover:bg-white'"
                >
                  <span>{{ sport.icon }}</span>
                  <span>{{ sport.label }}</span>
                </button>
              }
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#EEEEEE]">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-black uppercase text-[#888888] mr-1">
                {{ i18nService.t('discoverDistrictLabel') }}
              </span>
              @for (dist of districtsList; track dist.id) {
                <button
                  (click)="setDistrict(dist.id)"
                  class="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all"
                  [class]="selectedDistrict() === dist.id
                    ? 'bg-[#D7FF64] border-[#242424] text-[#242424] shadow-[2px_2px_0px_#242424]'
                    : 'bg-white border-[#E0E0E0] hover:border-[#242424] text-[#444444]'"
                >
                  {{ dist.label }}
                </button>
              }
            </div>

            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 text-xs font-bold text-[#242424] cursor-pointer">
                <input
                  type="checkbox"
                  [checked]="onlyAvailable()"
                  (change)="onlyAvailable.set(!onlyAvailable())"
                  class="w-4 h-4 rounded accent-[#7655F7]"
                />
                <span>{{ i18nService.t('discoverOnlyAvailableShort') }}</span>
              </label>

              @if (hasActiveFilters()) {
                <button
                  (click)="resetFilters()"
                  class="inline-flex items-center gap-1 text-xs font-black text-[#FF795D] hover:underline cursor-pointer"
                >
                  <span>↺</span>
                  <span>{{ i18nService.t('discoverClear') }}</span>
                </button>
              }
            </div>
          </div>
        </div>

        <div>
          @if (loading()) {
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              @for (n of [1, 2, 3]; track n) {
                <div class="h-64 rounded-3xl bg-white border-2 border-[#242424] animate-pulse p-6"></div>
              }
            </div>
          } @else if (filteredSessions().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (session of filteredSessions(); track session.id) {
                <app-session-card [session]="session" />
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
              <button
                (click)="resetFilters()"
                class="px-5 py-2.5 rounded-full bg-[#D7FF64] border-2 border-[#242424] text-xs font-black shadow-[2px_2px_0px_#242424]"
              >
                {{ i18nService.t('discoverShowAllGames') }}
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverComponent implements OnInit {
  protected readonly api = inject(ApiService);
  protected readonly themeService = inject(ThemeService);
  protected readonly i18nService = inject(I18nService);
  private readonly route = inject(ActivatedRoute);

  public readonly sessions: WritableSignal<SessionItem[]> = signal<SessionItem[]>([]);
  public readonly loading: WritableSignal<boolean> = signal<boolean>(true);
  public readonly search: WritableSignal<string> = signal<string>('');
  public readonly selectedSport: WritableSignal<string> = signal<string>('');
  public readonly selectedDistrict: WritableSignal<string> = signal<string>('');
  public readonly onlyAvailable: WritableSignal<boolean> = signal<boolean>(false);

  public readonly sportsList = [
    { id: '', label: 'Barcha sportlar', icon: '⚡' },
    { id: 'table-tennis', label: 'Stol tennisi', icon: '🏓' },
    { id: 'basketball-3x3', label: '3x3 Basketbol', icon: '🏀' },
  ];

  public readonly districtsList = [
    { id: '', label: 'Barcha tumanlar' },
    { id: 'Chilonzor', label: 'Chilonzor' },
    { id: 'Yunusobod', label: 'Yunusobod' },
    { id: 'Mirzo Ulugʻbek', label: 'Mirzo Ulugʻbek' },
  ];

  public readonly filteredSessions: Signal<SessionItem[]> = computed(() => {
    const list = this.sessions();
    const onlyAvail = this.onlyAvailable();
    if (!onlyAvail) return list;
    return list.filter((s) => s.remainingSlots > 0);
  });

  public readonly hasActiveFilters: Signal<boolean> = computed(() => {
    return (
      !!this.search() ||
      !!this.selectedSport() ||
      !!this.selectedDistrict() ||
      this.onlyAvailable()
    );
  });

  public ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    if (params['sport']) this.selectedSport.set(params['sport']);
    if (params['district']) this.selectedDistrict.set(params['district']);
    this.loadSessions();
  }

  public async loadSessions(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.api.fetchSessions({
        sport: this.selectedSport() || undefined,
        district: this.selectedDistrict() || undefined,
        search: this.search() || undefined,
      });
      this.sessions.set(data);
    } catch {
      this.sessions.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  public setSport(sportId: string): void {
    this.selectedSport.set(sportId);
    this.loadSessions();
  }

  public setDistrict(districtId: string): void {
    this.selectedDistrict.set(districtId);
    this.loadSessions();
  }

  public resetFilters(): void {
    this.search.set('');
    this.selectedSport.set('');
    this.selectedDistrict.set('');
    this.onlyAvailable.set(false);
    this.loadSessions();
  }
}
