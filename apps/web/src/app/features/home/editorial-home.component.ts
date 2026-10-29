import { Component, ChangeDetectionStrategy, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { compressImage } from '../../core/services/image';
import { SessionItem, PartnerFormData } from '../../core/models/types';

@Component({
  selector: 'app-editorial-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="bg-[#F5F0E8] text-[#1A1510] min-h-screen pb-20 selection:bg-[#C5A55A]/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-8">
        <section class="pt-12 sm:pt-16 pb-16">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div class="lg:col-span-8 space-y-6">
              <div>
                <span class="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-[#8B7355] border-b border-[#8B7355] pb-1">
                  {{ i18nService.t('editorialEdition') }}
                </span>
              </div>

              <h1 class="text-4xl sm:text-6xl md:text-7xl font-black leading-[0.92] tracking-tight text-[#1A1510]" style="font-family: Georgia, serif">
                <span>{{ i18nService.t('heroTitleLine1') }}</span>
                <br />
                <span class="relative inline-block text-[#8B7355]">
                  {{ i18nService.t('heroTitleLine2') }}
                  <span class="absolute -bottom-1 left-0 right-0 h-1 bg-[#C5A55A]"></span>
                </span>
              </h1>

              <p class="text-lg sm:text-xl leading-relaxed text-[#4A3F30] max-w-xl italic" style="font-family: Georgia, serif">
                {{ i18nService.t('heroSubtitle') }}
              </p>

              <div class="flex flex-wrap gap-4 pt-2">
                <a routerLink="/discover">
                  <button class="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1A1510] text-[#F5F0E8] font-sans text-xs font-bold tracking-widest uppercase hover:bg-[#332B24] transition-all cursor-pointer">
                    <span>{{ i18nService.t('findGameBtn') }}</span>
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </a>
                <a href="#editorial-how">
                  <button class="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-[#1A1510] border border-[#1A1510] font-sans text-xs font-bold tracking-widest uppercase hover:bg-[#EDE6D5] transition-all cursor-pointer">
                    <span>{{ i18nService.t('howItWorksBtn') }}</span>
                  </button>
                </a>
              </div>
            </div>

            <aside class="lg:col-span-4 border-l-2 border-[#2D2926] pl-6 sm:pl-8 pt-2 space-y-6">
              <p class="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B7355]">
                Gazeta eslatmalari
              </p>
              <div class="space-y-4">
                <div class="flex items-start gap-3 pb-3 border-b border-[rgba(45,41,38,0.15)]">
                  <svg class="w-4 h-4 text-[#8B7355] mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div>
                    <div class="font-sans text-[10px] text-[#8B7355] tracking-wider uppercase font-bold">Sport jamiyati</div>
                    <div class="text-base font-bold text-[#1A1510] mt-0.5" style="font-family: Georgia, serif">Est. 2026</div>
                  </div>
                </div>

                <div class="flex items-start gap-3 pb-3 border-b border-[rgba(45,41,38,0.15)]">
                  <svg class="w-4 h-4 text-[#8B7355] mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div class="font-sans text-[10px] text-[#8B7355] tracking-wider uppercase font-bold">Faol tumanlar</div>
                    <div class="text-base font-bold text-[#1A1510] mt-0.5" style="font-family: Georgia, serif">5 ta tuman</div>
                  </div>
                </div>

                <div class="flex items-start gap-3 pb-3 border-b border-[rgba(45,41,38,0.15)]">
                  <svg class="w-4 h-4 text-[#8B7355] mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div class="font-sans text-[10px] text-[#8B7355] tracking-wider uppercase font-bold">Tekshirilgan oʻyinchilar</div>
                    <div class="text-base font-bold text-[#1A1510] mt-0.5" style="font-family: Georgia, serif">500+ aʼzo</div>
                  </div>
                </div>

                <div class="flex items-start gap-3 pb-3 border-b border-[rgba(45,41,38,0.15)]">
                  <svg class="w-4 h-4 text-[#8B7355] mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div class="font-sans text-[10px] text-[#8B7355] tracking-wider uppercase font-bold">Haftalik oʻyinlar</div>
                    <div class="text-base font-bold text-[#1A1510] mt-0.5" style="font-family: Georgia, serif">50+ sessiya</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <div class="flex items-center gap-6 my-12">
          <div class="flex-1 h-px bg-[rgba(45,41,38,0.2)]"></div>
          <span class="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B7355] whitespace-nowrap">
            § I — Ishlash tamoyili
          </span>
          <div class="flex-1 h-px bg-[rgba(45,41,38,0.2)]"></div>
        </div>

        <section id="editorial-how" class="pb-16">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div class="md:col-span-4 md:sticky md:top-24 space-y-2">
              <p class="font-sans text-[10px] font-bold tracking-widest uppercase text-[#8B7355]">Tartib</p>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-[#1A1510] leading-tight" style="font-family: Georgia, serif">
                {{ i18nService.t('howItWorksTitle') }}
              </h2>
              <p class="text-sm font-sans text-[#4A3F30] leading-relaxed">
                {{ i18nService.t('howItWorksSubtitle') }}
              </p>
            </div>

            <div class="md:col-span-8 divide-y divide-[rgba(45,41,38,0.2)]">
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 py-8 items-start">
                <div class="sm:col-span-2 font-sans text-xs font-bold tracking-widest text-[#8B7355]">01</div>
                <div class="sm:col-span-10 space-y-2">
                  <h3 class="text-xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                    {{ i18nService.t('step1Title') }}
                  </h3>
                  <p class="text-sm text-[#4A3F30] leading-relaxed">
                    {{ i18nService.t('step1Desc') }}
                  </p>
                  <span class="inline-block font-sans text-[10px] font-bold tracking-wider uppercase text-[#C5A55A] pt-1">
                    #Chilonzor #Yunusobod
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 py-8 items-start">
                <div class="sm:col-span-2 font-sans text-xs font-bold tracking-widest text-[#8B7355]">02</div>
                <div class="sm:col-span-10 space-y-2">
                  <h3 class="text-xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                    {{ i18nService.t('step2Title') }}
                  </h3>
                  <p class="text-sm text-[#4A3F30] leading-relaxed">
                    {{ i18nService.t('step2Desc') }}
                  </p>
                  <span class="inline-block font-sans text-[10px] font-bold tracking-wider uppercase text-[#C5A55A] pt-1">
                    Adolatli UZS narx
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 py-8 items-start">
                <div class="sm:col-span-2 font-sans text-xs font-bold tracking-widest text-[#8B7355]">03</div>
                <div class="sm:col-span-10 space-y-2">
                  <h3 class="text-xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                    {{ i18nService.t('step3Title') }}
                  </h3>
                  <p class="text-sm text-[#4A3F30] leading-relaxed">
                    {{ i18nService.t('step3Desc') }}
                  </p>
                  <span class="inline-block font-sans text-[10px] font-bold tracking-wider uppercase text-[#C5A55A] pt-1">
                    Doʻstona jamoa kutmoqda
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="flex items-center gap-6 my-12">
          <div class="flex-1 h-px bg-[rgba(45,41,38,0.2)]"></div>
          <span class="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B7355] whitespace-nowrap">
            § II — Sport turlari katalogi
          </span>
          <div class="flex-1 h-px bg-[rgba(45,41,38,0.2)]"></div>
        </div>

        <section class="pb-16">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgba(45,41,38,0.25)] border border-[rgba(45,41,38,0.25)]">
            <a routerLink="/discover" [queryParams]="{ sport: 'table-tennis' }">
              <div class="bg-[#F5F0E8] hover:bg-[#EDE6D5] p-6 sm:p-8 transition-colors h-full flex flex-col justify-between cursor-pointer">
                <div>
                  <div class="text-4xl mb-4">🏓</div>
                  <h4 class="text-lg font-bold text-[#1A1510] mb-1" style="font-family: Georgia, serif">
                    {{ i18nService.t('tableTennis') }}
                  </h4>
                  <span class="font-sans text-[10px] font-bold tracking-wider uppercase text-[#8B7355]">Faol</span>
                </div>
                <span class="font-sans text-xs text-[#8B7355] mt-4 pt-3 border-t border-[rgba(45,41,38,0.1)] block">Eng ommabop</span>
              </div>
            </a>

            <a routerLink="/discover" [queryParams]="{ sport: 'basketball-3x3' }">
              <div class="bg-[#F5F0E8] hover:bg-[#EDE6D5] p-6 sm:p-8 transition-colors h-full flex flex-col justify-between cursor-pointer">
                <div>
                  <div class="text-4xl mb-4">🏀</div>
                  <h4 class="text-lg font-bold text-[#1A1510] mb-1" style="font-family: Georgia, serif">
                    {{ i18nService.t('basketball') }}
                  </h4>
                  <span class="font-sans text-[10px] font-bold tracking-wider uppercase text-[#8B7355]">Faol</span>
                </div>
                <span class="font-sans text-xs text-[#8B7355] mt-4 pt-3 border-t border-[rgba(45,41,38,0.1)] block">Ochiq & yopiq</span>
              </div>
            </a>

            <div class="bg-[#F5F0E8] p-6 sm:p-8 h-full flex flex-col justify-between opacity-70">
              <div>
                <div class="text-4xl mb-4">🏸</div>
                <h4 class="text-lg font-bold text-[#1A1510] mb-1" style="font-family: Georgia, serif">
                  {{ i18nService.t('badminton') }}
                </h4>
                <span class="font-sans text-[10px] font-bold tracking-wider uppercase text-[#8B7355]">Yaqinda</span>
              </div>
              <span class="font-sans text-xs text-[#8B7355] mt-4 pt-3 border-t border-[rgba(45,41,38,0.1)] block">Tez kunda</span>
            </div>

            <div class="bg-[#F5F0E8] p-6 sm:p-8 h-full flex flex-col justify-between opacity-70">
              <div>
                <div class="text-4xl mb-4">🏐</div>
                <h4 class="text-lg font-bold text-[#1A1510] mb-1" style="font-family: Georgia, serif">
                  {{ i18nService.t('volleyball') }}
                </h4>
                <span class="font-sans text-[10px] font-bold tracking-wider uppercase text-[#8B7355]">Yaqinda</span>
              </div>
              <span class="font-sans text-xs text-[#8B7355] mt-4 pt-3 border-t border-[rgba(45,41,38,0.1)] block">Tez kunda</span>
            </div>
          </div>
        </section>

        @if (upcomingSessions().length > 0) {
          <div class="flex items-center gap-6 my-12">
            <div class="flex-1 h-px bg-[rgba(45,41,38,0.2)]"></div>
            <span class="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B7355] whitespace-nowrap">
              § III — Jonli sessiyalar
            </span>
            <div class="flex-1 h-px bg-[rgba(45,41,38,0.2)]"></div>
          </div>

          <section class="pb-16 space-y-6">
            <div class="flex items-baseline justify-between">
              <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1A1510]" style="font-family: Georgia, serif">
                {{ i18nService.t('upcomingGamesTitle') }}
              </h2>
              <a routerLink="/discover" class="font-sans text-xs font-bold tracking-wider uppercase text-[#8B7355] hover:text-[#1A1510] flex items-center gap-1">
                <span>{{ i18nService.t('viewAll') }}</span>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(45,41,38,0.25)] border border-[rgba(45,41,38,0.25)]">
              @for (session of upcomingSessions(); track session.id) {
                <div class="bg-[#F5F0E8] hover:bg-[#EDE6D5] p-6 transition-colors flex flex-col justify-between gap-6">
                  <div class="space-y-3">
                    <div class="font-sans text-[10px] font-bold tracking-widest uppercase text-[#C5A55A]">
                      {{ session.sport.name }} · {{ session.venue.district }}
                    </div>
                    <h3 class="text-lg font-bold text-[#1A1510] line-clamp-1" style="font-family: Georgia, serif">
                      {{ session.title }}
                    </h3>
                    <div class="font-sans text-xs text-[#4A3F30] flex items-center gap-2">
                      <svg class="w-3.5 h-3.5 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span class="truncate">{{ session.venue.name }}</span>
                    </div>
                    <div class="font-sans text-xs text-[#4A3F30] flex items-center gap-2">
                      <svg class="w-3.5 h-3.5 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{{ session.scheduledAt | date:'EEE, d MMM · HH:mm' }} ({{ session.durationMinutes }} min)</span>
                    </div>
                  </div>

                  <div class="space-y-4 pt-4 border-t border-[rgba(45,41,38,0.15)]">
                    <div class="space-y-1">
                      <div class="flex justify-between font-sans text-[11px] text-[#8B7355]">
                        <span>{{ session.bookedSlots }}/{{ session.maxSlots }} oʻyinchi</span>
                        <span>{{ getFillPercent(session) }}% toʻlgan</span>
                      </div>
                      <div class="w-full h-1 bg-[rgba(45,41,38,0.15)] overflow-hidden">
                        <div class="h-full bg-[#1A1510]" [style.width.%]="getFillPercent(session)"></div>
                      </div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <span class="font-sans text-[10px] uppercase tracking-wider text-[#8B7355] block">
                          {{ i18nService.t('sessionCardPriceLabelCartoon') }}
                        </span>
                        <span class="text-base font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                          {{ session.pricePerSlot | number }} UZS
                        </span>
                      </div>
                      <a [routerLink]="['/sessions', session.id]">
                        <button class="px-4 py-2 bg-[#1A1510] text-[#F5F0E8] font-sans text-xs font-bold tracking-widest uppercase hover:bg-[#332B24] transition-all cursor-pointer">
                          {{ i18nService.t('grabSpot') }}
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>
        }

        <div class="flex items-center gap-6 my-12">
          <div class="flex-1 h-px bg-[rgba(45,41,38,0.2)]"></div>
          <span class="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B7355] whitespace-nowrap">
            § IV — Nega Pley?
          </span>
          <div class="flex-1 h-px bg-[rgba(45,41,38,0.2)]"></div>
        </div>

        <section class="pb-16">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 border-t-2 border-[#2D2926] pt-8">
            <div class="space-y-3">
              <span class="font-sans text-xs font-bold tracking-[0.25em] text-[#8B7355] block uppercase">Qism I</span>
              <h3 class="text-xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                {{ i18nService.t('whyPley1Title') }}
              </h3>
              <p class="text-sm text-[#4A3F30] leading-relaxed">
                {{ i18nService.t('whyPley1Desc') }}
              </p>
            </div>

            <div class="space-y-3">
              <span class="font-sans text-xs font-bold tracking-[0.25em] text-[#8B7355] block uppercase">Qism II</span>
              <h3 class="text-xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                {{ i18nService.t('whyPley2Title') }}
              </h3>
              <p class="text-sm text-[#4A3F30] leading-relaxed">
                {{ i18nService.t('whyPley2Desc') }}
              </p>
            </div>

            <div class="space-y-3">
              <span class="font-sans text-xs font-bold tracking-[0.25em] text-[#8B7355] block uppercase">Qism III</span>
              <h3 class="text-xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                {{ i18nService.t('whyPley3Title') }}
              </h3>
              <p class="text-sm text-[#4A3F30] leading-relaxed">
                {{ i18nService.t('whyPley3Desc') }}
              </p>
            </div>
          </div>
        </section>

        <div class="flex items-center gap-6 my-12">
          <div class="flex-1 h-px bg-[rgba(45,41,38,0.2)]"></div>
          <span class="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#8B7355] whitespace-nowrap">
            § V — Zallar uchun hamkorlik
          </span>
          <div class="flex-1 h-px bg-[rgba(45,41,38,0.2)]"></div>
        </div>

        <section id="venue-partner" class="pb-16">
          <div class="flex justify-center mb-8">
            <div class="inline-flex bg-[#EDE6D5] p-1 border border-[#2D2926] shadow-[2px_2px_0px_#2D2926]">
              <button
                type="button"
                (click)="setInquiryType('VENUE')"
                [class]="'px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ' +
                  (formData().inquiryType === 'VENUE' ? 'bg-[#1A1510] text-[#F5F0E8]' : 'text-[#1A1510] hover:bg-black/5')"
              >
                {{ i18nService.t('partnerModeVenue') }}
              </button>
              <button
                type="button"
                (click)="setInquiryType('SESSION')"
                [class]="'px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ' +
                  (formData().inquiryType === 'SESSION' ? 'bg-[#1A1510] text-[#F5F0E8]' : 'text-[#1A1510] hover:bg-black/5')"
              >
                {{ i18nService.t('partnerModeSession') }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div class="lg:col-span-5 space-y-4">
              <h2 class="text-3xl font-extrabold text-[#1A1510]" style="font-family: Georgia, serif">
                {{ formData().inquiryType === 'SESSION' ? i18nService.t('sessionPartnerTitle') : i18nService.t('venuePartnerTitle') }}
              </h2>
              <p class="text-sm text-[#4A3F30] leading-relaxed italic" style="font-family: Georgia, serif">
                {{ formData().inquiryType === 'SESSION' ? i18nService.t('sessionPartnerSubtitle') : i18nService.t('venuePartnerSubtitle') }}
              </p>
              <div class="p-6 bg-[#EDE6D5] border border-[rgba(45,41,38,0.25)] space-y-3 font-sans text-xs text-[#2D2926]">
                <div class="font-bold uppercase tracking-wider text-[#8B7355] text-[10px]">
                  {{ formData().inquiryType === 'SESSION' ? 'Sessiya ochish afzalliklari' : 'Hamkorlik afzalliklari' }}
                </div>
                <div class="space-y-2">
                  <div>— Boʻsh vaqt slotlarini faol oʻyinchilar bilan toʻldirish</div>
                  <div>— Har bir band qilish boʻyicha tezkor xabarnomalar</div>
                  <div>— Boshlangʻich toʻlovlarsiz erkin roʻyxatdan oʻtish</div>
                </div>
              </div>
            </div>

            <div class="lg:col-span-7 bg-[#EDE6D5] border-[1.5px] border-[#2D2926] p-6 sm:p-8">
              @if (partnerSuccess()) {
                <div class="text-center py-8 space-y-3">
                  <svg class="w-10 h-10 mx-auto text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h3 class="text-xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                    {{ i18nService.t('partnerSuccessTitle') }}
                  </h3>
                  <p class="font-sans text-xs text-[#4A3F30]">
                    {{ i18nService.t('partnerSuccessSubtitle') }}
                  </p>
                </div>
              } @else {
                <form (ngSubmit)="onSubmit()" class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                        {{ i18nService.t('partnerNameLabel') }}
                      </label>
                      <input
                        type="text"
                        required
                        [ngModel]="formData().contactName"
                        (ngModelChange)="updateField('contactName', $event)"
                        name="contactName"
                        placeholder="Masalan, Alisher"
                        class="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[rgba(45,41,38,0.3)] font-sans text-sm outline-none focus:border-[#1A1510]"
                      />
                    </div>
                    <div>
                      <label class="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                        {{ i18nService.t('partnerPhoneLabel') }}
                      </label>
                      <input
                        type="text"
                        required
                        [ngModel]="formData().phone"
                        (ngModelChange)="updateField('phone', $event)"
                        name="phone"
                        placeholder="+998 90 123 45 67"
                        class="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[rgba(45,41,38,0.3)] font-sans text-sm outline-none focus:border-[#1A1510]"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                        {{ formData().inquiryType === 'SESSION' ? 'Sessiya / Joy nomi' : i18nService.t('partnerVenueNameLabel') }}
                      </label>
                      <input
                        type="text"
                        required
                        [ngModel]="formData().venueName"
                        (ngModelChange)="updateField('venueName', $event)"
                        name="venueName"
                        [placeholder]="formData().inquiryType === 'SESSION' ? 'Masalan, Friday Ping Pong League' : 'Masalan, Arena Club'"
                        class="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[rgba(45,41,38,0.3)] font-sans text-sm outline-none focus:border-[#1A1510]"
                      />
                    </div>
                    <div>
                      <label class="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                        {{ i18nService.t('partnerDistrictLabel') }}
                      </label>
                      <select
                        [ngModel]="formData().district"
                        (ngModelChange)="updateField('district', $event)"
                        name="district"
                        class="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[rgba(45,41,38,0.3)] font-sans text-sm outline-none focus:border-[#1A1510]"
                      >
                        <option value="Yunusobod">Yunusobod</option>
                        <option value="Chilonzor">Chilonzor</option>
                        <option value="Mirzo Ulugʻbek">Mirzo Ulugʻbek</option>
                        <option value="Yakkasaroy">Yakkasaroy</option>
                        <option value="Mirobod">Mirobod</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                      {{ i18nService.t('partnerSportLabel') }}
                    </label>
                    <input
                      type="text"
                      required
                      [ngModel]="formData().sportTypes"
                      (ngModelChange)="updateField('sportTypes', $event)"
                      name="sportTypes"
                      placeholder="Stol tennisi, Basketbol, Badminton..."
                      class="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[rgba(45,41,38,0.3)] font-sans text-sm outline-none focus:border-[#1A1510]"
                    />
                  </div>

                  @if (formData().inquiryType === 'SESSION') {
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label class="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                          Oʻyin sanasi va vaqti
                        </label>
                        <input
                          type="datetime-local"
                          [ngModel]="formData().scheduledAt"
                          (ngModelChange)="updateField('scheduledAt', $event)"
                          name="scheduledAt"
                          class="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[rgba(45,41,38,0.3)] font-sans text-sm outline-none"
                        />
                      </div>
                      <div>
                        <label class="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                          Kutilayotgan narx / joy (UZS)
                        </label>
                        <input
                          type="number"
                          step="1000"
                          [ngModel]="formData().pricePerSlot"
                          (ngModelChange)="updatePrice($event)"
                          name="pricePerSlot"
                          placeholder="28000"
                          class="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[rgba(45,41,38,0.3)] font-sans text-sm outline-none"
                        />
                      </div>
                    </div>
                  }

                  <div>
                    <label class="block font-sans text-[10px] font-bold uppercase tracking-wider text-[#8B7355] mb-1">
                      {{ i18nService.t('uploadSessionPic') }} (Rasm qoʻshish)
                    </label>
                    <div class="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        id="partner-pic-upload-editorial"
                        class="hidden"
                        (change)="handlePicUpload($event)"
                        [disabled]="uploadingPic()"
                      />
                      <label
                        for="partner-pic-upload-editorial"
                        class="inline-flex items-center gap-2 px-4 py-2.5 border border-[#2D2926] bg-[#F5F0E8] hover:bg-white font-sans text-xs font-bold tracking-wider uppercase cursor-pointer transition-colors"
                      >
                        <svg class="w-4 h-4 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{{ uploadingPic() ? 'Yuklanmoqda...' : 'Rasm tanlash (Fayl)' }}</span>
                      </label>
                    </div>
                    @if (formData().imageUrl) {
                      <div class="mt-3 relative w-32 h-20 border border-[#2D2926] overflow-hidden">
                        <img [src]="formData().imageUrl" alt="preview" class="w-full h-full object-cover" />
                        <button
                          type="button"
                          (click)="clearImage()"
                          class="absolute top-1 right-1 bg-[#1A1510] text-[#F5F0E8] text-[10px] w-5 h-5 flex items-center justify-center font-bold hover:bg-[#C5221F] cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    }
                  </div>

                  @if (partnerError()) {
                    <div class="p-3 bg-[#FCE8E6] border border-[#C5221F] text-[#C5221F] text-xs font-sans font-bold">
                      {{ partnerError() }}
                    </div>
                  }

                  <button
                    type="submit"
                    [disabled]="partnerSubmitting()"
                    class="w-full py-3.5 bg-[#1A1510] text-[#F5F0E8] font-sans text-xs font-bold tracking-widest uppercase hover:bg-[#332B24] disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {{ partnerSubmitting()
                      ? i18nService.t('partnerSubmittingBtn')
                      : formData().inquiryType === 'SESSION'
                        ? i18nService.t('sessionPartnerBtn')
                        : i18nService.t('venuePartnerBtn') }}
                  </button>
                </form>
              }
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorialHomeComponent {
  readonly i18nService: I18nService = inject(I18nService);
  private readonly apiService: ApiService = inject(ApiService);

  readonly upcomingSessions = input<SessionItem[]>([]);
  readonly formData = input.required<PartnerFormData>();
  readonly partnerSubmitting = input<boolean>(false);
  readonly partnerSuccess = input<boolean>(false);
  readonly partnerError = input<string | null>(null);

  readonly formDataChange = output<PartnerFormData>();
  readonly formSubmit = output<void>();

  readonly uploadingPic = signal<boolean>(false);

  setInquiryType(type: 'VENUE' | 'SESSION'): void {
    this.formDataChange.emit({
      ...this.formData(),
      inquiryType: type,
    });
  }

  updateField(field: keyof PartnerFormData, val: string): void {
    this.formDataChange.emit({
      ...this.formData(),
      [field]: val,
    });
  }

  updatePrice(val: string | number): void {
    this.formDataChange.emit({
      ...this.formData(),
      pricePerSlot: parseInt(String(val), 10) || 0,
    });
  }

  clearImage(): void {
    this.formDataChange.emit({
      ...this.formData(),
      imageUrl: '',
    });
  }

  getFillPercent(session: SessionItem): number {
    return Math.min(100, Math.round((session.bookedSlots / session.maxSlots) * 100));
  }

  async handlePicUpload(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const rawFile = input.files?.[0];
    if (!rawFile) return;

    this.uploadingPic.set(true);
    try {
      const { file, dataUrl } = await compressImage(rawFile);
      if (dataUrl) {
        this.formDataChange.emit({
          ...this.formData(),
          imageUrl: dataUrl,
        });
      }
      const res = await this.apiService.uploadImage(file);
      if (res?.url) {
        this.formDataChange.emit({
          ...this.formData(),
          imageUrl: res.url,
        });
      }
    } catch {
    } finally {
      this.uploadingPic.set(false);
    }
  }

  onSubmit(): void {
    this.formSubmit.emit();
  }
}
