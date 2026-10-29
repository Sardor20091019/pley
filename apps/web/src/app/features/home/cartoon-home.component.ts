import { Component, ChangeDetectionStrategy, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { compressImage } from '../../core/services/image';
import { SessionCardComponent } from '../../shared/components/session-card/session-card.component';
import { SportsHeroIllustrationComponent } from '../../shared/components/sports-hero-illustration/sports-hero-illustration.component';
import { SessionItem, PartnerFormData } from '../../core/models/types';

@Component({
  selector: 'app-cartoon-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SessionCardComponent, SportsHeroIllustrationComponent],
  template: `
    <div class="space-y-16 sm:space-y-24 pb-16">
      <section class="relative px-4 sm:px-8 pt-8 sm:pt-16 max-w-7xl mx-auto overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 bg-[#D7FF64] border-2 border-[#242424] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#242424]">
              <span>{{ i18nService.t('brandTagline') }}</span>
            </div>

            <h1 class="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] text-[#242424]">
              <span>{{ i18nService.t('heroTitleLine1') }}</span>
              <br />
              <span class="text-[#7655F7] underline decoration-[#D7FF64] decoration-8 underline-offset-4">
                {{ i18nService.t('heroTitleLine2') }}
              </span>
            </h1>

            <p class="text-base sm:text-xl font-medium text-[#4A4A4A] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {{ i18nService.t('heroSubtitle') }}
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a routerLink="/discover" class="w-full sm:w-auto">
                <button
                  type="button"
                  class="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-[#D7FF64] text-[#242424] font-black text-lg border-2 border-[#242424] shadow-[4px_4px_0px_#242424] hover:bg-[#cbf556] transition-transform active:translate-y-0.5 inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{{ i18nService.t('findGameBtn') }}</span>
                  <svg class="w-5 h-5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </a>
              <a href="#how-it-works" class="w-full sm:w-auto">
                <button
                  type="button"
                  class="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white text-[#242424] font-black text-lg border-2 border-[#242424] shadow-[4px_4px_0px_#242424] hover:bg-[#FAF9F5] transition-transform active:translate-y-0.5 inline-flex items-center justify-center cursor-pointer"
                >
                  <span>{{ i18nService.t('howItWorksBtn') }}</span>
                </button>
              </a>
            </div>

            <div class="flex items-center justify-center lg:justify-start gap-4 pt-4 text-xs font-bold text-[#666666] flex-wrap">
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-[#7655F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ i18nService.t('singleSpotPrice') }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-[#7655F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ i18nService.t('verifiedVenues') }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <svg class="w-4 h-4 text-[#7655F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ i18nService.t('realPlayers') }}</span>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 flex items-center justify-center">
            <app-sports-hero-illustration />
          </div>
        </div>
      </section>

      <section id="how-it-works" class="px-4 sm:px-8 max-w-7xl mx-auto">
        <div class="text-center space-y-3 mb-10">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-black uppercase bg-[#7655F7] text-white border-2 border-[#242424] shadow-[2px_2px_0px_#242424]">
            {{ i18nService.t('simpleAndEasy') }}
          </span>
          <h2 class="text-3xl sm:text-5xl font-black text-[#242424]">
            {{ i18nService.t('howItWorksTitle') }}
          </h2>
          <p class="text-base sm:text-lg font-medium text-[#666666] max-w-xl mx-auto">
            {{ i18nService.t('howItWorksSubtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div class="bg-[#FFF9EF] rounded-3xl border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] p-6 flex flex-col justify-between space-y-4 hover:border-[#7655F7] transition-all">
            <div class="space-y-3">
              <div class="w-14 h-14 rounded-2xl bg-[#D7FF64] border-2 border-[#242424] shadow-[3px_3px_0px_#242424] flex items-center justify-center font-black text-2xl text-[#242424]">
                1
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-[#242424]">
                {{ i18nService.t('step1Title') }}
              </h3>
              <p class="text-sm font-medium text-[#555555] leading-relaxed">
                {{ i18nService.t('step1Desc') }}
              </p>
            </div>
            <div class="pt-2 text-xs font-black text-[#7655F7]">
              #Chilonzor #Yunusobod
            </div>
          </div>

          <div class="bg-[#FFF9EF] rounded-3xl border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] p-6 flex flex-col justify-between space-y-4 hover:border-[#7655F7] transition-all">
            <div class="space-y-3">
              <div class="w-14 h-14 rounded-2xl bg-[#7655F7] text-white border-2 border-[#242424] shadow-[3px_3px_0px_#242424] flex items-center justify-center font-black text-2xl">
                2
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-[#242424]">
                {{ i18nService.t('step2Title') }}
              </h3>
              <p class="text-sm font-medium text-[#555555] leading-relaxed">
                {{ i18nService.t('step2Desc') }}
              </p>
            </div>
            <div class="pt-2 text-xs font-black text-[#7655F7]">
              {{ i18nService.t('fairUzsPrice') }}
            </div>
          </div>

          <div class="bg-[#FFF9EF] rounded-3xl border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] p-6 flex flex-col justify-between space-y-4 hover:border-[#7655F7] transition-all">
            <div class="space-y-3">
              <div class="w-14 h-14 rounded-2xl bg-[#FF795D] text-white border-2 border-[#242424] shadow-[3px_3px_0px_#242424] flex items-center justify-center font-black text-2xl">
                3
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-[#242424]">
                {{ i18nService.t('step3Title') }}
              </h3>
              <p class="text-sm font-medium text-[#555555] leading-relaxed">
                {{ i18nService.t('step3Desc') }}
              </p>
            </div>
            <div class="pt-2 text-xs font-black text-[#7655F7]">
              {{ i18nService.t('friendlyTeamAwaits') }}
            </div>
          </div>
        </div>
      </section>

      <section class="px-4 sm:px-8 max-w-7xl mx-auto">
        <div class="text-center space-y-3 mb-10">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-black uppercase bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424]">
            {{ i18nService.t('activities') }}
          </span>
          <h2 class="text-3xl sm:text-5xl font-black text-[#242424]">
            {{ i18nService.t('exploreSportsTitle') }}
          </h2>
          <p class="text-base sm:text-lg font-medium text-[#666666] max-w-xl mx-auto">
            {{ i18nService.t('exploreSportsSubtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <a routerLink="/discover" [queryParams]="{ sport: 'table-tennis' }">
            <div class="bg-white rounded-3xl border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] p-6 text-center space-y-3 hover:bg-[#D7FF64] transition-colors cursor-pointer">
              <div class="text-4xl sm:text-5xl">🏓</div>
              <h4 class="text-base sm:text-lg font-black text-[#242424]">
                {{ i18nService.t('tableTennis') }}
              </h4>
              <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#7655F7] text-white border-2 border-[#242424]">
                {{ i18nService.t('active') }}
              </span>
            </div>
          </a>

          <a routerLink="/discover" [queryParams]="{ sport: 'basketball-3x3' }">
            <div class="bg-white rounded-3xl border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] p-6 text-center space-y-3 hover:bg-[#FF795D] hover:text-white transition-colors cursor-pointer">
              <div class="text-4xl sm:text-5xl">🏀</div>
              <h4 class="text-base sm:text-lg font-black">
                {{ i18nService.t('basketball') }}
              </h4>
              <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#FF795D] text-white border-2 border-[#242424]">
                {{ i18nService.t('active') }}
              </span>
            </div>
          </a>

          <div class="bg-[#FFF9EF] rounded-3xl border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] p-6 text-center space-y-3 opacity-80">
            <div class="text-4xl sm:text-5xl">🏸</div>
            <h4 class="text-base sm:text-lg font-black text-[#242424]">
              {{ i18nService.t('badminton') }}
            </h4>
            <span class="text-[11px] font-bold text-[#888888] block">
              {{ i18nService.t('comingSoon') }}
            </span>
          </div>

          <div class="bg-[#FFF9EF] rounded-3xl border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] p-6 text-center space-y-3 opacity-80">
            <div class="text-4xl sm:text-5xl">🏐</div>
            <h4 class="text-base sm:text-lg font-black text-[#242424]">
              {{ i18nService.t('volleyball') }}
            </h4>
            <span class="text-[11px] font-bold text-[#888888] block">
              {{ i18nService.t('comingSoon') }}
            </span>
          </div>
        </div>
      </section>

      @if (upcomingSessions().length > 0) {
        <section class="px-4 sm:px-8 max-w-7xl mx-auto">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <span class="inline-block px-3 py-1 rounded-full text-xs font-black uppercase bg-[#FF795D] text-white border-2 border-[#242424] shadow-[2px_2px_0px_#242424]">
                {{ i18nService.t('liveSessions') }}
              </span>
              <h2 class="text-2xl sm:text-4xl font-black text-[#242424] mt-2">
                {{ i18nService.t('upcomingGamesTitle') }}
              </h2>
            </div>
            <a routerLink="/discover">
              <button
                type="button"
                class="py-2.5 px-4 rounded-xl bg-white text-[#242424] font-black text-sm border-2 border-[#242424] shadow-[2px_2px_0px_#242424] hover:bg-[#FAF9F5] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{{ i18nService.t('viewAll') }}</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (session of upcomingSessions(); track session.id) {
              <app-session-card [session]="session" />
            }
          </div>
        </section>
      }

      <section class="px-4 sm:px-8 max-w-7xl mx-auto">
        <div class="bg-[#7655F7] border-[3px] border-[#242424] rounded-4xl p-8 sm:p-14 text-white shadow-[8px_8px_0px_#242424]">
          <div class="max-w-3xl space-y-8">
            <h2 class="text-3xl sm:text-5xl font-black text-white">
              {{ i18nService.t('whyPleyTitle') }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div class="space-y-2 bg-[#5e3ed4] p-5 rounded-2xl border-2 border-[#242424]">
                <div class="w-10 h-10 rounded-xl bg-[#D7FF64] text-[#242424] flex items-center justify-center font-black">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 class="text-lg font-black text-white">
                  {{ i18nService.t('whyPley1Title') }}
                </h4>
                <p class="text-xs text-[#E0D8FF] leading-relaxed">
                  {{ i18nService.t('whyPley1Desc') }}
                </p>
              </div>

              <div class="space-y-2 bg-[#5e3ed4] p-5 rounded-2xl border-2 border-[#242424]">
                <div class="w-10 h-10 rounded-xl bg-[#FF795D] text-white flex items-center justify-center font-black">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h4 class="text-lg font-black text-white">
                  {{ i18nService.t('whyPley2Title') }}
                </h4>
                <p class="text-xs text-[#E0D8FF] leading-relaxed">
                  {{ i18nService.t('whyPley2Desc') }}
                </p>
              </div>

              <div class="space-y-2 bg-[#5e3ed4] p-5 rounded-2xl border-2 border-[#242424]">
                <div class="w-10 h-10 rounded-xl bg-[#78D8FF] text-[#242424] flex items-center justify-center font-black">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 class="text-lg font-black text-white">
                  {{ i18nService.t('whyPley3Title') }}
                </h4>
                <p class="text-xs text-[#E0D8FF] leading-relaxed">
                  {{ i18nService.t('whyPley3Desc') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="venue-partner" class="px-4 sm:px-8 max-w-4xl mx-auto">
        <div class="bg-white rounded-3xl border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] p-8 sm:p-12">
          <div class="flex justify-center mb-6">
            <div class="inline-flex bg-[#FFF9EF] p-1.5 rounded-2xl border-2 border-[#242424] shadow-[2px_2px_0px_#242424]">
              <button
                type="button"
                (click)="setInquiryType('VENUE')"
                [class]="'px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ' +
                  (formData().inquiryType === 'VENUE' ? 'bg-[#242424] text-white shadow-[2px_2px_0px_#7655F7]' : 'text-[#242424] hover:bg-black/5')"
              >
                {{ i18nService.t('partnerModeVenue') }}
              </button>
              <button
                type="button"
                (click)="setInquiryType('SESSION')"
                [class]="'px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ' +
                  (formData().inquiryType === 'SESSION' ? 'bg-[#D7FF64] text-[#242424] shadow-[2px_2px_0px_#242424]' : 'text-[#242424] hover:bg-black/5')"
              >
                {{ i18nService.t('partnerModeSession') }}
              </button>
            </div>
          </div>

          <div class="text-center space-y-3 mb-8">
            <span
              [class]="'inline-block px-3 py-1 rounded-full text-xs font-black uppercase border-2 border-[#242424] shadow-[2px_2px_0px_#242424] ' +
                (formData().inquiryType === 'SESSION' ? 'bg-[#7655F7] text-white' : 'bg-[#D7FF64] text-[#242424]')"
            >
              {{ formData().inquiryType === 'SESSION' ? '⚡ ' + i18nService.t('partnerModeSession') : i18nService.t('forVenues') }}
            </span>
            <h2 class="text-3xl sm:text-4xl font-black text-[#242424]">
              {{ formData().inquiryType === 'SESSION' ? i18nService.t('sessionPartnerTitle') : i18nService.t('venuePartnerTitle') }}
            </h2>
            <p class="text-sm sm:text-base font-medium text-[#666666]">
              {{ formData().inquiryType === 'SESSION' ? i18nService.t('sessionPartnerSubtitle') : i18nService.t('venuePartnerSubtitle') }}
            </p>
          </div>

          @if (partnerSuccess()) {
            <div class="bg-[#D7FF64] border-2 border-[#242424] rounded-2xl p-6 text-center space-y-2 shadow-[4px_4px_0px_#242424]">
              <svg class="w-10 h-10 mx-auto text-[#7655F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h3 class="text-xl font-black text-[#242424]">
                {{ i18nService.t('partnerSuccessTitle') }}
              </h3>
              <p class="text-xs sm:text-sm font-semibold text-[#333333]">
                {{ i18nService.t('partnerSuccessSubtitle') }}
              </p>
            </div>
          } @else {
            <form (ngSubmit)="onSubmit()" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-black uppercase text-[#242424] mb-1">
                    {{ i18nService.t('partnerNameLabel') }}
                  </label>
                  <input
                    type="text"
                    required
                    [ngModel]="formData().contactName"
                    (ngModelChange)="updateField('contactName', $event)"
                    name="contactName"
                    placeholder="Masalan, Alisher"
                    class="w-full px-4 py-3 rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] font-semibold text-sm outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label class="block text-xs font-black uppercase text-[#242424] mb-1">
                    {{ i18nService.t('partnerPhoneLabel') }}
                  </label>
                  <input
                    type="text"
                    required
                    [ngModel]="formData().phone"
                    (ngModelChange)="updateField('phone', $event)"
                    name="phone"
                    placeholder="+998 90 123 45 67"
                    class="w-full px-4 py-3 rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] font-semibold text-sm outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-black uppercase text-[#242424] mb-1">
                    {{ formData().inquiryType === 'SESSION' ? 'Sessiya / Joy nomi' : i18nService.t('partnerVenueNameLabel') }}
                  </label>
                  <input
                    type="text"
                    required
                    [ngModel]="formData().venueName"
                    (ngModelChange)="updateField('venueName', $event)"
                    name="venueName"
                    [placeholder]="formData().inquiryType === 'SESSION' ? 'Masalan, Sunday Ping Pong Rally' : 'Masalan, Arena Club'"
                    class="w-full px-4 py-3 rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] font-semibold text-sm outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label class="block text-xs font-black uppercase text-[#242424] mb-1">
                    {{ i18nService.t('partnerDistrictLabel') }}
                  </label>
                  <select
                    [ngModel]="formData().district"
                    (ngModelChange)="updateField('district', $event)"
                    name="district"
                    class="w-full px-4 py-3 rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] font-bold text-sm outline-none focus:bg-white"
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
                <label class="block text-xs font-black uppercase text-[#242424] mb-1">
                  {{ i18nService.t('partnerSportLabel') }}
                </label>
                <input
                  type="text"
                  required
                  [ngModel]="formData().sportTypes"
                  (ngModelChange)="updateField('sportTypes', $event)"
                  name="sportTypes"
                  placeholder="Stol tennisi, Basketbol, Badminton..."
                  class="w-full px-4 py-3 rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] font-semibold text-sm outline-none focus:bg-white"
                />
              </div>

              @if (formData().inquiryType === 'SESSION') {
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-black uppercase text-[#242424] mb-1">
                      Oʻyin sanasi va vaqti
                    </label>
                    <input
                      type="datetime-local"
                      [ngModel]="formData().scheduledAt"
                      (ngModelChange)="updateField('scheduledAt', $event)"
                      name="scheduledAt"
                      class="w-full px-4 py-3 rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] font-semibold text-sm outline-none focus:bg-white"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-black uppercase text-[#242424] mb-1">
                      Kutilayotgan joy narxi (UZS)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      [ngModel]="formData().pricePerSlot"
                      (ngModelChange)="updatePrice($event)"
                      name="pricePerSlot"
                      placeholder="28000"
                      class="w-full px-4 py-3 rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] font-semibold text-sm outline-none focus:bg-white"
                    />
                  </div>
                </div>
              }

              <div>
                <label class="block text-xs font-black uppercase text-[#242424] mb-1">
                  {{ i18nService.t('uploadSessionPic') }} (Rasm qoʻshish)
                </label>
                <div class="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="partner-pic-upload-cartoon"
                    class="hidden"
                    (change)="handlePicUpload($event)"
                    [disabled]="uploadingPic()"
                  />
                  <label
                    for="partner-pic-upload-cartoon"
                    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] hover:bg-[#EADEFF] font-black text-xs uppercase cursor-pointer transition-colors"
                  >
                    <svg class="w-4 h-4 text-[#7655F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ uploadingPic() ? 'Yuklanmoqda...' : 'Rasm tanlash (Fayl)' }}</span>
                  </label>
                </div>
                @if (formData().imageUrl) {
                  <div class="mt-3 relative w-32 h-20 rounded-xl border-2 border-[#242424] overflow-hidden">
                    <img
                      [src]="formData().imageUrl"
                      alt="preview"
                      class="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      (click)="clearImage()"
                      class="absolute top-1 right-1 bg-[#242424] text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black hover:bg-[#D9383A] cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                }
              </div>

              @if (partnerError()) {
                <div class="p-3.5 rounded-2xl bg-[#FFD1D1] border-2 border-[#242424] text-[#D9383A] text-xs font-black">
                  {{ partnerError() }}
                </div>
              }

              <button
                type="submit"
                [disabled]="partnerSubmitting()"
                [class]="'w-full py-3.5 px-6 rounded-2xl font-black text-base border-2 border-[#242424] shadow-[3px_3px_0px_#242424] transition-all cursor-pointer ' +
                  (formData().inquiryType === 'SESSION' ? 'bg-[#D7FF64] text-[#242424] hover:bg-[#cbf556]' : 'bg-[#7655F7] text-white hover:bg-[#6846e3]')"
              >
                {{ partnerSubmitting()
                  ? i18nService.t('partnerSubmittingBtn')
                  : formData().inquiryType === 'SESSION'
                    ? i18nService.t('sessionPartnerBtn')
                    : i18nService.t('partnerSubmitBtn') }}
              </button>
            </form>
          }
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartoonHomeComponent {
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
