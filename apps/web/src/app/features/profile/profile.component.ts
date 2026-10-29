import { Component, ChangeDetectionStrategy, inject, signal, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { MascotComponent } from '../../shared/components/mascot/mascot.component';
import { Achievement, SkillLevel } from '../../core/models/types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MascotComponent],
  template: `
    @if (!authService.user()) {
      @if (themeService.isEditorial()) {
        <div class="max-w-xl mx-auto my-16 px-4">
          <div class="bg-[#EDE6D5] border-2 border-[#2D2926] p-8 text-center space-y-5 shadow-[3px_3px_0px_#2D2926]">
            <svg class="w-10 h-10 text-[#8B7355] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div class="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
              {{ i18nService.t('profileRegisterTitle') }}
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
              {{ i18nService.t('profileDossierTitle') }}
            </h2>
            <p class="text-xs font-serif italic text-[#8B7355] max-w-sm mx-auto">
              Profil sozlamalarini boshqarish va oʻyinlarga yozilish uchun rasmiy Google hisobi orqali autentifikatsiyadan oʻting.
            </p>
            <div class="pt-2">
              <button
                type="button"
                (click)="authService.openLoginModal('/profile')"
                class="w-full py-3 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] hover:bg-[#332B24] transition-all cursor-pointer"
              >
                {{ i18nService.t('myGamesGoogleLogin') }}
              </button>
            </div>
          </div>
        </div>
      } @else {
        <div class="max-w-md mx-auto my-16 px-4 text-center space-y-4">
          <app-mascot size="lg" mood="happy" />
          <h2 class="text-2xl font-black text-[#242424]">
            {{ i18nService.t('navProfile') }}
          </h2>
          <p class="text-sm font-semibold text-[#666666]">
            Profil sozlamalarini boshqarish va oʻyinlarga yozilish uchun Google hisobingiz bilan kiring.
          </p>
          <div class="pt-2">
            <button
              type="button"
              (click)="authService.openLoginModal('/profile')"
              class="w-full py-3 px-6 rounded-2xl bg-[#7655F7] text-white font-black text-sm border-2 border-[#242424] shadow-[3px_3px_0px_#242424] hover:bg-[#6846e3] transition-all cursor-pointer"
            >
              {{ i18nService.t('myGamesGoogleLogin') }}
            </button>
          </div>
        </div>
      }
    } @else {
      @if (themeService.isEditorial()) {
        <div class="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
          <div class="border-b-2 border-double border-[#2D2926] pb-6 space-y-2">
            <div class="flex items-center justify-between text-[11px] font-sans font-bold tracking-widest uppercase text-[#8B7355]">
              <span>SPORTCHI DOSYESI VA KARTASI</span>
              <span>№ {{ authService.user()?.id ? authService.user()!.id.slice(0, 8).toUpperCase() : 'PLY-001' }}</span>
            </div>
            <h1 class="text-3xl sm:text-5xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
              {{ i18nService.t('profileDossierTitle') }}
            </h1>
            <p class="text-sm font-serif italic text-[#8B7355]">
              Jamoaviy oʻyinlardagi rasmiy koʻrsatkichlaringiz, sport toifangiz va qaydnoma maʼlumotlari.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-1 space-y-6">
              <div class="bg-[#EDE6D5] border-2 border-[#2D2926] p-6 text-center space-y-4 shadow-[3px_3px_0px_#2D2926]">
                <div class="relative inline-block">
                  @if (authService.user()?.avatar_url) {
                    <img
                      [src]="authService.user()!.avatar_url!"
                      [alt]="authService.user()!.first_name"
                      class="w-24 h-24 object-cover border-2 border-[#2D2926] mx-auto"
                    />
                  } @else {
                    <div class="w-24 h-24 bg-[#F5F0E8] border-2 border-[#2D2926] flex items-center justify-center text-3xl font-bold font-serif text-[#1A1510] mx-auto">
                      {{ authService.user()!.first_name[0] }}
                    </div>
                  }

                  <button
                    type="button"
                    (click)="avatarInput()?.nativeElement?.click()"
                    [disabled]="uploadingAvatar()"
                    class="absolute bottom-0 right-0 p-2 bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] hover:bg-[#332B24] transition-all cursor-pointer"
                    title="Suratni yangilash"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <input
                    #avatarInputRef
                    type="file"
                    accept="image/*"
                    (change)="handleAvatarSelect($event)"
                    class="hidden"
                  />
                </div>

                @if (uploadingAvatar()) {
                  <div class="text-[11px] font-sans font-bold text-[#8B7355] animate-pulse">
                    {{ i18nService.t('profilePhotoUploading') }}
                  </div>
                }

                @if (uploadError()) {
                  <div class="text-[11px] font-sans font-bold text-[#8B2E2E]">
                    {{ uploadError() }}
                  </div>
                }

                <div>
                  <h3 class="text-xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                    {{ authService.user()!.first_name }} {{ authService.user()!.last_name || '' }}
                  </h3>
                  <div class="text-xs text-[#8B7355] font-sans mt-0.5">
                    {{ authService.user()!.email || 'Google hisobi' }}
                  </div>
                </div>

                <div class="pt-2 border-t border-[#2D2926]/20 flex flex-col items-center gap-1.5">
                  <span class="text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926]">
                    {{ i18nService.t('profileRoleLabel') }}: {{ authService.user()!.role }}
                  </span>
                  <span class="text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 bg-[#F5F0E8] border border-[#2D2926]/40 text-[#8B7355]">
                    {{ i18nService.t('profileLevelLabel') }}: {{ authService.user()!.skill_level }}
                  </span>
                </div>

                <div class="pt-3 border-t border-[#2D2926]/20 space-y-1 text-left">
                  <div class="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                    {{ i18nService.t('profileEmailLabel') }}
                  </div>
                  <div class="p-2 bg-[#F5F0E8] border border-[#2D2926]/30 flex items-center gap-2 text-xs font-sans text-[#1A1510]">
                    <svg class="w-3.5 h-3.5 text-[#C5A55A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="truncate">{{ authService.user()!.email || 'Google hisobi tasdiqlangan' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="md:col-span-2 space-y-6">
              <div class="bg-[#EDE6D5] border border-[#2D2926] p-6 sm:p-8 shadow-[2px_2px_0px_#8B7355] space-y-6">
                <div class="border-b border-[#2D2926]/20 pb-3">
                  <h3 class="text-xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                    {{ i18nService.t('profileEditTitle') }}
                  </h3>
                  <p class="text-xs font-serif italic text-[#8B7355]">
                    Ism va toifangiz oyinlar hisobotida boshqa foydalanuvchilarga ko'rinadi.
                  </p>
                </div>

                @if (saveSuccess()) {
                  <div class="p-3 bg-[#F5F0E8] border border-[#2D2926] text-xs font-sans font-bold uppercase tracking-wider text-[#1A1510] flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#C5A55A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ i18nService.t('profileSavedNotice') }}</span>
                  </div>
                }

                <form (ngSubmit)="handleSave()" class="space-y-4">
                  <div>
                    <label class="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1.5">
                      {{ i18nService.t('profileFirstNameLabel') }}
                    </label>
                    <input
                      type="text"
                      [ngModel]="firstName()"
                      (ngModelChange)="firstName.set($event)"
                      name="firstName"
                      required
                      class="w-full px-4 py-2.5 bg-[#F5F0E8] border border-[#2D2926] font-sans text-xs sm:text-sm text-[#1A1510] outline-none focus:border-[#1A1510]"
                    />
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1.5">
                        {{ i18nService.t('profileLevelLabel') }}
                      </label>
                      <select
                        [ngModel]="skillLevel()"
                        (ngModelChange)="skillLevel.set($event)"
                        name="skillLevel"
                        class="w-full px-4 py-2.5 bg-[#F5F0E8] border border-[#2D2926] font-sans text-xs sm:text-sm text-[#1A1510] outline-none"
                      >
                        <option value="BEGINNER">{{ i18nService.t('beginner') }}</option>
                        <option value="CASUAL">{{ i18nService.t('casual') }}</option>
                        <option value="INTERMEDIATE">{{ i18nService.t('intermediate') }}</option>
                        <option value="ADVANCED">{{ i18nService.t('advanced') }}</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1.5">
                        {{ i18nService.t('profileAgeLabel') }}
                      </label>
                      <select
                        [ngModel]="ageBracket()"
                        (ngModelChange)="ageBracket.set($event)"
                        name="ageBracket"
                        class="w-full px-4 py-2.5 bg-[#F5F0E8] border border-[#2D2926] font-sans text-xs sm:text-sm text-[#1A1510] outline-none"
                      >
                        <option value="18-24">18–24 yosh</option>
                        <option value="25-34">25–34 yosh</option>
                        <option value="35+">35+ yosh</option>
                      </select>
                    </div>
                  </div>

                  <div class="pt-2">
                    <button
                      type="submit"
                      [disabled]="saving()"
                      class="px-6 py-2.5 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] hover:bg-[#332B24] transition-all cursor-pointer"
                    >
                      {{ saving() ? i18nService.t('profileSavingBtn') : i18nService.t('profileSaveBtn') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="space-y-4 pt-4 border-t border-[#2D2926]/30">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-[#C5A55A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <h2 class="text-2xl font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                {{ i18nService.t('profileAchievementsTitle') }}
              </h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              @for (ach of achievements(); track ach.id) {
                <div
                  [class]="'p-4 space-y-2 text-center border transition-all ' +
                    (ach.isUnlocked
                      ? 'bg-[#EDE6D5] border-[#2D2926] shadow-[2px_2px_0px_#8B7355]'
                      : 'bg-[#F5F0E8] border-[#2D2926]/30 opacity-60')"
                >
                  <div class="text-3xl">{{ ach.badge }}</div>
                  <h4 class="text-sm font-bold text-[#1A1510]" style="font-family: Georgia, serif">
                    {{ ach.title }}
                  </h4>
                  <p class="text-xs text-[#8B7355] font-serif italic leading-tight">
                    {{ ach.description }}
                  </p>
                  <div class="pt-1">
                    @if (ach.isUnlocked) {
                      <span class="text-[10px] font-sans font-bold uppercase tracking-widest text-[#1A1510] bg-[#F5F0E8] border border-[#2D2926] px-2 py-0.5">
                        {{ i18nService.t('profileUnlocked') }} ★
                      </span>
                    } @else {
                      <span class="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                        {{ i18nService.t('profileLocked') }}
                      </span>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
          <div class="space-y-2">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-black uppercase bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424]">
              {{ i18nService.t('navProfile') }}
            </span>
            <h1 class="text-3xl sm:text-5xl font-black text-[#242424]">
              {{ i18nService.t('navProfile') }}
            </h1>
            <p class="text-sm sm:text-base font-semibold text-[#555555]">
              Oʻyin darajangiz, fotosuratingiz va Google hisobingiz.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-3xl border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] md:col-span-1 text-center space-y-4 p-6">
              <div class="relative inline-block">
                @if (authService.user()?.avatar_url) {
                  <img
                    [src]="authService.user()!.avatar_url!"
                    [alt]="authService.user()!.first_name"
                    class="w-24 h-24 rounded-full object-cover border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] mx-auto"
                  />
                } @else {
                  <app-mascot size="lg" mood="happy" />
                }

                <button
                  type="button"
                  (click)="avatarInput()?.nativeElement?.click()"
                  [disabled]="uploadingAvatar()"
                  class="absolute bottom-0 right-0 p-2 rounded-full bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] hover:bg-[#cbf556] transition-transform active:translate-y-0.5 cursor-pointer"
                  title="Suratni yangilash"
                >
                  <svg class="w-4 h-4 text-[#242424]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input
                  #avatarInputRef
                  type="file"
                  accept="image/*"
                  (change)="handleAvatarSelect($event)"
                  class="hidden"
                />
              </div>

              @if (uploadingAvatar()) {
                <div class="text-xs font-black text-[#7655F7] animate-pulse">
                  {{ i18nService.t('profilePhotoUploading') }}
                </div>
              }

              @if (uploadError()) {
                <div class="text-[11px] font-bold text-[#FF795D]">
                  {{ uploadError() }}
                </div>
              }

              <div>
                <h3 class="text-xl font-black text-[#242424]">
                  {{ authService.user()!.first_name }} {{ authService.user()!.last_name || '' }}
                </h3>
                <div class="text-xs font-bold text-[#7655F7] mt-0.5">
                  {{ authService.user()!.email || 'Google hisobi' }}
                </div>
              </div>

              <div class="flex flex-col items-center gap-1.5 pt-1">
                <span
                  [class]="'px-3 py-1 rounded-full text-xs font-black uppercase border-2 border-[#242424] shadow-[2px_2px_0px_#242424] ' +
                    (authService.isAdmin() ? 'bg-[#7655F7] text-white' : 'bg-[#FFF9EF] text-[#242424]')"
                >
                  {{ i18nService.t('profileRoleLabel') }}: {{ authService.user()!.role }}
                </span>
                <span class="inline-block px-3 py-1 rounded-full text-xs font-black uppercase bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424]">
                  {{ authService.user()!.skill_level }}
                </span>
              </div>

              <div class="pt-4 border-t border-[#EEEEEE] space-y-2">
                <div class="text-[11px] font-black uppercase text-[#888888]">
                  {{ i18nService.t('profileEmailLabel') }}
                </div>
                <div class="p-2.5 bg-[#FFF9EF] border-2 border-[#242424] rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-[#242424]">
                  <svg class="w-4 h-4 text-[#34A853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{{ authService.user()!.email || 'Google hisobi tasdiqlangan' }}</span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-3xl border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] md:col-span-2 space-y-6 p-6 sm:p-8">
              <div>
                <h3 class="text-xl font-black text-[#242424]">
                  {{ i18nService.t('profileEditTitle') }}
                </h3>
                <p class="text-xs text-[#777777]">
                  Ism va sport darajangiz zalda boshqa ishtirokchilarga koʻrinadi.
                </p>
              </div>

              @if (saveSuccess()) {
                <div class="p-3 bg-[#D7FF64] border-2 border-[#242424] rounded-xl text-xs font-black text-[#242424] flex items-center gap-2">
                  <svg class="w-4 h-4 text-[#7655F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ i18nService.t('profileSavedNotice') }}</span>
                </div>
              }

              <form (ngSubmit)="handleSave()" class="space-y-4">
                <div>
                  <label class="block text-xs font-black uppercase text-[#242424] mb-1">
                    {{ i18nService.t('profileFirstNameLabel') }}
                  </label>
                  <input
                    type="text"
                    [ngModel]="firstName()"
                    (ngModelChange)="firstName.set($event)"
                    name="firstName"
                    required
                    class="w-full px-4 py-3 rounded-2xl bg-[#FFF9EF] border-2 border-[#242424] font-bold text-sm outline-none focus:bg-white"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-black uppercase text-[#242424] mb-1">
                      {{ i18nService.t('profileLevelLabel') }}
                    </label>
                    <select
                      [ngModel]="skillLevel()"
                      (ngModelChange)="skillLevel.set($event)"
                      name="skillLevel"
                      class="w-full px-4 py-3 rounded-2xl bg-[#FFF9EF] border-2 border-[#242424] font-bold text-sm outline-none focus:bg-white"
                    >
                      <option value="BEGINNER">{{ i18nService.t('beginner') }}</option>
                      <option value="CASUAL">{{ i18nService.t('casual') }}</option>
                      <option value="INTERMEDIATE">{{ i18nService.t('intermediate') }}</option>
                      <option value="ADVANCED">{{ i18nService.t('advanced') }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-xs font-black uppercase text-[#242424] mb-1">
                      {{ i18nService.t('profileAgeLabel') }}
                    </label>
                    <select
                      [ngModel]="ageBracket()"
                      (ngModelChange)="ageBracket.set($event)"
                      name="ageBracket"
                      class="w-full px-4 py-3 rounded-2xl bg-[#FFF9EF] border-2 border-[#242424] font-bold text-sm outline-none focus:bg-white"
                    >
                      <option value="18-24">18–24 yosh</option>
                      <option value="25-34">25–34 yosh</option>
                      <option value="35+">35+ yosh</option>
                    </select>
                  </div>
                </div>

                <div class="pt-2">
                  <button
                    type="submit"
                    [disabled]="saving()"
                    class="w-full sm:w-auto py-3 px-6 rounded-2xl bg-[#D7FF64] text-[#242424] font-black text-sm border-2 border-[#242424] shadow-[3px_3px_0px_#242424] hover:bg-[#cbf556] transition-all cursor-pointer"
                  >
                    {{ saving() ? i18nService.t('profileSavingBtn') : i18nService.t('profileSaveBtn') }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="space-y-4 pt-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-[#7655F7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <h2 class="text-2xl font-black text-[#242424]">{{ i18nService.t('profileAchievementsTitle') }}</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              @for (ach of achievements(); track ach.id) {
                <div
                  [class]="'rounded-3xl border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] p-4 space-y-2 text-center transition-all ' +
                    (ach.isUnlocked ? 'bg-white border-[#7655F7]' : 'bg-[#FFF9EF] opacity-60 border-dashed')"
                >
                  <div class="text-3xl sm:text-4xl">{{ ach.badge }}</div>
                  <h4 class="text-sm font-black text-[#242424]">
                    {{ ach.title }}
                  </h4>
                  <p class="text-xs text-[#666666] leading-tight">
                    {{ ach.description }}
                  </p>
                  <div class="pt-1">
                    @if (ach.isUnlocked) {
                      <span class="text-[10px] font-black uppercase text-[#7655F7] bg-[#EBE5FF] px-2 py-0.5 rounded-full">
                        {{ i18nService.t('profileUnlocked') }} ✨
                      </span>
                    } @else {
                      <span class="text-[10px] font-bold text-[#888888]">
                        {{ i18nService.t('profileLocked') }} 🔒
                      </span>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly authService: AuthService = inject(AuthService);
  readonly themeService: ThemeService = inject(ThemeService);
  readonly i18nService: I18nService = inject(I18nService);
  private readonly apiService: ApiService = inject(ApiService);

  readonly avatarInput = viewChild<ElementRef<HTMLInputElement>>('avatarInputRef');

  readonly achievements = signal<Achievement[]>([]);
  readonly firstName = signal<string>('');
  readonly skillLevel = signal<SkillLevel>('BEGINNER');
  readonly ageBracket = signal<string>('18-24');
  readonly saving = signal<boolean>(false);
  readonly saveSuccess = signal<boolean>(false);
  readonly uploadingAvatar = signal<boolean>(false);
  readonly uploadError = signal<string | null>(null);

  constructor() {
    effect((): void => {
      const u = this.authService.user();
      if (u) {
        this.firstName.set(u.first_name || '');
        this.skillLevel.set(u.skill_level || 'BEGINNER');
        this.ageBracket.set(u.age_bracket || '18-24');
      }
    });

    this.apiService.fetchAchievements().then((data: Achievement[]): void => {
      this.achievements.set(data);
    }).catch((): void => {
      this.achievements.set([]);
    });
  }

  async handleAvatarSelect(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingAvatar.set(true);
    this.uploadError.set(null);

    try {
      await this.apiService.uploadAvatar(file);
      await this.authService.refreshProfile();
    } catch (err: any) {
      this.uploadError.set(err.message || 'Rasm yuklashda xatolik yuz berdi');
    } finally {
      this.uploadingAvatar.set(false);
    }
  }

  async handleSave(): Promise<void> {
    this.saving.set(true);
    this.saveSuccess.set(false);

    try {
      await this.apiService.updateProfile({
        first_name: this.firstName(),
        skill_level: this.skillLevel(),
        age_bracket: this.ageBracket(),
      });
      await this.authService.refreshProfile();
      this.saveSuccess.set(true);
    } finally {
      this.saving.set(false);
    }
  }
}
