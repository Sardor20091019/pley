import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  AttendanceStatus,
  AuditLogsTable,
  BookingsTable,
  BookingStatus,
  NotificationsTable,
  SessionsTable,
  UsersTable,
} from '../database/database.types';

export interface UserBookingDetailsRow {
  booking_id: string;
  session_id: string;
  status: BookingStatus;
  price_snapshot: number;
  service_fee_snapshot: number;
  payment_status: string;
  attendance_status: AttendanceStatus;
  booked_at: string;
  cancelled_at: string | null;
  session_title: string;
  scheduled_at: string;
  duration_minutes: number;
  cancellation_deadline_hours: number;
  venue_name: string;
  venue_district: string;
  venue_address: string;
  sport_name: string;
  sport_icon: string;
}

@Injectable()
export class BookingsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findUserById(userId: string): Promise<UsersTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', userId)
      .executeTakeFirst();
  }

  public async findSessionById(sessionId: string): Promise<SessionsTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('sessions')
      .selectAll()
      .where('id', '=', sessionId)
      .executeTakeFirst();
  }

  public async findActiveUserBooking(
    sessionId: string,
    userId: string,
  ): Promise<BookingsTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('bookings')
      .selectAll()
      .where('session_id', '=', sessionId)
      .where('user_id', '=', userId)
      .where('status', 'in', ['CONFIRMED', 'PENDING_PAYMENT'])
      .executeTakeFirst();
  }

  public async countActiveBookingsForSession(sessionId: string): Promise<number> {
    const db = this.databaseService.getDb();
    const active = await db
      .selectFrom('bookings')
      .select('id')
      .where('session_id', '=', sessionId)
      .where('status', 'in', ['CONFIRMED', 'PENDING_PAYMENT'])
      .execute();

    return active.length;
  }

  public async createBookingWithSideEffects(
    booking: BookingsTable,
    auditLog: AuditLogsTable,
    notification: NotificationsTable,
  ): Promise<BookingsTable> {
    const db = this.databaseService.getDb();
    return db.transaction().execute(async (trx) => {
      await trx.insertInto('bookings').values(booking).execute();
      await trx.insertInto('audit_logs').values(auditLog).execute();
      await trx.insertInto('notifications').values(notification).execute();

      return trx
        .selectFrom('bookings')
        .selectAll()
        .where('id', '=', booking.id)
        .executeTakeFirstOrThrow();
    });
  }

  public async findBookingById(bookingId: string): Promise<BookingsTable | undefined> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('bookings')
      .selectAll()
      .where('id', '=', bookingId)
      .executeTakeFirst();
  }

  public async cancelBookingWithSideEffects(
    bookingId: string,
    auditLog: AuditLogsTable,
    notification: NotificationsTable,
    now: string,
  ): Promise<BookingsTable> {
    const db = this.databaseService.getDb();
    return db.transaction().execute(async (trx) => {
      await trx
        .updateTable('bookings')
        .set({
          status: 'CANCELLED',
          cancelled_at: now,
          updated_at: now,
        })
        .where('id', '=', bookingId)
        .execute();

      await trx.insertInto('audit_logs').values(auditLog).execute();
      await trx.insertInto('notifications').values(notification).execute();

      return trx
        .selectFrom('bookings')
        .selectAll()
        .where('id', '=', bookingId)
        .executeTakeFirstOrThrow();
    });
  }

  public async findUserBookingsWithDetails(
    userId: string,
  ): Promise<UserBookingDetailsRow[]> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('bookings')
      .innerJoin('sessions', 'bookings.session_id', 'sessions.id')
      .innerJoin('venues', 'sessions.venue_id', 'venues.id')
      .innerJoin('sports', 'sessions.sport_id', 'sports.id')
      .select([
        'bookings.id as booking_id',
        'bookings.session_id as session_id',
        'bookings.status as status',
        'bookings.price_snapshot as price_snapshot',
        'bookings.service_fee_snapshot as service_fee_snapshot',
        'bookings.payment_status as payment_status',
        'bookings.attendance_status as attendance_status',
        'bookings.booked_at as booked_at',
        'bookings.cancelled_at as cancelled_at',
        'sessions.title as session_title',
        'sessions.scheduled_at as scheduled_at',
        'sessions.duration_minutes as duration_minutes',
        'sessions.cancellation_deadline_hours as cancellation_deadline_hours',
        'venues.name as venue_name',
        'venues.district as venue_district',
        'venues.address as venue_address',
        'sports.name as sport_name',
        'sports.icon as sport_icon',
      ])
      .where('bookings.user_id', '=', userId)
      .orderBy('bookings.booked_at', 'desc')
      .execute();
  }

  public async updateAttendanceWithAudit(
    bookingId: string,
    attendanceStatus: AttendanceStatus,
    auditLog: AuditLogsTable,
    now: string,
  ): Promise<BookingsTable> {
    const db = this.databaseService.getDb();
    return db.transaction().execute(async (trx) => {
      await trx
        .updateTable('bookings')
        .set({
          attendance_status: attendanceStatus,
          updated_at: now,
        })
        .where('id', '=', bookingId)
        .execute();

      await trx.insertInto('audit_logs').values(auditLog).execute();

      return trx
        .selectFrom('bookings')
        .selectAll()
        .where('id', '=', bookingId)
        .executeTakeFirstOrThrow();
    });
  }
}
