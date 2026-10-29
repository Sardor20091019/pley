import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-privacy',
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
              <span>BAYONOT № SEC-2026</span>
            </div>
            <h1 class="text-3xl sm:text-5xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
              {{ i18nService.t('privacyTitle') }}
            </h1>
            <p class="text-xs font-serif italic text-[#8B7355]">
              {{ i18nService.t('privacySubtitle') }}
            </p>
          </div>

          <div class="space-y-6 text-sm font-serif text-[#1A1510] leading-relaxed">
            <p class="text-base font-serif italic border-l-2 border-[#C5A55A] pl-4 py-1 text-[#8B7355]">
              Pley.uz shaxsiy maʼlumotlar daxlsizligini qatʼiy taʼminlaydi. Biz hech qachon telefon raqamlari yoki toʻliq
              bank hisobotlarini ommaviy reyestrlarda oshkor qilmaymiz.
            </p>

            <div class="space-y-2 pt-2">
              <h3 class="text-lg font-bold text-[#1A1510] flex items-center gap-2" style="font-family: Georgia, serif">
                <span>§ I.</span>
                <span>Yigʻiladigan maʼlumotlar</span>
              </h3>
              <p class="text-[#332B24]">
                Roʻyxatdan oʻtishda faqat ism-familiya, Google elektron pochta manzili, sport toifasi va yosh oraligʻi
                qayd etiladi. Ushbu parametrlar faqat oʻyinlar tashkiliy yaxlitligini taʼminlash uchun xizmat qiladi.
              </p>
            </div>

            <div class="space-y-2 pt-2">
              <h3 class="text-lg font-bold text-[#1A1510] flex items-center gap-2" style="font-family: Georgia, serif">
                <span>§ II.</span>
                <span>Xavfsiz toʻlovlar</span>
              </h3>
              <p class="text-[#332B24]">
                Karta maʼlumotlari platforma serverlarida saqlanmaydi. Barcha tranzaksiyalar litsenziyalangan toʻlov
                tizimlari shifrlangan kanallari orqali xavfsiz rejimda amalga oshiriladi.
              </p>
            </div>

            <div class="space-y-2 pt-2">
              <h3 class="text-lg font-bold text-[#1A1510] flex items-center gap-2" style="font-family: Georgia, serif">
                <span>§ III.</span>
                <span>Maʼlumotlarni oʻchirish</span>
              </h3>
              <p class="text-[#332B24]">
                Har bir foydalanuvchi istalgan vaqtda oʻz akkauntini yopish va kiritilgan maʼlumotlarni serverlardan
                toʻliq tozalashni talab qilish huquqiga ega.
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
          <span class="inline-block px-3 py-1 rounded-full bg-[#D7FF64] border-2 border-[#242424] text-xs font-black text-[#242424]">
            {{ i18nService.t('termsOfficialDoc') }}
          </span>

          <h1 class="text-3xl sm:text-4xl font-black text-[#242424]">
            {{ i18nService.t('privacyTitle') }}
          </h1>

          <div class="space-y-4 text-sm font-medium text-[#444444] leading-relaxed">
            <p>
              Pley.uz platformasi foydalanuvchilarning shaxsiy maʼlumotlarini qatʼiy himoya qiladi.
              Biz hech qachon telefon raqamlari, bank kartasi maʼlumotlari yoki toʻliq shaxsiy
              identifikatorlarni ochiq holda koʻrsatmaymiz.
            </p>

            <h3 class="text-lg font-black text-[#242424] pt-2">1. Yigʻiladigan maʼlumotlar</h3>
            <p>
              Profil yaratishda faqat ism, Telegram foydalanuvchi nomi, oʻyin darajasi va
              yosh toifasi saqlanadi. Bu maʼlumotlar faqat oʻyin tashkiliy jarayoni uchun
              zarurdir.
            </p>

            <h3 class="text-lg font-black text-[#242424] pt-2">2. Xavfsiz toʻlovlar</h3>
            <p>
              Karta maʼlumotlari platforma serverlarida saqlanmaydi. Barcha tranzaksiyalar
              faqat litsenziyalangan toʻlov provayderlari (Click, Payme) orqali xavfsiz
              shifrlangan kanal orqali yuboriladi.
            </p>

            <h3 class="text-lg font-black text-[#242424] pt-2">3. Maʼlumotlarni oʻchirish</h3>
            <p>
              Har qanday foydalanuvchi oʻz hisobini toʻxtatish yoki maʼlumotlarini butunlay
              oʻchirishni talab qilish huquqiga ega. Buning uchun qoʻllab-quvvatlash
              xizmatiga murojaat qilish kifoya.
            </p>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyComponent {
  protected readonly themeService = inject(ThemeService);
  protected readonly i18nService = inject(I18nService);
}
