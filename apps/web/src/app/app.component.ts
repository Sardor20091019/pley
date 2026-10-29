import {
  Component,
  OnInit,
  inject,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MobileBottomNavComponent } from './shared/components/mobile-bottom-nav/mobile-bottom-nav.component';
import { CookieConsentComponent } from './shared/components/cookie-consent/cookie-consent.component';
import { LoginModalComponent } from './shared/components/login-modal/login-modal.component';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { I18nService } from './core/services/i18n.service';
import { CookieConsentService } from './core/services/cookie-consent.service';
import { AnalyticsService } from './core/services/analytics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    MobileBottomNavComponent,
    CookieConsentComponent,
    LoginModalComponent,
  ],
  template: `
    <div
      class="min-h-screen flex flex-col font-sans transition-colors duration-200"
      [ngClass]="themeService.theme() === 'cartoon' ? 'selection:bg-[#D7FF64]' : 'selection:bg-[#C5A55A]/30'"
    >
      <app-navbar class="sticky top-0 z-50 block w-full" />

      <main
        class="flex-1 flex flex-col transition-opacity duration-150"
        [class.opacity-0]="i18nService.isTransitioning()"
      >
        <router-outlet />
      </main>

      <app-footer />
      <app-cookie-consent />
      <app-mobile-bottom-nav />
      <app-login-modal />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  protected readonly i18nService = inject(I18nService);
  protected readonly cookieService = inject(CookieConsentService);
  protected readonly analyticsService = inject(AnalyticsService);

  constructor() {
    effect((): void => {
      const currentTheme = this.themeService.theme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', currentTheme);
      }
    });

    effect((): void => {
      const currentLanguage = this.i18nService.language();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', currentLanguage);
      }
    });
  }

  public ngOnInit(): void {
    this.authService.init();
    this.themeService.init();
    this.i18nService.init();
    this.cookieService.init();
    this.analyticsService.init();
  }
}
