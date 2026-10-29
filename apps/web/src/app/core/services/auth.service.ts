import { Injectable, inject, signal, computed, WritableSignal, Signal } from '@angular/core';
import { UserProfile } from '../models/types';
import { ApiService } from './api.service';
import { getCookie, deleteCookie } from './cookies';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);

  public readonly user: WritableSignal<UserProfile | null> = signal<UserProfile | null>(null);
  public readonly loading: WritableSignal<boolean> = signal<boolean>(true);
  public readonly token: WritableSignal<string | null> = signal<string | null>(null);

  public readonly isAuthenticated: Signal<boolean> = computed(() => !!this.user());
  public readonly isAdmin: Signal<boolean> = computed(() => this.user()?.role === 'ADMIN');

  public readonly isAuthModalOpen: WritableSignal<boolean> = signal<boolean>(false);
  public readonly authRedirectPath: WritableSignal<string> = signal<string>('/discover');

  public async init(): Promise<void> {
    if (typeof window === 'undefined') return;

    const storedToken = getCookie('pley_token') || localStorage.getItem('pley_token');
    this.token.set(storedToken);

    if (storedToken) {
      await this.loadProfile();
    } else {
      this.user.set(null);
      this.loading.set(false);
    }
  }

  public async loadProfile(): Promise<void> {
    try {
      this.loading.set(true);
      const profile = await this.api.fetchMyProfile();
      this.user.set(profile);
    } catch {
      this.user.set(null);
      this.token.set(null);
      deleteCookie('pley_token');
      localStorage.removeItem('pley_token');
    } finally {
      this.loading.set(false);
    }
  }

  public async refreshProfile(): Promise<void> {
    await this.loadProfile();
  }

  public logout(): void {
    deleteCookie('pley_token');
    localStorage.removeItem('pley_token');
    localStorage.removeItem('pley_dev_user_id');
    this.token.set(null);
    this.user.set(null);
  }

  public openAuthModal(redirectPath: string = '/discover'): void {
    this.authRedirectPath.set(redirectPath);
    this.isAuthModalOpen.set(true);
  }

  public openLoginModal(redirectPath: string = '/discover'): void {
    this.openAuthModal(redirectPath);
  }

  public closeAuthModal(): void {
    this.isAuthModalOpen.set(false);
  }
}
