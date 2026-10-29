import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { CartoonHomeComponent } from './cartoon-home.component';
import { EditorialHomeComponent } from './editorial-home.component';
import { SessionItem, PartnerFormData } from '../../core/models/types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CartoonHomeComponent, EditorialHomeComponent],
  template: `
    @if (themeService.isEditorial()) {
      <app-editorial-home
        [upcomingSessions]="upcomingSessions()"
        [formData]="partnerForm()"
        (formDataChange)="partnerForm.set($event)"
        [partnerSubmitting]="partnerSubmitting()"
        [partnerSuccess]="partnerSuccess()"
        [partnerError]="partnerError()"
        (formSubmit)="handlePartnerSubmit()"
      />
    } @else {
      <app-cartoon-home
        [upcomingSessions]="upcomingSessions()"
        [formData]="partnerForm()"
        (formDataChange)="partnerForm.set($event)"
        [partnerSubmitting]="partnerSubmitting()"
        [partnerSuccess]="partnerSuccess()"
        [partnerError]="partnerError()"
        (formSubmit)="handlePartnerSubmit()"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  readonly themeService: ThemeService = inject(ThemeService);
  readonly authService: AuthService = inject(AuthService);
  readonly i18nService: I18nService = inject(I18nService);
  private readonly apiService: ApiService = inject(ApiService);

  readonly upcomingSessions = signal<SessionItem[]>([]);
  readonly partnerForm = signal<PartnerFormData>({
    contactName: '',
    phone: '',
    venueName: '',
    district: 'Yunusobod',
    sportTypes: 'table-tennis',
    inquiryType: 'VENUE',
    imageUrl: '',
    scheduledAt: '',
    pricePerSlot: 28000,
    message: '',
  });

  readonly partnerSubmitting = signal<boolean>(false);
  readonly partnerSuccess = signal<boolean>(false);
  readonly partnerError = signal<string | null>(null);

  public async ngOnInit(): Promise<void> {
    try {
      const sessions = await this.apiService.fetchSessions();
      this.upcomingSessions.set(sessions.slice(0, 3));
    } catch {
      this.upcomingSessions.set([]);
    }

    const currentUser = this.authService.user();
    if (currentUser) {
      this.partnerForm.update((prev: PartnerFormData): PartnerFormData => ({
        ...prev,
        contactName: prev.contactName || `${currentUser.first_name} ${currentUser.last_name || ''}`.trim(),
      }));
    }
  }

  public async handlePartnerSubmit(): Promise<void> {
    if (!this.authService.isAuthenticated()) {
      this.partnerError.set(this.i18nService.t('partnerLoginRequired'));
      this.authService.openAuthModal('/');
      return;
    }

    this.partnerSubmitting.set(true);
    this.partnerError.set(null);

    const form = this.partnerForm();
    try {
      await this.apiService.submitPartnershipInquiry({
        contactName: form.contactName,
        phone: form.phone,
        venueName: form.venueName,
        district: form.district,
        sportTypes: form.sportTypes,
        inquiryType: form.inquiryType,
        imageUrl: form.imageUrl || undefined,
        scheduledAt: form.scheduledAt || undefined,
        pricePerSlot: form.pricePerSlot,
        message: form.message || undefined,
      });
      this.partnerSuccess.set(true);
    } catch (err: any) {
      this.partnerError.set(err.message || 'Hamkorlik arizasini yuborishda xatolik yuz berdi');
    } finally {
      this.partnerSubmitting.set(false);
    }
  }
}
