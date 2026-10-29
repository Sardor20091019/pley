import { Component, OnInit, inject, signal, ChangeDetectionStrategy, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { getCookie, deleteCookie } from '../../core/services/cookies';
import { MascotComponent } from '../../shared/components/mascot/mascot.component';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, MascotComponent],
  template: `
    @if (error()) {
      <div class="max-w-md mx-auto my-16 p-8 bg-white border-[2.5px] border-[#242424] rounded-3xl shadow-[4px_4px_0px_#242424] text-center space-y-4">
        <app-mascot size="lg" mood="sleepy" />
        <h2 class="text-xl font-black text-[#242424]">Kirish amalga oshmadi</h2>
        <p class="text-xs font-semibold text-[#FF795D]">{{ error() }}</p>
        <button
          (click)="goHome()"
          class="px-4 py-2 rounded-full bg-[#D7FF64] border-2 border-[#242424] text-xs font-black shadow-[2px_2px_0px_#242424]"
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    } @else {
      <div class="max-w-md mx-auto my-24 p-8 text-center space-y-4">
        <app-mascot size="lg" mood="bouncing" extraClass="animate-bounce" />
        <h2 class="text-2xl font-black text-[#242424]">Google orqali kirilmoqda...</h2>
        <p class="text-xs font-bold text-[#666666]">Iltimos kuting, profilingiz tayyorlanmoqda.</p>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly authService = inject(AuthService);

  public readonly error: WritableSignal<string | null> = signal<string | null>(null);

  public async ngOnInit(): Promise<void> {
    const params = this.route.snapshot.queryParams;
    const code = params['code'];
    const errorParam = params['error'];

    if (errorParam) {
      this.error.set(`Google kirish bekor qilindi: ${errorParam}`);
      return;
    }

    if (!code) {
      this.error.set('Google tomonidan tasdiqlash kodi yuborilmadi.');
      return;
    }

    try {
      const redirectUri = `${window.location.origin}/auth/callback`;
      const turnstileToken =
        sessionStorage.getItem('pley_turnstile_token') ||
        getCookie('pley_turnstile_token');

      if (!turnstileToken) {
        this.error.set('Xavfsizlik tekshiruvi (Turnstile) oʻtilmagan yoki rad etilgan. Tizimga kirish imkonsiz.');
        return;
      }

      const res = await this.api.loginWithGoogleCode(code, redirectUri, turnstileToken);
      this.authService.token.set(res.token);
      this.authService.user.set(res.user);

      sessionStorage.removeItem('pley_turnstile_token');
      deleteCookie('pley_turnstile_token');

      const target =
        sessionStorage.getItem('pley_post_login_redirect') ||
        getCookie('pley_post_login_redirect') ||
        '/discover';

      sessionStorage.removeItem('pley_post_login_redirect');
      deleteCookie('pley_post_login_redirect');

      window.location.href = target;
    } catch (err: any) {
      this.error.set(err.message || 'Google hisobi bilan tizimga kirishda xatolik yuz berdi');
    }
  }

  public goHome(): void {
    this.router.navigate(['/']);
  }
}
