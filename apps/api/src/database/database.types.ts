import { Generated } from 'kysely';

export type UserRole = 'USER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';
export type SkillLevel = 'ALL_LEVELS' | 'BEGINNER' | 'CASUAL' | 'INTERMEDIATE' | 'ADVANCED';
export type SessionVibe = 'FRIENDLY' | 'COMPETITIVE' | 'LEARNING' | 'SOCIAL';
export type SessionStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'COMPLETED'
  | 'NO_SHOW';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';
export type PaymentProvider = 'CLICK' | 'PAYME' | 'SIMULATED';
export type AttendanceStatus = 'UNCONFIRMED' | 'ATTENDED' | 'ABSENT';

export interface UsersTable {
  id: string;
  google_id: string | null;
  email: string;
  first_name: string;
  last_name: string | null;
  avatar_url: string | null;
  age_bracket: string;
  skill_level: SkillLevel;
  preferred_sports: string;
  preferred_neighborhoods: string;
  profile_visibility: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface SportsTable {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  min_players_per_slot: number;
  active: number;
  created_at: string;
}

export interface VenuesTable {
  id: string;
  name: string;
  district: string;
  address: string;
  description: string;
  supported_sports: string;
  hourly_rate: number;
  is_partner: number;
  active: number;
  contact_phone: string | null;
  amenities: string;
  created_at: string;
  updated_at: string;
}

export interface SessionsTable {
  id: string;
  venue_id: string;
  sport_id: string;
  organizer_id: string | null;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  max_slots: number;
  min_participants: number;
  price_per_slot: number;
  service_fee: number;
  skill_level: SkillLevel;
  session_vibe: SessionVibe;
  equipment_provided: number;
  equipment_details: string | null;
  rules_notes: string | null;
  booking_deadline: string;
  cancellation_deadline_hours: number;
  status: SessionStatus;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingsTable {
  id: string;
  session_id: string;
  user_id: string;
  status: BookingStatus;
  price_snapshot: number;
  service_fee_snapshot: number;
  payment_status: PaymentStatus;
  attendance_status: AttendanceStatus;
  booked_at: string;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentsTable {
  id: string;
  booking_id: string;
  provider: PaymentProvider;
  provider_transaction_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  idempotency_key: string;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLogsTable {
  id: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  payload: string;
  created_at: string;
}

export interface NotificationsTable {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: number;
  created_at: string;
}

export interface PartnershipInquiriesTable {
  id: string;
  contact_name: string;
  phone: string;
  venue_name: string;
  district: string;
  sport_types: string;
  message: string | null;
  inquiry_type: 'VENUE' | 'SESSION';
  image_url: string | null;
  scheduled_at: string | null;
  price_per_slot: number | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
}

export interface DatabaseSchema {
  users: UsersTable;
  sports: SportsTable;
  venues: VenuesTable;
  sessions: SessionsTable;
  bookings: BookingsTable;
  payments: PaymentsTable;
  audit_logs: AuditLogsTable;
  notifications: NotificationsTable;
  partnership_inquiries: PartnershipInquiriesTable;
}
