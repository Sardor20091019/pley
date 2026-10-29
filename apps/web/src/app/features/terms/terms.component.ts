import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (themeService.theme() === 'editorial') {
      <div class="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        <a
          routerLink="/"
          class="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-widest uppercase text-[#8B7355] hover:text-[#1A1510] transition-colors"
        >
          <span>← {{ i18nService.t('termsBackHome') }}</span>
        </a>

        <div class="bg-[#EDE6D5] border-2 border-[#2D2926] p-8 sm:p-12 shadow-[3px_3px_0px_#2D2926] space-y-8">
          <div class="border-b-2 border-double border-[#2D2926] pb-6 space-y-2">
            <div class="flex items-center justify-between text-[11px] font-sans font-bold tracking-widest uppercase text-[#8B7355]">
              <span>{{ i18nService.t('termsOfficialDoc') }}</span>
              <span>{{ i18nService.t('termsCode') }}</span>
            </div>
            <h1 class="text-3xl sm:text-5xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
              {{ i18nService.t('termsTitle') }}
            </h1>
            <p class="text-xs font-serif italic text-[#8B7355]">
              {{ i18nService.t('termsSubtitle') }}
            </p>
          </div>

          <div class="space-y-6 text-sm font-serif text-[#1A1510] leading-relaxed">
            <p class="text-base font-serif italic border-l-2 border-[#C5A55A] pl-4 py-1 text-[#8B7355]">
              Pley.uz Toshkent shahrida havaskor sportchilar uchun oʻyinlarni tashkil etish, individual joylarni
              band qilish va maydoncha xarajatlarini teng taqsimlash uchun faoliyat yuritadi.
            </p>

            <div class="space-y-2 pt-2">
              <h3 class="text-lg font-bold text-[#1A1510] flex items-center gap-2" style="font-family: Georgia, serif">
                <span>§ I.</span>
                <span>Foydalanuvchi hisoblari va qoidalar</span>
              </h3>
              <p class="text-[#332B24]">
                Har bir foydalanuvchi oʻz shaxsiy maʼlumotlari toʻgʻriligini taʼminlaydi. Oʻyin davomida barcha
                ishtirokchilar sport odob-axloq qoidalariga qatʼiy rioya qilishi, boshqa oʻyinchilarga hurmat bilan
                munosabatda boʻlishi va sport zali ichki tartibiga boʻysunishi shart.
              </p>
            </div>

            <div class="space-y-2 pt-2">
              <h3 class="text-lg font-bold text-[#1A1510] flex items-center gap-2" style="font-family: Georgia, serif">
                <span>§ II.</span>
                <span>Joylarni band qilish va toʻlovlar</span>
              </h3>
              <p class="text-[#332B24]">
                Joylar har bir sessiya uchun belgilangan sigʻim asosida transactional tartibda taqsimlanadi. Joy band
                qilinganda oʻyin narxi va xizmat haqi ochiq koʻrsatiladi. Tranzaksiyalar xavfsiz toʻlov protokollari
                asosida qabul qilinadi.
              </p>
            </div>

            <div class="space-y-2 pt-2">
              <h3 class="text-lg font-bold text-[#1A1510] flex items-center gap-2" style="font-family: Georgia, serif">
                <span>§ III.</span>
                <span>Bekor qilish va kafolatlar</span>
              </h3>
              <p class="text-[#332B24]">
                Oʻyinchilar sessiya boshlanishiga belgilangan muddat (kamida 4 soat) qolgunga qadar oʻz bandliklarini
                jarimasiz bekor qilish huquqiga ega. Mazkur muddat oʻtgandan soʻng zal ijarasi xarajatlari sababli
                bekor qilish cheklanadi.
              </p>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-6">
        <a routerLink="/" class="inline-flex items-center gap-1.5 text-xs font-black text-[#242424] hover:text-[#7655F7]">
          <span>← {{ i18nService.t('termsBackHome') }}</span>
        </a>

        <div class="bg-white border-[2.5px] border-[#242424] rounded-3xl shadow-[4px_4px_0px_#242424] p-8 sm:p-12 space-y-6">
          <span class="inline-block px-3 py-1 rounded-full bg-[#7655F7] text-white text-xs font-black">
            {{ i18nService.t('termsOfficialDoc') }}
          </span>

          <h1 class="text-3xl sm:text-4xl font-black text-[#242424]">
            {{ i18nService.t('termsTitle') }}
          </h1>

          <div class="space-y-4 text-sm font-medium text-[#444444] leading-relaxed">
            <p>
              Pley.uz platformasi Toshkent shahridagi havaskor sportchilar uchun oʻyinlarni
              tashkil etish, individual joylarni band qilish va sport maydonchalari
              xarajatlarini oʻzaro adolatli taqsimlash imkoniyatini taqdim etadi.
            </p>

            <h3 class="text-lg font-black text-[#242424] pt-2">1. Foydalanuvchi hisoblari va qoidalar</h3>
            <p>
              Har bir foydalanuvchi oʻz shaxsiy maʼlumotlari toʻgʻriligini taʼminlaydi.
              Oʻyin davomida barcha ishtirokchilar sport odob-axloq qoidalariga rioya qilishi,
              boshqa oʻyinchilarga hurmat bilan munosabatda boʻlishi va sport zali talablariga
              boʻysunishi shart.
            </p>

            <h3 class="text-lg font-black text-[#242424] pt-2">2. Joylarni band qilish va toʻlovlar</h3>
            <p>
              Joylar har bir oʻyin uchun belgilangan sigʻim asosida transactional ravishda
              taqsimlanadi. Joy band qilinganda oʻyin narxi va xizmat haqi aniq
              koʻrsatiladi. Toʻlovlar mahalliy toʻlov tizimlari yoki test rejimida amalga
              oshiriladi.
            </p>

            <h3 class="text-lg font-black text-[#242424] pt-2">3. Bekor qilish va qaytarish</h3>
            <p>
              Oʻyinchilar sessiya boshlanishiga belgilangan muddat (odatda 2–6 soat)
              qolganga qadar oʻz bandliklarini bekor qilish huquqiga ega. Muddat oʻtgandan
              soʻng zal ijarasi xarajatlari sababli bekor qilish cheklanadi.
            </p>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly i18nService = inject(I18nService);
}
