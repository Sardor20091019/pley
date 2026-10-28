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
  email: string | null;
  telegram_id: string | null;
  telegram_username: string | null;
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

