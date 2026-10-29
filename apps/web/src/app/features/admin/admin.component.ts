import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { ApiService } from '../../core/services/api.service';
import { compressImage } from '../../core/services/image';
import {
  AdminMetrics,
  AdminBookingItem,
  AuditLogItem,
  VenueItem,
  SportItem,
  PartnershipInquiry,
  SessionItem,
  AdminSessionFormData,
  AdminVenueFormData,
} from '../../core/models/types';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
  readonly authService: AuthService = inject(AuthService);
  readonly themeService: ThemeService = inject(ThemeService);
  private readonly apiService: ApiService = inject(ApiService);

  readonly metrics: WritableSignal<AdminMetrics | null> = signal<AdminMetrics | null>(null);
  readonly bookings: WritableSignal<AdminBookingItem[]> = signal<AdminBookingItem[]>([]);
  readonly auditLogs: WritableSignal<AuditLogItem[]> = signal<AuditLogItem[]>([]);
  readonly venues: WritableSignal<VenueItem[]> = signal<VenueItem[]>([]);
  readonly sports: WritableSignal<SportItem[]> = signal<SportItem[]>([]);
  readonly inquiries: WritableSignal<PartnershipInquiry[]> = signal<PartnershipInquiry[]>([]);
  readonly sessionsList: WritableSignal<SessionItem[]> = signal<SessionItem[]>([]);

  readonly loading = signal<boolean>(true);
  readonly convertingInquiryId = signal<string | null>(null);
  readonly inquiryStatusFilter = signal<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('ALL');

  readonly showCreateModal = signal<boolean>(false);
  readonly formSubmitting = signal<boolean>(false);
  readonly uploadingSessionPic = signal<boolean>(false);
  readonly createSuccess = signal<string | null>(null);
  readonly createError = signal<string | null>(null);

  readonly showCreateVenueModal = signal<boolean>(false);
  readonly venueSubmitting = signal<boolean>(false);
  readonly venueSuccess = signal<string | null>(null);
  readonly venueError = signal<string | null>(null);

  readonly venueForm = signal<AdminVenueFormData>({
    name: '',
    district: 'Chilonzor',
    address: '',
    description: '',
    supportedSports: ['table-tennis'],
    hourlyRate: 150000,
    contactPhone: '+998 71 200 00 00',
    amenities: 'Dush, Kiyinish xonasi, Bepul suv',
  });

  readonly sessionForm = signal<AdminSessionFormData>({
    venueId: '',
    sportId: '',
    title: '',
    scheduledAt: '',
    durationMinutes: 90,
    maxSlots: 6,
    minParticipants: 2,
    pricePerSlot: 28000,
    serviceFee: 3000,
    skillLevel: 'BEGINNER',
    sessionVibe: 'FRIENDLY',
    equipmentProvided: true,
    equipmentDetails: 'Rackets and balls included',
    rulesNotes: 'Rotating round robin games',
    bookingDeadline: '',
    cancellationDeadlineHours: 4,
    imageUrl: '',
  });

  readonly pendingInquiriesCount = computed(() => {
    return this.inquiries().filter((i) => !i.status || i.status === 'PENDING').length;
  });

  readonly acceptedInquiriesCount = computed(() => {
    return this.inquiries().filter((i) => i.status === 'ACCEPTED').length;
  });

  readonly rejectedInquiriesCount = computed(() => {
    return this.inquiries().filter((i) => i.status === 'REJECTED').length;
  });

  readonly filteredInquiries = computed(() => {
    const f = this.inquiryStatusFilter();
    return this.inquiries().filter((i) => {
      const st = i.status || 'PENDING';
      if (f === 'ALL') return true;
      return st === f;
    });
  });

  async ngOnInit(): Promise<void> {
    if (this.authService.isAdmin()) {
      await this.loadData();
    }
  }

  async loadData(): Promise<void> {
    try {
      this.loading.set(true);
      const [m, b, a, vList, sList, inqList, sessList] = await Promise.all([
        this.apiService.fetchAdminMetrics(),
        this.apiService.fetchAdminBookings(),
        this.apiService.fetchAdminAuditLogs(),
        this.apiService.fetchVenues(),
        this.apiService.fetchSports(),
        this.apiService.fetchAdminPartnershipInquiries(),
        this.apiService.fetchSessions(),
      ]);

      this.metrics.set(m);
      this.bookings.set(b);
      this.auditLogs.set(a);
      this.venues.set(vList);
      this.sports.set(sList);
      this.inquiries.set(inqList || []);
      this.sessionsList.set(sessList || []);

      if (vList && vList.length > 0) {
        this.sessionForm.update((prev) => ({
          ...prev,
          venueId: vList.some((v: VenueItem) => v.id === prev.venueId) ? prev.venueId : vList[0].id,
        }));
      }

      if (sList && sList.length > 0) {
        this.sessionForm.update((prev) => ({
          ...prev,
          sportId: sList.some((s: SportItem) => s.id === prev.sportId) ? prev.sportId : sList[0].id,
        }));
      }
    } catch {
    } finally {
      this.loading.set(false);
    }
  }

  updateSessionFormField(field: keyof AdminSessionFormData, val: any): void {
    this.sessionForm.update((prev) => ({
      ...prev,
      [field]: val,
    }));
  }

  updateVenueFormField(field: keyof AdminVenueFormData, val: any): void {
    this.venueForm.update((prev) => ({
      ...prev,
      [field]: val,
    }));
  }

  async handleCreateVenue(): Promise<void> {
    this.venueSubmitting.set(true);
    this.venueSuccess.set(null);
    this.venueError.set(null);

    try {
      const v = this.venueForm();
      const amenitiesArray = v.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const created = await this.apiService.createAdminVenue({
        name: v.name,
        district: v.district,
        address: v.address,
        description: v.description,
        supportedSports: JSON.stringify(v.supportedSports),
        hourlyRate: Number(v.hourlyRate),
        contactPhone: v.contactPhone || null,
        amenities: JSON.stringify(amenitiesArray),
        isPartner: true,
      });

      const inqId = this.convertingInquiryId();
      if (inqId) {
        await this.apiService.updateAdminInquiryStatus(inqId, 'ACCEPTED');
        this.convertingInquiryId.set(null);
      }

      this.venueSuccess.set('Sport majmuasi muvaffaqiyatli saqlandi!');
      this.showCreateVenueModal.set(false);
      this.venueForm.set({
        name: '',
        district: 'Chilonzor',
        address: '',
        description: '',
        supportedSports: ['table-tennis'],
        hourlyRate: 150000,
        contactPhone: '+998 71 200 00 00',
        amenities: 'Dush, Kiyinish xonasi, Bepul suv',
      });
      await this.loadData();
      if (created?.id) {
        this.sessionForm.update((prev) => ({ ...prev, venueId: created.id }));
      }
    } catch (err: any) {
      this.venueError.set(err.message || 'Majmuani saqlashda xatolik yuz berdi');
    } finally {
      this.venueSubmitting.set(false);
    }
  }

  handleConvertInquiryToVenue(inq: PartnershipInquiry): void {
    this.convertingInquiryId.set(inq.id);
    this.venueForm.set({
      name: inq.venue_name || '',
      district: inq.district || 'Chilonzor',
      address: inq.venue_name ? `${inq.district}, ${inq.venue_name}` : '',
      description: inq.message || `${inq.contact_name} tomonidan qoldirilgan ariza`,
      supportedSports: [inq.sport_types || 'table-tennis'],
      hourlyRate: 150000,
      contactPhone: inq.phone || '+998 71 200 00 00',
      amenities: 'Dush, Kiyinish xonasi, Bepul suv',
    });
    this.showCreateVenueModal.set(true);
  }

  async handleUploadSessionPic(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const rawFile = input.files?.[0];
    if (!rawFile) return;

    this.uploadingSessionPic.set(true);
    this.createError.set(null);
    try {
      const { file, dataUrl } = await compressImage(rawFile);
      if (dataUrl) {
        this.sessionForm.update((prev) => ({ ...prev, imageUrl: dataUrl }));
      }
      const res = await this.apiService.uploadImage(file);
      if (res?.url) {
        this.sessionForm.update((prev) => ({ ...prev, imageUrl: res.url }));
      }
    } catch {
    } finally {
      this.uploadingSessionPic.set(false);
    }
  }

  handleConvertInquiryToSession(inq: PartnershipInquiry): void {
    this.convertingInquiryId.set(inq.id);
    const matchingSport = this.sports().find(
      (s: SportItem) =>
        s.slug === inq.sport_types ||
        s.name?.toLowerCase().includes(inq.sport_types?.toLowerCase()),
    );
    this.sessionForm.update((prev) => ({
      ...prev,
      title: inq.venue_name ? `${inq.venue_name} - Maxsus oʻyin` : 'Pley oʻyin',
      sportId: matchingSport?.id || prev.sportId,
      scheduledAt: inq.scheduled_at
        ? new Date(inq.scheduled_at).toISOString().slice(0, 16)
        : new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      pricePerSlot: inq.price_per_slot ? Number(inq.price_per_slot) : 28000,
      imageUrl: inq.image_url || '',
    }));
    this.showCreateModal.set(true);
  }

  async handleAcceptInquiry(id: string): Promise<void> {
    try {
      await this.apiService.updateAdminInquiryStatus(id, 'ACCEPTED');
      await this.loadData();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  }

  async handleRejectInquiry(id: string): Promise<void> {
    try {
      await this.apiService.updateAdminInquiryStatus(id, 'REJECTED');
      await this.loadData();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  }

  async handleDeleteInquiry(id: string): Promise<void> {
    if (!confirm('Ushbu arizani roʻyxatdan butunlay oʻchirishni xohlaysizmi?')) return;
    try {
      await this.apiService.deleteAdminInquiry(id);
      await this.loadData();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  }

  async handleCancelSession(sessionId: string): Promise<void> {
    if (!confirm('Ushbu sessiyani bekor qilishni tasdiqlaysizmi?')) return;
    try {
      await this.apiService.cancelAdminSession(sessionId);
      await this.loadData();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  }

  async handleCreateSession(): Promise<void> {
    this.createSuccess.set(null);
    this.createError.set(null);

    const f = this.sessionForm();
    if (!f.venueId) {
      this.createError.set('Iltimos, avval sport majmuasini tanlang yoki yangi majmua qoʻshing');
      return;
    }
    if (!f.sportId) {
      this.createError.set('Iltimos, sport turini tanlang');
      return;
    }

    this.formSubmitting.set(true);
    try {
      const scheduledIso = new Date(f.scheduledAt).toISOString();
      const deadlineIso = f.bookingDeadline
        ? new Date(f.bookingDeadline).toISOString()
        : new Date(new Date(f.scheduledAt).getTime() - 2 * 3600 * 1000).toISOString();

      await this.apiService.createAdminSession({
        ...f,
        scheduledAt: scheduledIso,
        bookingDeadline: deadlineIso,
      });

      const inqId = this.convertingInquiryId();
      if (inqId) {
        await this.apiService.updateAdminInquiryStatus(inqId, 'ACCEPTED');
        this.convertingInquiryId.set(null);
      }

      this.createSuccess.set('Sessiya muvaffaqiyatli yaratildi va eʼlon qilindi!');
      this.showCreateModal.set(false);
      await this.loadData();
    } catch (err: any) {
      this.createError.set(err.message || 'Xatolik yuz berdi');
    } finally {
      this.formSubmitting.set(false);
    }
  }
}
