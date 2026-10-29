import { Component, inject, signal, ChangeDetectionStrategy, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { MascotComponent } from '../mascot/mascot.component';
import { Language } from '../../../core/models/translations';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeSwitcherComponent, MascotComponent],
  host: {
    class: 'sticky top-0 z-50 block w-full',
  },
  template: `
    @if (themeService.theme() === 'editorial') {
      <header class="w-full bg-[#F5F0E8] border-b border-[#2D2926] px-4 sm:px-8 py-3 transition-colors">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <a routerLink="/" class="flex items-center gap-2 group">
            <app-mascot size="sm" mood="bouncing" extraClass="group-hover:rotate-6 transition-transform" />
            <div class="flex items-baseline font-black tracking-tight text-2xl sm:text-3xl text-[#1A1510]" style="font-family: Georgia, serif">
              <span>PLEY</span>
              <span class="text-[#8B7355]">.UZ</span>
            </div>
          </a>

          <nav class="hidden md:flex items-center gap-1">
            <a
              routerLink="/discover"
              routerLinkActive
              #rlaDiscoverEd="routerLinkActive"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 font-sans font-bold text-xs tracking-widest uppercase transition-all"
              [ngClass]="rlaDiscoverEd.isActive
                ? 'text-[#1A1510] border-b-2 border-[#1A1510]'
                : 'text-[#8B7355] hover:text-[#1A1510]'"
            >
              {{ i18nService.t('navDiscover') }}
            </a>
            <a
              routerLink="/my-games"
              routerLinkActive
              #rlaMyGamesEd="routerLinkActive"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 font-sans font-bold text-xs tracking-widest uppercase transition-all"
              [ngClass]="rlaMyGamesEd.isActive
                ? 'text-[#1A1510] border-b-2 border-[#1A1510]'
                : 'text-[#8B7355] hover:text-[#1A1510]'"
            >
              {{ i18nService.t('navMyGames') }}
            </a>
            <a
              routerLink="/profile"
              routerLinkActive
              #rlaProfileEd="routerLinkActive"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 font-sans font-bold text-xs tracking-widest uppercase transition-all"
              [ngClass]="rlaProfileEd.isActive
                ? 'text-[#1A1510] border-b-2 border-[#1A1510]'
                : 'text-[#8B7355] hover:text-[#1A1510]'"
            >
              {{ i18nService.t('navProfile') }}
            </a>

            @if (authService.isAdmin()) {
              <a
                routerLink="/admin"
                routerLinkActive
                #rlaAdminEd="routerLinkActive"
                class="px-3 py-1 font-sans font-extrabold text-xs flex items-center gap-1.5 border border-[#1A1510] tracking-wider uppercase transition-all"
                [ngClass]="rlaAdminEd.isActive
                  ? 'bg-[#1A1510] text-[#F5F0E8]'
                  : 'bg-[#EDE6D5] text-[#1A1510]'"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>{{ i18nService.t('navAdmin') }}</span>
              </a>
            }
          </nav>

          <div class="flex items-center gap-2.5">
            <app-theme-switcher />

            <div class="relative">
              <button
                (click)="toggleLangMenu()"
                class="flex items-center gap-1 px-2.5 py-1.5 bg-[#EDE6D5] border border-[#2D2926] text-xs font-bold text-[#1A1510] font-sans uppercase tracking-wider cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>{{ i18nService.language() }}</span>
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              @if (showLangMenu()) {
                <div class="absolute right-0 mt-2 w-28 bg-[#F5F0E8] border border-[#2D2926] p-1.5 z-50 shadow-md">
                  @for (lang of availableLanguages; track lang) {
                    <button
                      (click)="changeLanguage(lang)"
                      class="w-full text-left px-3 py-1.5 text-xs font-bold font-sans cursor-pointer"
                      [class.bg-[#EDE6D5]]="i18nService.language() === lang"
                      [class.text-[#1A1510]]="i18nService.language() === lang"
                      [class.text-[#8B7355]]="i18nService.language() !== lang"
                    >
                      {{ lang === 'uz' ? "O'zbek" : lang === 'ru' ? 'Русский' : 'English' }}
                    </button>
                  }
                </div>
              }
            </div>

            <div class="relative">
              @if (authService.user(); as user) {
                <button
                  (click)="toggleAccountMenu()"
                  class="flex items-center gap-2 px-3 py-1.5 bg-[#EDE6D5] border border-[#2D2926] text-xs font-bold text-[#1A1510] font-sans tracking-wide cursor-pointer"
                >
                  @if (user.avatar_url) {
                    <img [src]="user.avatar_url" [alt]="user.first_name" class="w-5 h-5 rounded-full object-cover border border-[#2D2926]" />
                  } @else {
                    <svg class="w-3.5 h-3.5 text-[#1A1510]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  <span class="max-w-[80px] sm:max-w-[120px] truncate">{{ user.first_name }}</span>
                  <svg class="w-3 h-3 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                @if (showAccountMenu()) {
                  <div class="absolute right-0 mt-2 w-64 bg-[#F5F0E8] border border-[#2D2926] p-3 z-50 space-y-3 shadow-lg">
                    <div class="flex items-center gap-2.5 pb-2 border-b border-[rgba(45,41,38,0.15)]">
                      @if (user.avatar_url) {
                        <img [src]="user.avatar_url" [alt]="user.first_name" class="w-8 h-8 rounded-full object-cover border border-[#2D2926]" />
                      } @else {
                        <div class="w-8 h-8 rounded-full bg-[#EDE6D5] border border-[#2D2926] flex items-center justify-center font-bold text-xs text-[#1A1510]">
                          {{ user.first_name[0] }}
                        </div>
                      }
                      <div class="truncate">
                        <div class="text-xs font-bold text-[#1A1510] truncate" style="font-family: Georgia, serif">
                          {{ user.first_name }} {{ user.last_name || '' }}
                        </div>
                        <div class="text-[10px] text-[#8B7355] font-sans truncate">
                          {{ user.email || user.first_name }}
                        </div>
                      </div>
                    </div>

                    <div class="space-y-1 font-sans text-xs">
                      <a routerLink="/profile" (click)="closeMenus()" class="block px-3 py-1.5 font-bold text-[#1A1510] hover:bg-[#EDE6D5]">
                        {{ i18nService.t('navProfilePhoto') }}
                      </a>
                      <a routerLink="/my-games" (click)="closeMenus()" class="block px-3 py-1.5 font-bold text-[#1A1510] hover:bg-[#EDE6D5]">
                        {{ i18nService.t('navMyGames') }}
                      </a>
                      @if (authService.isAdmin()) {
                        <a routerLink="/admin" (click)="closeMenus()" class="block px-3 py-1.5 font-bold text-[#8B7355] hover:bg-[#EDE6D5]">
                          {{ i18nService.t('navAdminCenter') }}
                        </a>
                      }
                    </div>

                    <div class="pt-2 border-t border-[rgba(45,41,38,0.15)]">
                      <button (click)="handleLogout()" class="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold font-sans text-[#B85450] hover:bg-[#EDE6D5] cursor-pointer">
                        <span>{{ i18nService.t('navLogout') }}</span>
                      </button>
                    </div>
                  </div>
                }
              } @else {
                <button
                  (click)="authService.openAuthModal()"
                  class="px-3.5 py-1.5 text-xs font-bold font-sans uppercase tracking-wider bg-[#1A1510] text-[#F5F0E8] hover:bg-[#332B24] transition-all cursor-pointer"
                >
                  {{ i18nService.t('navLogin') }}
                </button>
              }
            </div>
          </div>
        </div>
      </header>
    } @else {
      <header class="w-full bg-[#FFF9EF] border-b-[2.5px] border-[#242424] px-4 sm:px-8 py-3 transition-colors">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <a routerLink="/" class="flex items-center gap-2 group">
            <app-mascot size="sm" mood="bouncing" extraClass="group-hover:rotate-6 transition-transform" />
            <div class="flex items-baseline font-black tracking-tight text-2xl sm:text-3xl text-[#242424]">
              <span>PLEY</span>
              <span class="text-[#7655F7]">.UZ</span>
            </div>
          </a>

          <nav class="hidden md:flex items-center gap-2">
            <a
              routerLink="/discover"
              routerLinkActive
              #rlaDiscover="routerLinkActive"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-full font-bold text-sm border-2 transition-all cursor-pointer"
              [ngClass]="rlaDiscover.isActive
                ? 'bg-[#7655F7] text-white border-[#242424] shadow-[2px_2px_0px_#242424]'
                : 'bg-white text-[#242424] border-transparent hover:border-[#242424]'"
            >
              {{ i18nService.t('navDiscover') }}
            </a>
            <a
              routerLink="/my-games"
              routerLinkActive
              #rlaMyGames="routerLinkActive"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-full font-bold text-sm border-2 transition-all cursor-pointer"
              [ngClass]="rlaMyGames.isActive
                ? 'bg-[#7655F7] text-white border-[#242424] shadow-[2px_2px_0px_#242424]'
                : 'bg-white text-[#242424] border-transparent hover:border-[#242424]'"
            >
              {{ i18nService.t('navMyGames') }}
            </a>
            <a
              routerLink="/profile"
              routerLinkActive
              #rlaProfile="routerLinkActive"
              [routerLinkActiveOptions]="{ exact: true }"
              class="px-4 py-2 rounded-full font-bold text-sm border-2 transition-all cursor-pointer"
              [ngClass]="rlaProfile.isActive
                ? 'bg-[#7655F7] text-white border-[#242424] shadow-[2px_2px_0px_#242424]'
                : 'bg-white text-[#242424] border-transparent hover:border-[#242424]'"
            >
              {{ i18nService.t('navProfile') }}
            </a>

            @if (authService.isAdmin()) {
              <a
                routerLink="/admin"
                routerLinkActive
                #rlaAdmin="routerLinkActive"
                class="px-3.5 py-1.5 rounded-full font-extrabold text-xs flex items-center gap-1.5 border-2 border-[#242424] transition-all cursor-pointer"
                [ngClass]="rlaAdmin.isActive
                  ? 'bg-[#FF795D] text-white shadow-[2px_2px_0px_#242424]'
                  : 'bg-[#D7FF64] text-[#242424]'"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>{{ i18nService.t('navAdmin') }}</span>
              </a>
            }
          </nav>

          <div class="flex items-center gap-2.5">
            <app-theme-switcher />

            <div class="relative">
              <button
                (click)="toggleLangMenu()"
                class="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border-2 border-[#242424] text-xs font-black shadow-[2px_2px_0px_#242424] cursor-pointer"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span class="uppercase">{{ i18nService.language() }}</span>
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              @if (showLangMenu()) {
                <div class="absolute right-0 mt-2 w-28 bg-white border-2 border-[#242424] rounded-2xl shadow-[4px_4px_0px_#242424] p-1.5 z-50">
                  @for (lang of availableLanguages; track lang) {
                    <button
                      (click)="changeLanguage(lang)"
                      class="w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                      [class.bg-[#D7FF64]]="i18nService.language() === lang"
                      [class.text-[#242424]]="i18nService.language() === lang"
                      [class.hover:bg-[#FFF9EF]]="i18nService.language() !== lang"
                    >
                      {{ lang === 'uz' ? "O'zbek" : lang === 'ru' ? 'Русский' : 'English' }}
                    </button>
                  }
                </div>
              }
            </div>

            <div class="relative">
              @if (authService.user(); as user) {
                <button
                  (click)="toggleAccountMenu()"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] text-xs font-extrabold hover:bg-[#cbf556] cursor-pointer"
                >
                  @if (user.avatar_url) {
                    <img [src]="user.avatar_url" [alt]="user.first_name" class="w-5 h-5 rounded-full object-cover border border-[#242424]" />
                  } @else {
                    <svg class="w-3.5 h-3.5 text-[#242424]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  <span class="max-w-[80px] sm:max-w-[120px] truncate">{{ user.first_name }}</span>
                  @if (authService.isAdmin()) {
                    <span class="px-1.5 py-0.2 rounded bg-[#7655F7] text-white text-[9px] font-black uppercase">
                      Admin
                    </span>
                  }
                  <svg class="w-3 h-3 text-[#242424]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                @if (showAccountMenu()) {
                  <div class="absolute right-0 mt-2 w-64 bg-white border-2 border-[#242424] rounded-2xl shadow-[4px_4px_0px_#242424] p-3 z-50 space-y-3">
                    <div class="flex items-center gap-2.5 pb-2 border-b border-[#EEEEEE]">
                      @if (user.avatar_url) {
                        <img [src]="user.avatar_url" [alt]="user.first_name" class="w-8 h-8 rounded-full object-cover border border-[#242424]" />
                      } @else {
                        <div class="w-8 h-8 rounded-full bg-[#D7FF64] border border-[#242424] flex items-center justify-center font-black text-xs">
                          {{ user.first_name[0] }}
                        </div>
                      }
                      <div class="truncate">
                        <div class="text-xs font-black text-[#242424] truncate">
                          {{ user.first_name }} {{ user.last_name || '' }}
                        </div>
                        <div class="text-[10px] text-[#7655F7] font-semibold truncate">
                          {{ user.email || user.first_name }}
                        </div>
                      </div>
                    </div>

                    <div class="space-y-1">
                      <a routerLink="/profile" (click)="closeMenus()" class="block px-3 py-1.5 rounded-xl text-xs font-bold text-[#242424] hover:bg-[#FFF9EF] transition-colors">
                        {{ i18nService.t('navProfilePhoto') }}
                      </a>
                      <a routerLink="/my-games" (click)="closeMenus()" class="block px-3 py-1.5 rounded-xl text-xs font-bold text-[#242424] hover:bg-[#FFF9EF] transition-colors">
                        {{ i18nService.t('navMyGames') }}
                      </a>
                      @if (authService.isAdmin()) {
                        <a routerLink="/admin" (click)="closeMenus()" class="block px-3 py-1.5 rounded-xl text-xs font-bold text-[#7655F7] hover:bg-[#FFF9EF] transition-colors">
                          {{ i18nService.t('navAdminCenter') }}
                        </a>
                      }
                    </div>

                    <div class="pt-2 border-t border-[#EEEEEE]">
                      <button (click)="handleLogout()" class="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#FF795D] hover:bg-[#FFF9EF] transition-colors cursor-pointer">
                        <span>{{ i18nService.t('navLogout') }}</span>
                      </button>
                    </div>
                  </div>
                }
              } @else {
                <button
                  (click)="authService.openAuthModal()"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D7FF64] hover:bg-[#cbf556] text-[#242424] font-black text-xs border-2 border-[#242424] shadow-[2px_2px_0px_#242424] hover:shadow-[3px_3px_0px_#242424] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  <span>{{ i18nService.t('navLogin') }}</span>
                </button>
              }
            </div>
          </div>
        </div>
      </header>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly i18nService = inject(I18nService);
  private readonly router = inject(Router);

  public readonly showAccountMenu: WritableSignal<boolean> = signal<boolean>(false);
  public readonly showLangMenu: WritableSignal<boolean> = signal<boolean>(false);

  public readonly availableLanguages: Language[] = ['uz', 'ru', 'en'];

  public toggleAccountMenu(): void {
    this.showAccountMenu.set(!this.showAccountMenu());
    this.showLangMenu.set(false);
  }

  public toggleLangMenu(): void {
    this.showLangMenu.set(!this.showLangMenu());
    this.showAccountMenu.set(false);
  }

  public closeMenus(): void {
    this.showAccountMenu.set(false);
    this.showLangMenu.set(false);
  }

  public changeLanguage(lang: Language): void {
    this.i18nService.setLanguage(lang);
    this.closeMenus();
  }

  public handleLogout(): void {
    this.authService.logout();
    this.closeMenus();
    this.router.navigate(['/']);
  }
}
