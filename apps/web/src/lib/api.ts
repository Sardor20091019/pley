import {
  SessionItem,
  SessionDetail,
  UserBooking,
  UserProfile,
  AdminMetrics,
} from './types';
import { getCookie, setCookie } from './cookies';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = getCookie('pley_token') || localStorage.getItem('pley_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function fetchSessions(filters?: {
  sport?: string;
  district?: string;
  search?: string;
  skillLevel?: string;
  sessionVibe?: string;
}): Promise<SessionItem[]> {
  const params = new URLSearchParams();
  if (filters?.sport) params.set('sport', filters.sport);
  if (filters?.district) params.set('district', filters.district);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.skillLevel && filters.skillLevel !== 'ALL_LEVELS') {
    params.set('skillLevel', filters.skillLevel);
  }
  if (filters?.sessionVibe) params.set('sessionVibe', filters.sessionVibe);

  const res = await fetch(`${API_BASE_URL}/sessions?${params.toString()}`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch sessions');
  }

  return res.json();
}

export async function fetchSessionById(id: string): Promise<SessionDetail> {
  const res = await fetch(`${API_BASE_URL}/sessions/${id}`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch session: ${id}`);
  }

  return res.json();
}

export async function reserveSpot(sessionId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ sessionId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to reserve spot');
  }

  return res.json();
}

export async function cancelBooking(bookingId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to cancel booking');
  }

  return res.json();
}

export async function fetchMyBookings(): Promise<UserBooking[]> {
  const res = await fetch(`${API_BASE_URL}/bookings/my`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to load user bookings');
  }

  return res.json();
}

export async function fetchMyProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return res.json();
}

export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update profile');
  }

  return res.json();
}

export async function fetchAchievements(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/users/achievements`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function submitPartnershipInquiry(data: {
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
    payload.message = data.message.trim();
  }

  if (data.inquiryType === 'SESSION') {
    payload.inquiryType = 'SESSION';
    if (data.imageUrl && data.imageUrl.trim()) {
      payload.imageUrl = data.imageUrl.trim();
    }
    if (data.scheduledAt && data.scheduledAt.trim()) {
      payload.scheduledAt = data.scheduledAt.trim();
    }
    if (typeof data.pricePerSlot === 'number' && !isNaN(data.pricePerSlot) && data.pricePerSlot > 0) {
      payload.pricePerSlot = data.pricePerSlot;
    }
  } else if (data.imageUrl && data.imageUrl.trim()) {
    payload.imageUrl = data.imageUrl.trim();
  }

  if (data.turnstileToken) {
    payload.turnstileToken = data.turnstileToken;
  }

  const res = await fetch(`${API_BASE_URL}/partnership/inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message || 'Failed to submit partnership inquiry';
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  const res = await fetch(`${API_BASE_URL}/admin/metrics`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch admin metrics');
  }

  return res.json();
}

export async function fetchAdminBookings(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/admin/bookings`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function fetchAdminAuditLogs(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/admin/audit-logs`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function fetchVenues(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/venues`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function fetchSports(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/sports`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function fetchAdminPartnershipInquiries(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/partnership/inquiries`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export async function updateAdminInquiryStatus(
  id: string,
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/partnership/inquiries/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update inquiry status');
  }

  return res.json();
}

export async function deleteAdminInquiry(id: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/partnership/inquiries/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete inquiry');
  }

  return res.json();
}

export async function fetchGoogleAuthUrl(redirectUri: string): Promise<string> {
  const params = new URLSearchParams({ redirectUri });
  const res = await fetch(`${API_BASE_URL}/auth/google/url?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to retrieve Google Auth URL');
  }
  const data = await res.json();
  return data.url;
}

export async function loginWithGoogleCode(
  code: string,
  redirectUri: string,
  turnstileToken: string,
): Promise<{ token: string; user: UserProfile }> {
  if (!turnstileToken) {
    throw new Error('Cloudflare Turnstile tekshiruvi talab qilinadi');
  }

  const res = await fetch(`${API_BASE_URL}/auth/google/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirectUri, turnstileToken }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Google sign-in failed');
  }

  const data = await res.json();
  if (typeof window !== 'undefined') {
    setCookie('pley_token', data.token, 30);
    localStorage.setItem('pley_token', data.token);
  }

  return data;
}

export async function loginWithGoogleCredential(
  credential: string,
  turnstileToken: string,
): Promise<{ token: string; user: UserProfile }> {
  if (!turnstileToken) {
    throw new Error('Cloudflare Turnstile tekshiruvi talab qilinadi');
  }

  const res = await fetch(`${API_BASE_URL}/auth/google/credential`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential, turnstileToken }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Google credential sign-in failed');
  }

  const data = await res.json();
  if (typeof window !== 'undefined') {
    setCookie('pley_token', data.token, 30);
    localStorage.setItem('pley_token', data.token);
  }

  return data;
}

export async function uploadAvatar(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = getCookie('pley_token') || localStorage.getItem('pley_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}/upload/avatar`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Avatar upload failed');
  }

  return res.json();
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = getCookie('pley_token') || localStorage.getItem('pley_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}/upload/image`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Image upload failed');
  }

  return res.json();
}

export async function createAdminSession(data: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create session');
  }

  return res.json();
}

export async function cancelAdminSession(sessionId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to cancel session');
  }

  return res.json();
}

export async function createAdminVenue(data: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/venues`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create venue');
  }

  return res.json();
}

