import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import {
  BookingsTable,
  BookingStatus,
  AttendanceStatus,
} from '../database/database.types';

export interface UserBookingItem {
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
  attendanceStatus: AttendanceStatus;
  bookedAt: string;
  cancelledAt: string | null;
  cancellationDeadlineHours: number;
  isEligibleForCancel: boolean;
}

@Injectable()
export class BookingsService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async reserveSpot(
    userId: string,
    sessionId: string,
  ): Promise<BookingsTable> {
    const db = this.databaseService.getDb();

    return db.transaction().execute(async (trx) => {
      const user = await trx
        .selectFrom('users')
        .selectAll()
        .where('id', '=', userId)
        .executeTakeFirst();

      if (!user) {
        throw new NotFoundException(`User ${userId} not found`);
      }

      if (user.status === 'SUSPENDED') {
        throw new ForbiddenException('Your account has been suspended');
      }

      const session = await trx
        .selectFrom('sessions')
        .selectAll()
        .where('id', '=', sessionId)
        .executeTakeFirst();

      if (!session) {
        throw new NotFoundException(`Session ${sessionId} not found`);
      }

      if (session.status !== 'PUBLISHED') {
        throw new BadRequestException('Session is not open for registration');
      }

      const scheduledTime = new Date(session.scheduled_at).getTime();
      if (scheduledTime < Date.now()) {
        throw new BadRequestException('Cannot book a spot in a past session');
      }

      const deadlineTime = new Date(session.booking_deadline).getTime();
      if (Date.now() > deadlineTime) {
        throw new BadRequestException('Booking deadline has passed for this session');
      }

      const existingUserBooking = await trx
        .selectFrom('bookings')
        .selectAll()
        .where('session_id', '=', sessionId)
        .where('user_id', '=', userId)
        .where('status', 'in', ['CONFIRMED', 'PENDING_PAYMENT'])
        .executeTakeFirst();

      if (existingUserBooking) {
        throw new ConflictException(
          'You already have an active reservation for this game',
        );
      }

      const activeBookings = await trx
        .selectFrom('bookings')
        .selectAll()
        .where('session_id', '=', sessionId)
        .where('status', 'in', ['CONFIRMED', 'PENDING_PAYMENT'])
        .execute();

      if (activeBookings.length >= session.max_slots) {
        throw new ConflictException(
          'Sorry, this session just reached maximum capacity',
        );
      }

      const bookingId = randomUUID();
      const now = new Date().toISOString();

      await trx
        .insertInto('bookings')
        .values({
          id: bookingId,
          session_id: sessionId,
          user_id: userId,
          status: 'CONFIRMED',
          price_snapshot: session.price_per_slot,
          service_fee_snapshot: session.service_fee,
          payment_status: 'PAID',
          attendance_status: 'UNCONFIRMED',
          booked_at: now,
          cancelled_at: null,
          created_at: now,
          updated_at: now,
        })
        .execute();

      await trx
        .insertInto('audit_logs')
        .values({
          id: randomUUID(),
          actor_id: userId,
          action: 'RESERVE_SPOT',
          target_type: 'BOOKING',
          target_id: bookingId,
          payload: JSON.stringify({
            sessionId,
            price: session.price_per_slot,
            serviceFee: session.service_fee,
          }),
          created_at: now,
        })
        .execute();

      await trx
        .insertInto('notifications')
        .values({
          id: randomUUID(),
          user_id: userId,
          type: 'BOOKING_CONFIRMED',
          title: 'You are on the team!',
          message: `Your spot for "${session.title}" has been successfully reserved.`,
          is_read: 0,
          created_at: now,
        })
        .execute();

      const created = await trx
        .selectFrom('bookings')
        .selectAll()
        .where('id', '=', bookingId)
        .executeTakeFirstOrThrow();

      return created;
    });
  }

  public async cancelBooking(
    bookingId: string,
    userId: string,
    userRole: string,
  ): Promise<BookingsTable> {
    const db = this.databaseService.getDb();

    return db.transaction().execute(async (trx) => {
      const booking = await trx
        .selectFrom('bookings')
        .selectAll()
        .where('id', '=', bookingId)
        .executeTakeFirst();

      if (!booking) {
        throw new NotFoundException(`Booking with id ${bookingId} not found`);
      }

      if (booking.user_id !== userId && userRole !== 'ADMIN') {
        throw new ForbiddenException(
          'You can only cancel your own reservations',
        );
      }

      if (booking.status === 'CANCELLED') {
        throw new BadRequestException('This booking is already cancelled');
      }

      const session = await trx
        .selectFrom('sessions')
        .selectAll()
        .where('id', '=', booking.session_id)
        .executeTakeFirstOrThrow();

      const scheduledTime = new Date(session.scheduled_at).getTime();
      const cancellationDeadlineMs =
        session.cancellation_deadline_hours * 3600 * 1000;

      if (
        userRole !== 'ADMIN' &&
        Date.now() > scheduledTime - cancellationDeadlineMs
      ) {
        throw new BadRequestException(
          `Cancellation deadline passed. Cancellations must be made at least ${session.cancellation_deadline_hours} hours prior to game start.`,
        );
      }

      const now = new Date().toISOString();

      await trx
        .updateTable('bookings')
        .set({
          status: 'CANCELLED',
          cancelled_at: now,
          updated_at: now,
        })
        .where('id', '=', bookingId)
        .execute();

      await trx
        .insertInto('audit_logs')
        .values({
          id: randomUUID(),
          actor_id: userId,
          action: 'CANCEL_BOOKING',
          target_type: 'BOOKING',
          target_id: bookingId,
          payload: JSON.stringify({
            sessionId: session.id,
            previousStatus: booking.status,
          }),
          created_at: now,
        })
        .execute();

      await trx
        .insertInto('notifications')
        .values({
          id: randomUUID(),
          user_id: booking.user_id,
          type: 'BOOKING_CANCELLED',
          title: 'Booking Cancelled',
          message: `Your reservation for "${session.title}" was cancelled.`,
          is_read: 0,
          created_at: now,
        })
        .execute();

      return trx
        .selectFrom('bookings')
        .selectAll()
        .where('id', '=', bookingId)
        .executeTakeFirstOrThrow();
    });
  }

  public async getUserBookings(userId: string): Promise<UserBookingItem[]> {
    const db = this.databaseService.getDb();

    const rows = await db
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

    const now = Date.now();

    return rows.map((row) => {
      const scheduledTime = new Date(row.scheduled_at).getTime();
      const cancellationDeadlineMs =
        row.cancellation_deadline_hours * 3600 * 1000;
      const isEligibleForCancel =
        row.status === 'CONFIRMED' &&
        now < scheduledTime - cancellationDeadlineMs;

      return {
        id: row.booking_id,
        sessionId: row.session_id,
        sessionTitle: row.session_title,
        sportName: row.sport_name,
        sportIcon: row.sport_icon,
        venueName: row.venue_name,
        venueDistrict: row.venue_district,
        venueAddress: row.venue_address,
        scheduledAt: row.scheduled_at,
        durationMinutes: row.duration_minutes,
        status: row.status,
        priceSnapshot: row.price_snapshot,
        serviceFeeSnapshot: row.service_fee_snapshot,
        totalPrice: row.price_snapshot + row.service_fee_snapshot,
        paymentStatus: row.payment_status,
        attendanceStatus: row.attendance_status,
        bookedAt: row.booked_at,
        cancelledAt: row.cancelled_at,
        cancellationDeadlineHours: row.cancellation_deadline_hours,
        isEligibleForCancel,
      };
    });
  }

  public async updateAttendance(
    bookingId: string,
    attendanceStatus: AttendanceStatus,
    actorId: string,
  ): Promise<BookingsTable> {
    const db = this.databaseService.getDb();
    const existing = await db
      .selectFrom('bookings')
      .selectAll()
      .where('id', '=', bookingId)
      .executeTakeFirst();

    if (!existing) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    const now = new Date().toISOString();

    await db
      .updateTable('bookings')
      .set({
        attendance_status: attendanceStatus,
        updated_at: now,
      })
      .where('id', '=', bookingId)
      .execute();

    await db
      .insertInto('audit_logs')
      .values({
        id: randomUUID(),
        actor_id: actorId,
        action: 'UPDATE_ATTENDANCE',
        target_type: 'BOOKING',
        target_id: bookingId,
        payload: JSON.stringify({ attendanceStatus }),
        created_at: now,
      })
      .execute();

    return db
      .selectFrom('bookings')
      .selectAll()
      .where('id', '=', bookingId)
      .executeTakeFirstOrThrow();
  }
}

