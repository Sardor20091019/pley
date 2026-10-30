import { SessionStatus } from '../database/database.types';

export interface ParticipantPreview {
  userId: string;
  firstName: string;
  avatarUrl: string | null;
  skillLevel: string;
  bookedAt: string;
}

export interface SessionListItem {
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
  skillLevel: string;
  sessionVibe: string;
  status: SessionStatus;
  equipmentProvided: boolean;
  imageUrl: string | null;
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

export interface SessionDetail extends SessionListItem {
  minParticipants: number;
  equipmentDetails: string | null;
  rulesNotes: string | null;
  bookingDeadline: string;
  cancellationDeadlineHours: number;
  venueAmenities: string[];
  participants: ParticipantPreview[];
  currentUserBookingStatus: string | null;
  currentUserBookingId: string | null;
}
