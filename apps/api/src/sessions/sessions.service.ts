import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import {
  SessionsTable,
  VenuesTable,
  SportsTable,
  SessionStatus,
} from '../database/database.types';
import {
  CreateSessionDto,
  FilterSessionsDto,
  UpdateSessionDto,
} from './dto/session.dto';

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

@Injectable()
export class SessionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async listSessions(
    filters: FilterSessionsDto,
    userId?: string,
  ): Promise<SessionListItem[]> {
    const db = this.databaseService.getDb();

    let query = db
      .selectFrom('sessions')
      .innerJoin('venues', 'sessions.venue_id', 'venues.id')
      .innerJoin('sports', 'sessions.sport_id', 'sports.id')
      .select([
        'sessions.id as session_id',
        'sessions.title as title',
        'sessions.scheduled_at as scheduled_at',
        'sessions.duration_minutes as duration_minutes',
        'sessions.max_slots as max_slots',
        'sessions.price_per_slot as price_per_slot',
        'sessions.service_fee as service_fee',
        'sessions.skill_level as skill_level',
        'sessions.session_vibe as session_vibe',
        'sessions.status as status',
        'sessions.equipment_provided as equipment_provided',
        'venues.id as venue_id',
        'venues.name as venue_name',
        'venues.district as venue_district',
        'venues.address as venue_address',
        'sports.id as sport_id',
        'sports.name as sport_name',
        'sports.slug as sport_slug',
        'sports.icon as sport_icon',
      ]);

    if (filters.sport) {
      query = query.where((eb) =>
        eb.or([
          eb('sports.slug', '=', filters.sport!),
          eb('sports.id', '=', filters.sport!),
        ]),
      );
    }

    if (filters.district) {
      query = query.where('venues.district', '=', filters.district);
    }

    if (filters.skillLevel && filters.skillLevel !== 'ALL_LEVELS') {
      query = query.where('sessions.skill_level', '=', filters.skillLevel as any);
    }

    if (filters.sessionVibe) {
      query = query.where('sessions.session_vibe', '=', filters.sessionVibe as any);
    }

    const rows = await query.orderBy('sessions.scheduled_at', 'asc').execute();

    const bookings = await db
      .selectFrom('bookings')
      .select(['session_id', 'status'])
      .where('status', 'in', ['CONFIRMED', 'PENDING_PAYMENT'])
      .execute();

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
      items = items.filter((item) => item.remainingSlots > 0 && item.status === 'PUBLISHED');
    }

    return items;
  }

  public async getSessionById(
    sessionId: string,
    currentUserId?: string,
  ): Promise<SessionDetail> {
    const db = this.databaseService.getDb();
    const session = await db
      .selectFrom('sessions')
      .selectAll()
      .where('id', '=', sessionId)
      .executeTakeFirst();

    if (!session) {
      throw new NotFoundException(`Session with id ${sessionId} not found`);
    }

    const venue = await db
      .selectFrom('venues')
      .selectAll()
      .where('id', '=', session.venue_id)
      .executeTakeFirstOrThrow();

    const sport = await db
      .selectFrom('sports')
      .selectAll()
      .where('id', '=', session.sport_id)
      .executeTakeFirstOrThrow();

    const confirmedBookings = await db
      .selectFrom('bookings')
      .innerJoin('users', 'bookings.user_id', 'users.id')
      .select([
        'bookings.id as booking_id',
        'bookings.user_id as user_id',
        'bookings.status as status',
        'bookings.booked_at as booked_at',
        'users.first_name as first_name',
        'users.avatar_url as avatar_url',
        'users.skill_level as skill_level',
      ])
      .where('bookings.session_id', '=', sessionId)
      .where('bookings.status', 'in', ['CONFIRMED', 'PENDING_PAYMENT'])
      .orderBy('bookings.booked_at', 'asc')
      .execute();

    let currentUserBookingStatus: string | null = null;
    let currentUserBookingId: string | null = null;

    if (currentUserId) {
      const userBooking = await db
        .selectFrom('bookings')
        .select(['id', 'status'])
        .where('session_id', '=', sessionId)
        .where('user_id', '=', currentUserId)
        .where('status', 'in', ['CONFIRMED', 'PENDING_PAYMENT'])
        .executeTakeFirst();

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
    const db = this.databaseService.getDb();

    const scheduledDate = new Date(dto.scheduledAt);
    if (isNaN(scheduledDate.getTime()) || scheduledDate.getTime() < Date.now()) {
      throw new BadRequestException('Session cannot be scheduled in the past');
    }

    const venue = await db
      .selectFrom('venues')
      .select('id')
      .where('id', '=', dto.venueId)
      .executeTakeFirst();

    if (!venue) {
      throw new BadRequestException(`Tanlangan sport majmuasi topilmadi. Avval majmua qoʻshing.`);
    }

    const sport = await db
      .selectFrom('sports')
      .select('id')
      .where('id', '=', dto.sportId)
      .executeTakeFirst();

    if (!sport) {
      throw new BadRequestException(`Tanlangan sport turi topilmadi.`);
    }

    const sessionId = randomUUID();
    const now = new Date().toISOString();

    await db
      .insertInto('sessions')
      .values({
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
        created_at: now,
        updated_at: now,
      })
      .execute();

    await db
      .insertInto('audit_logs')
      .values({
        id: randomUUID(),
        actor_id: organizerId,
        action: 'CREATE_SESSION',
        target_type: 'SESSION',
        target_id: sessionId,
        payload: JSON.stringify(dto),
        created_at: now,
      })
      .execute();

    return this.getSessionById(sessionId, organizerId);
  }

  public async updateSession(
    sessionId: string,
    dto: UpdateSessionDto,
    actorId: string,
  ): Promise<SessionDetail> {
    const db = this.databaseService.getDb();
    const existing = await db
      .selectFrom('sessions')
      .selectAll()
      .where('id', '=', sessionId)
      .executeTakeFirst();

    if (!existing) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    const now = new Date().toISOString();

    await db
      .updateTable('sessions')
      .set({
        title: dto.title !== undefined ? dto.title : existing.title,
        scheduled_at: dto.scheduledAt !== undefined ? dto.scheduledAt : existing.scheduled_at,
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
        updated_at: now,
      })
      .where('id', '=', sessionId)
      .execute();

    await db
      .insertInto('audit_logs')
      .values({
        id: randomUUID(),
        actor_id: actorId,
        action: 'UPDATE_SESSION',
        target_type: 'SESSION',
        target_id: sessionId,
        payload: JSON.stringify(dto),
        created_at: now,
      })
      .execute();

    return this.getSessionById(sessionId, actorId);
  }

  public async cancelSession(
    sessionId: string,
    actorId: string,
  ): Promise<{ success: boolean; message: string }> {
    const db = this.databaseService.getDb();
    const existing = await db
      .selectFrom('sessions')
      .selectAll()
      .where('id', '=', sessionId)
      .executeTakeFirst();

    if (!existing) {
      throw new NotFoundException(`Session ${sessionId} not found`);
    }

    const now = new Date().toISOString();

    await db.transaction().execute(async (trx) => {
      await trx
        .updateTable('sessions')
        .set({
          status: 'CANCELLED',
          updated_at: now,
        })
        .where('id', '=', sessionId)
        .execute();

      await trx
        .updateTable('bookings')
        .set({
          status: 'CANCELLED',
          cancelled_at: now,
          updated_at: now,
        })
        .where('session_id', '=', sessionId)
        .where('status', 'in', ['CONFIRMED', 'PENDING_PAYMENT'])
        .execute();

      await trx
        .insertInto('audit_logs')
        .values({
          id: randomUUID(),
          actor_id: actorId,
          action: 'CANCEL_SESSION',
          target_type: 'SESSION',
          target_id: sessionId,
          payload: JSON.stringify({ previousStatus: existing.status }),
          created_at: now,
        })
        .execute();
    });

    return {
      success: true,
      message: 'Session has been cancelled and bookings updated.',
    };
  }
}

