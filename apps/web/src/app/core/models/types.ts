export type SkillLevel =
  | 'ALL_LEVELS'
  | 'BEGINNER'
  | 'CASUAL'
  | 'INTERMEDIATE'
  | 'ADVANCED';

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

export interface UserProfile {
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
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface SessionItem {
  id: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  maxSlots: number;
  bookedSlots: number;
  remainingSlots: number;
  pricePerSlot: number;
  serviceFee: number;
  totalPrice: number;
  skillLevel: SkillLevel;
  sessionVibe: SessionVibe;
  status: SessionStatus;
  equipmentProvided: boolean;
  imageUrl?: string | null;
  venue: {
    id: string;
    name: string;
    district: string;
    address: string;
  };
  sport: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
}

export interface Participant {
  userId: string;
  firstName: string;
  avatarUrl: string | null;
  skillLevel: string;
  bookedAt: string;
}

export interface SessionDetail extends SessionItem {
  minParticipants: number;
  equipmentDetails: string | null;
  rulesNotes: string | null;
  bookingDeadline: string;
  cancellationDeadlineHours: number;
  venueAmenities: string[];
  participants: Participant[];
  currentUserBookingStatus: string | null;
  currentUserBookingId: string | null;
}

export interface UserBooking {
  id: string;
  sessionId: string;
  sessionTitle: string;
  sportName: string;
  sportIcon: string;
  venueName: string;
  venueDistrict: string;
  venueAddress: string;
  scheduledAt: string;
  durationMinutes: number;
  status: BookingStatus;
  priceSnapshot: number;
  serviceFeeSnapshot: number;
  totalPrice: number;
  paymentStatus: string;
  attendanceStatus: string;
  bookedAt: string;
  cancelledAt: string | null;
  cancellationDeadlineHours: number;
  isEligibleForCancel: boolean;
}

export interface AdminMetrics {
  totalUsers: number;
  totalVenues: number;
  totalSessions: number;
  upcomingSessions: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  grossBookingVolumeUz: number;
  platformRevenueUz: number;
  averageFillRatePercentage: number;
}

export interface Achievement {
  id: string;
  badge: string;
  title: string;
  description: string;
  isUnlocked: boolean;
}

export interface PartnerFormData {
  contactName: string;
  phone: string;
  venueName: string;
  district: string;
  sportTypes: string;
  inquiryType: 'VENUE' | 'SESSION';
  imageUrl: string;
  scheduledAt: string;
  pricePerSlot: number;
  message: string;
}

export interface PartnershipInquiry {
  id: string;
  contact_name: string;
  phone: string;
  venue_name: string;
  district: string;
  sport_types: string;
  message: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  inquiry_type: 'VENUE' | 'SESSION';
  image_url: string | null;
  scheduled_at: string | null;
  price_per_slot: number | null;
  created_at: string;
  updated_at: string;
}

export interface VenueItem {
  id: string;
  name: string;
  district: string;
  address: string;
  description?: string;
  supportedSports?: string[];
  hourlyRate?: number;
  contactPhone?: string | null;
  amenities?: string[];
  isPartner?: boolean;
}

export interface SportItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface AdminBookingItem {
  booking_id: string;
  user_name: string;
  user_email: string | null;
  session_title: string;
  venue_name: string;
  price: number;
  service_fee: number;
  status: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  target_type: string;
  target_id: string;
  created_at: string;
}

export interface AdminSessionFormData {
  venueId: string;
  sportId: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  maxSlots: number;
  minParticipants: number;
  pricePerSlot: number;
  serviceFee: number;
  skillLevel: SkillLevel;
  sessionVibe: SessionVibe;
  equipmentProvided: boolean;
  equipmentDetails: string;
  rulesNotes: string;
  bookingDeadline: string;
  cancellationDeadlineHours: number;
  imageUrl: string;
}

export interface AdminVenueFormData {
  name: string;
  district: string;
  address: string;
  description: string;
  supportedSports: string[];
  hourlyRate: number;
  contactPhone: string;
  amenities: string;
}

