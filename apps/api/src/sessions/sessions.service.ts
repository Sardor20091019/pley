import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SessionStatus } from '../database/database.types';
import {
  CreateSessionDto,
  FilterSessionsDto,
  UpdateSessionDto,
} from './dto/session.dto';
import { ParticipantPreview, SessionDetail, SessionListItem } from './session.types';
import { SessionsRepository } from './sessions.repository';

export { ParticipantPreview, SessionDetail, SessionListItem };

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  public async listSessions(
    filters: FilterSessionsDto,
    userId?: string,
  ): Promise<SessionListItem[]> {
    const rows = await this.sessionsRepository.findFilteredSessions({
      sport: filters.sport,
      district: filters.district,
      skillLevel: filters.skillLevel,
      sessionVibe: filters.sessionVibe,
    });

    const bookings = await this.sessionsRepository.findActiveBookings();

    const countMap = new Map<string, number>();
    for (const b of bookings) {
      countMap.set(b.session_id, (countMap.get(b.session_id) || 0) + 1);
    }

    let items: SessionListItem[] = rows.map((row) => {
      const bookedCount = countMap.get(row.session_id) || 0;
      const remaining = Math.max(0, row.max_slots - bookedCount);
      return {
        id: row.session_id,
        title: row.title,
        scheduledAt: row.scheduled_at,
        durationMinutes: row.duration_minutes,
        maxSlots: row.max_slots,
        bookedSlots: bookedCount,
        remainingSlots: remaining,
        pricePerSlot: row.price_per_slot,
        serviceFee: row.service_fee,
        totalPrice: row.price_per_slot + row.service_fee,
        skillLevel: row.skill_level,
        sessionVibe: row.session_vibe,
        status: row.status,
        equipmentProvided: row.equipment_provided === 1,
        imageUrl: row.image_url || null,
        venue: {
          id: row.venue_id,
          name: row.venue_name,
          district: row.venue_district,
          address: row.venue_address,
        },
        sport: {
          id: row.sport_id,
          name: row.sport_name,
          slug: row.sport_slug,
          icon: row.sport_icon,
        },
      };
    });

    if (filters.search) {
      const lower = filters.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(lower) ||
          item.venue.name.toLowerCase().includes(lower) ||
          item.venue.district.toLowerCase().includes(lower) ||
          item.sport.name.toLowerCase().includes(lower),
      );
    }

    if (filters.onlyAvailable) {
      items = items.filter(
        (item) => item.remainingSlots > 0 && item.status === 'PUBLISHED',
      );
    }

    return items;
  }

  public async getSessionById(
    sessionId: string,
    currentUserId?: string,
  ): Promise<SessionDetail> {
    const session = await this.sessionsRepository.findSessionById(sessionId);

    if (!session) {
      throw new NotFoundException(`Session with id ${sessionId} not found`);
    }

    const venue = await this.sessionsRepository.findVenueById(session.venue_id);
    if (!venue) {
      throw new NotFoundException(`Venue for session ${sessionId} not found`);
    }

    const sport = await this.sessionsRepository.findSportById(session.sport_id);
    if (!sport) {
      throw new NotFoundException(`Sport for session ${sessionId} not found`);
    }

    const confirmedBookings =
      await this.sessionsRepository.findSessionParticipants(sessionId);

    let currentUserBookingStatus: string | null = null;
    let currentUserBookingId: string | null = null;

    if (currentUserId) {
      const userBooking =
        await this.sessionsRepository.findUserBookingForSession(sessionId, currentUserId);

      if (userBooking) {
        currentUserBookingStatus = userBooking.status;
        currentUserBookingId = userBooking.id;
      }
    }

    let parsedAmenities: string[] = [];
    try {
      parsedAmenities = JSON.parse(venue.amenities);
    } catch {
      parsedAmenities = [];
    }

    const bookedCount = confirmedBookings.length;
    const remainingSlots = Math.max(0, session.max_slots - bookedCount);

    const participants: ParticipantPreview[] = confirmedBookings.map((b) => ({
      userId: b.user_id,
      firstName: b.first_name,
      avatarUrl: b.avatar_url,
      skillLevel: b.skill_level,
      bookedAt: b.booked_at,
    }));

    return {
      id: session.id,
      title: session.title,
      scheduledAt: session.scheduled_at,
      durationMinutes: session.duration_minutes,
      maxSlots: session.max_slots,
      minParticipants: session.min_participants,
      bookedSlots: bookedCount,
      remainingSlots,
      pricePerSlot: session.price_per_slot,
      serviceFee: session.service_fee,
      totalPrice: session.price_per_slot + session.service_fee,
      skillLevel: session.skill_level,
      sessionVibe: session.session_vibe,
      status: session.status,
      equipmentProvided: session.equipment_provided === 1,
      imageUrl: session.image_url || null,
      equipmentDetails: session.equipment_details,
      rulesNotes: session.rules_notes,
      bookingDeadline: session.booking_deadline,
      cancellationDeadlineHours: session.cancellation_deadline_hours,
      venue: {
        id: venue.id,
        name: venue.name,
        district: venue.district,
        address: venue.address,
      },
      sport: {
        id: sport.id,
        name: sport.name,
        slug: sport.slug,
        icon: sport.icon,
      },
      venueAmenities: parsedAmenities,
      participants,
      currentUserBookingStatus,
      currentUserBookingId,
    };
  }

  public async createSession(
    dto: CreateSessionDto,
    organizerId: string,
  ): Promise<SessionDetail> {
    const scheduledDate = new Date(dto.scheduledAt);
    if (isNaN(scheduledDate.getTime()) || scheduledDate.getTime() < Date.now()) {
      throw new BadRequestException('Session cannot be scheduled in the past');
    }

    const venue = await this.sessionsRepository.findVenueById(dto.venueId);
    if (!venue) {
      throw new BadRequestException(
        `Tanlangan sport majmuasi topilmadi. Avval majmua qoʻshing.`,
      );
    }

    const sport = await this.sessionsRepository.findSportById(dto.sportId);
    if (!sport) {
      throw new BadRequestException(`Tanlangan sport turi topilmadi.`);
    }

    const sessionId = randomUUID();
    const now = new Date().toISOString();

    await this.sessionsRepository.createSession({
      id: sessionId,
      venue_id: dto.venueId,
      sport_id: dto.sportId,
      organizer_id: organizerId,
      title: dto.title,
      scheduled_at: dto.scheduledAt,
      duration_minutes: dto.durationMinutes,
      max_slots: dto.maxSlots,
      min_participants: dto.minParticipants,
      price_per_slot: dto.pricePerSlot,
      service_fee: dto.serviceFee,
      skill_level: dto.skillLevel,
      session_vibe: dto.sessionVibe,
      equipment_provided: dto.equipmentProvided ? 1 : 0,
      equipment_details: dto.equipmentDetails || null,
      rules_notes: dto.rulesNotes || null,
      booking_deadline: dto.bookingDeadline,
      cancellation_deadline_hours: dto.cancellationDeadlineHours,
      status: dto.status || 'PUBLISHED',
      image_url: dto.imageUrl || null,
      created_at: now,
      updated_at: now,
    });

    await this.sessionsRepository.recordAuditLog({
      id: randomUUID(),
      actor_id: organizerId,
      action: 'CREATE_SESSION',
      target_type: 'SESSION',
      target_id: sessionId,
      payload: JSON.stringify(dto),
      created_at: now,
    });

    return this.getSessionById(sessionId, organizerId);
  }

  public async updateSession(
    sessionId: string,
    dto: UpdateSessionDto,
    actorId: string,
  ): Promise<SessionDetail> {
    const existing = await this.sessionsRepository.findSessionById(sessionId);

    if (!existing) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    const now = new Date().toISOString();

    await this.sessionsRepository.updateSession(sessionId, {
      title: dto.title !== undefined ? dto.title : existing.title,
      scheduled_at:
        dto.scheduledAt !== undefined ? dto.scheduledAt : existing.scheduled_at,
      duration_minutes:
        dto.durationMinutes !== undefined
          ? dto.durationMinutes
          : existing.duration_minutes,
      max_slots: dto.maxSlots !== undefined ? dto.maxSlots : existing.max_slots,
      price_per_slot:
        dto.pricePerSlot !== undefined ? dto.pricePerSlot : existing.price_per_slot,
      service_fee:
        dto.serviceFee !== undefined ? dto.serviceFee : existing.service_fee,
      skill_level:
        dto.skillLevel !== undefined ? dto.skillLevel : existing.skill_level,
      session_vibe:
        dto.sessionVibe !== undefined ? dto.sessionVibe : existing.session_vibe,
      equipment_details:
        dto.equipmentDetails !== undefined
          ? dto.equipmentDetails
          : existing.equipment_details,
      rules_notes:
        dto.rulesNotes !== undefined ? dto.rulesNotes : existing.rules_notes,
      status: dto.status !== undefined ? dto.status : existing.status,
      image_url: dto.imageUrl !== undefined ? dto.imageUrl : existing.image_url,
      updated_at: now,
    });

    await this.sessionsRepository.recordAuditLog({
      id: randomUUID(),
      actor_id: actorId,
      action: 'UPDATE_SESSION',
      target_type: 'SESSION',
      target_id: sessionId,
      payload: JSON.stringify(dto),
      created_at: now,
    });

    return this.getSessionById(sessionId, actorId);
  }

  public async cancelSession(
    sessionId: string,
    actorId: string,
  ): Promise<{ success: boolean; message: string }> {
    const existing = await this.sessionsRepository.findSessionById(sessionId);

    if (!existing) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    const now = new Date().toISOString();
    await this.sessionsRepository.cancelSessionWithBookings(
      sessionId,
      actorId,
      existing.status,
      now,
    );

    return {
      success: true,
      message: 'Session has been cancelled and bookings updated.',
    };
  }
}
