import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import {
  AuditLogsTable,
  SessionsTable,
  SportsTable,
  VenuesTable,
} from '../database/database.types';

export interface SessionJoinedRow {
  session_id: string;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  max_slots: number;
  price_per_slot: number;
  service_fee: number;
  skill_level: string;
  session_vibe: string;
  status: SessionsTable['status'];
  equipment_provided: number;
  image_url: string | null;
  venue_id: string;
  venue_name: string;
  venue_district: string;
  venue_address: string;
  sport_id: string;
  sport_name: string;
  sport_slug: string;
  sport_icon: string;
}

export interface SessionParticipantRow {
  booking_id: string;
  user_id: string;
  status: string;
  booked_at: string;
  first_name: string;
  avatar_url: string | null;
  skill_level: string;
}

export interface UserBookingStatusRow {
  id: string;
  status: string;
}

@Injectable()
export class SessionsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findFilteredSessions(filters: {
    sport?: string;
    district?: string;
    skillLevel?: string;
    sessionVibe?: string;
  }): Promise<SessionJoinedRow[]> {
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
        'sessions.image_url as image_url',
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

    return query.orderBy('sessions.scheduled_at', 'asc').execute();
  }

  public async findActiveBookings(): Promise<{ session_id: string; status: string }[]> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('bookings')
      .select(['session_id', 'status'])
      .where('status', 'in', ['CONFIRMED', 'PENDING_PAYMENT'])
      .execute();
  }

  public async findSessionById(sessionId: string): Promise<SessionsTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('sessions')
      .selectAll()
      .where('id', '=', sessionId)
      .executeTakeFirst();
  }

  public async findVenueById(venueId: string): Promise<VenuesTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('venues')
      .selectAll()
      .where('id', '=', venueId)
      .executeTakeFirst();
  }

  public async findSportById(sportId: string): Promise<SportsTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('sports')
      .selectAll()
      .where('id', '=', sportId)
      .executeTakeFirst();
  }

  public async findSessionParticipants(
    sessionId: string,
  ): Promise<SessionParticipantRow[]> {
    const db = this.databaseService.getDb();
    return db
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
  }

  public async findUserBookingForSession(
    sessionId: string,
    userId: string,
  ): Promise<UserBookingStatusRow | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('bookings')
      .select(['id', 'status'])
      .where('session_id', '=', sessionId)
      .where('user_id', '=', userId)
      .where('status', 'in', ['CONFIRMED', 'PENDING_PAYMENT'])
      .executeTakeFirst();
  }

  public async createSession(session: SessionsTable): Promise<void> {
    const db = this.databaseService.getDb();
    await db.insertInto('sessions').values(session).execute();
  }

  public async updateSession(
    sessionId: string,
    values: Partial<SessionsTable>,
  ): Promise<void> {
    const db = this.databaseService.getDb();
    await db.updateTable('sessions').set(values).where('id', '=', sessionId).execute();
  }

  public async cancelSessionWithBookings(
    sessionId: string,
    actorId: string,
    previousStatus: string,
    now: string,
  ): Promise<void> {
    const db = this.databaseService.getDb();
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
          payload: JSON.stringify({ previousStatus }),
          created_at: now,
        })
        .execute();
    });
  }

  public async recordAuditLog(log: AuditLogsTable): Promise<void> {
    const db = this.databaseService.getDb();
    await db.insertInto('audit_logs').values(log).execute();
  }
}

