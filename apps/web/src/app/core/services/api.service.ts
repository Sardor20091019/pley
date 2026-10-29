import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  SessionItem,
  SessionDetail,
  UserBooking,
  UserProfile,
  AdminMetrics,
} from '../models/types';
import { getCookie, setCookie } from './cookies';

function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = (window as unknown as { __ENV?: { API_URL?: string } }).__ENV?.API_URL;
    if (custom) {
      return custom;
    }
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return `${window.location.origin}/api/v1`;
    }
  }
  return 'http://localhost:4000/api/v1';
}

const API_BASE_URL = resolveApiBaseUrl();

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);

  public async fetchSessions(filters?: {
    sport?: string;
    district?: string;
    search?: string;
    skillLevel?: string;
    sessionVibe?: string;
  }): Promise<SessionItem[]> {
    let params = new HttpParams();
    if (filters?.sport) params = params.set('sport', filters.sport);
    if (filters?.district) params = params.set('district', filters.district);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.skillLevel && filters.skillLevel !== 'ALL_LEVELS') {
      params = params.set('skillLevel', filters.skillLevel);
    }
    if (filters?.sessionVibe) params = params.set('sessionVibe', filters.sessionVibe);

    return firstValueFrom(
      this.http.get<SessionItem[]>(`${API_BASE_URL}/sessions`, { params }),
    );
  }

  public async fetchSessionById(id: string): Promise<SessionDetail> {
    return firstValueFrom(
      this.http.get<SessionDetail>(`${API_BASE_URL}/sessions/${id}`),
    );
  }

  public async reserveSpot(sessionId: string): Promise<any> {
    return firstValueFrom(
      this.http.post<any>(`${API_BASE_URL}/bookings`, { sessionId }),
    );
  }

  public async cancelBooking(bookingId: string): Promise<any> {
    return firstValueFrom(
      this.http.delete<any>(`${API_BASE_URL}/bookings/${bookingId}`),
    );
  }

  public async fetchMyBookings(): Promise<UserBooking[]> {
    return firstValueFrom(
      this.http.get<UserBooking[]>(`${API_BASE_URL}/bookings/my`),
    );
  }

  public async fetchMyProfile(): Promise<UserProfile> {
    return firstValueFrom(
      this.http.get<UserProfile>(`${API_BASE_URL}/users/profile`),
    );
  }

  public async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    return firstValueFrom(
      this.http.patch<UserProfile>(`${API_BASE_URL}/users/profile`, data),
    );
  }

  public async fetchAchievements(): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${API_BASE_URL}/users/achievements`),
    ).catch(() => []);
  }

  public async submitPartnershipInquiry(data: {
    contactName: string;
    phone: string;
    venueName: string;
    district: string;
    sportTypes: string;
    message?: string;
    inquiryType?: 'VENUE' | 'SESSION';
    imageUrl?: string;
    scheduledAt?: string;
    pricePerSlot?: number;
    turnstileToken?: string;
  }): Promise<any> {
    const payload: Record<string, any> = {
      contactName: data.contactName.trim(),
      phone: data.phone.trim(),
      venueName: data.venueName.trim(),
      district: data.district.trim(),
      sportTypes: data.sportTypes.trim(),
    };

    if (data.message && data.message.trim()) {
      payload['message'] = data.message.trim();
    }

    if (data.inquiryType === 'SESSION') {
      payload['inquiryType'] = 'SESSION';
      if (data.imageUrl && data.imageUrl.trim()) {
        payload['imageUrl'] = data.imageUrl.trim();
      }
      if (data.scheduledAt && data.scheduledAt.trim()) {
        payload['scheduledAt'] = data.scheduledAt.trim();
      }
      if (typeof data.pricePerSlot === 'number' && !isNaN(data.pricePerSlot) && data.pricePerSlot > 0) {
        payload['pricePerSlot'] = data.pricePerSlot;
      }
    } else if (data.imageUrl && data.imageUrl.trim()) {
      payload['imageUrl'] = data.imageUrl.trim();
    }

    if (data.turnstileToken) {
      payload['turnstileToken'] = data.turnstileToken;
    }

    return firstValueFrom(
      this.http.post<any>(`${API_BASE_URL}/partnership/inquiry`, payload),
    );
  }

  public async fetchAdminMetrics(): Promise<AdminMetrics> {
    return firstValueFrom(
      this.http.get<AdminMetrics>(`${API_BASE_URL}/admin/metrics`),
    );
  }

  public async fetchAdminBookings(): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${API_BASE_URL}/admin/bookings`),
    ).catch(() => []);
  }

  public async fetchAdminAuditLogs(): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${API_BASE_URL}/admin/audit-logs`),
    ).catch(() => []);
  }

  public async fetchVenues(): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${API_BASE_URL}/venues`),
    ).catch(() => []);
  }

  public async fetchSports(): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${API_BASE_URL}/sports`),
    ).catch(() => []);
  }

  public async fetchAdminPartnershipInquiries(): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>(`${API_BASE_URL}/partnership/inquiries`),
    ).catch(() => []);
  }

  public async updateAdminInquiryStatus(
    id: string,
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  ): Promise<any> {
    return firstValueFrom(
      this.http.patch<any>(`${API_BASE_URL}/partnership/inquiries/${id}/status`, { status }),
    );
  }

  public async deleteAdminInquiry(id: string): Promise<any> {
    return firstValueFrom(
      this.http.delete<any>(`${API_BASE_URL}/partnership/inquiries/${id}`),
    );
  }

  public async fetchGoogleAuthUrl(redirectUri: string): Promise<string> {
    const params = new HttpParams().set('redirectUri', redirectUri);
    const res = await firstValueFrom(
      this.http.get<{ url: string }>(`${API_BASE_URL}/auth/google/url`, { params }),
    );
    return res.url;
  }

  public async loginWithGoogleCode(
    code: string,
    redirectUri: string,
    turnstileToken: string,
  ): Promise<{ token: string; user: UserProfile }> {
    const res = await firstValueFrom(
      this.http.post<{ token: string; user: UserProfile }>(
        `${API_BASE_URL}/auth/google/callback`,
        { code, redirectUri, turnstileToken },
      ),
    );

    setCookie('pley_token', res.token, 30);
    localStorage.setItem('pley_token', res.token);
    return res;
  }

  public async loginWithGoogleCredential(
    credential: string,
    turnstileToken: string,
  ): Promise<{ token: string; user: UserProfile }> {
    const res = await firstValueFrom(
      this.http.post<{ token: string; user: UserProfile }>(
        `${API_BASE_URL}/auth/google/credential`,
        { credential, turnstileToken },
      ),
    );

    setCookie('pley_token', res.token, 30);
    localStorage.setItem('pley_token', res.token);
    return res;
  }

  public async uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return firstValueFrom(
      this.http.post<{ url: string }>(`${API_BASE_URL}/upload/avatar`, formData),
    );
  }

  public async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return firstValueFrom(
      this.http.post<{ url: string }>(`${API_BASE_URL}/upload/image`, formData),
    );
  }

  public async createAdminSession(data: any): Promise<any> {
    return firstValueFrom(
      this.http.post<any>(`${API_BASE_URL}/sessions`, data),
    );
  }

  public async cancelAdminSession(sessionId: string): Promise<any> {
    return firstValueFrom(
      this.http.delete<any>(`${API_BASE_URL}/sessions/${sessionId}`),
    );
  }

  public async createAdminVenue(data: any): Promise<any> {
    return firstValueFrom(
      this.http.post<any>(`${API_BASE_URL}/venues`, data),
    );
  }
}
