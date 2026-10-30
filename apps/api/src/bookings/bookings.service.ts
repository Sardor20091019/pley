import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  AttendanceStatus,
  BookingsTable,
  BookingStatus,
} from '../database/database.types';
import { BookingsRepository } from './bookings.repository';

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
  constructor(private readonly bookingsRepository: BookingsRepository) {}

  public async reserveSpot(
    userId: string,
    sessionId: string,
  ): Promise<BookingsTable> {
    const user = await this.bookingsRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    if (user.status === 'SUSPENDED') {
      throw new ForbiddenException('Your account has been suspended');
    }

    const session = await this.bookingsRepository.findSessionById(sessionId);

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

    const existingUserBooking =
      await this.bookingsRepository.findActiveUserBooking(sessionId, userId);

    if (existingUserBooking) {
      throw new ConflictException(
        'You already have an active reservation for this game',
      );
    }

    const activeCount =
      await this.bookingsRepository.countActiveBookingsForSession(sessionId);

    if (activeCount >= session.max_slots) {
      throw new ConflictException(
        'Sorry, this session just reached maximum capacity',
      );
    }

    const bookingId = randomUUID();
    const now = new Date().toISOString();

    return this.bookingsRepository.createBookingWithSideEffects(
      {
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
      },
      {
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
      },
      {
        id: randomUUID(),
        user_id: userId,
        type: 'BOOKING_CONFIRMED',
        title: 'You are on the team!',
        message: `Your spot for "${session.title}" has been successfully reserved.`,
        is_read: 0,
        created_at: now,
      },
    );
  }

  public async cancelBooking(
    bookingId: string,
    userId: string,
    userRole: string,
  ): Promise<BookingsTable> {
    const booking = await this.bookingsRepository.findBookingById(bookingId);

    if (!booking) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    if (booking.user_id !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You can only cancel your own reservations');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('This booking is already cancelled');
    }

    const session = await this.bookingsRepository.findSessionById(
      booking.session_id,
    );

    if (!session) {
      throw new NotFoundException(`Session ${booking.session_id} not found`);
    }

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

    return this.bookingsRepository.cancelBookingWithSideEffects(
      bookingId,
      {
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
      },
      {
        id: randomUUID(),
        user_id: booking.user_id,
        type: 'BOOKING_CANCELLED',
        title: 'Booking Cancelled',
        message: `Your reservation for "${session.title}" was cancelled.`,
        is_read: 0,
        created_at: now,
      },
      now,
    );
  }

  public async getUserBookings(userId: string): Promise<UserBookingItem[]> {
    const rows =
      await this.bookingsRepository.findUserBookingsWithDetails(userId);
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
    const existing = await this.bookingsRepository.findBookingById(bookingId);

    if (!existing) {
      throw new NotFoundException(`Booking with id ${bookingId} not found`);
    }

    const now = new Date().toISOString();

    return this.bookingsRepository.updateAttendanceWithAudit(
      bookingId,
      attendanceStatus,
      {
        id: randomUUID(),
        actor_id: actorId,
        action: 'UPDATE_ATTENDANCE',
        target_type: 'BOOKING',
        target_id: bookingId,
        payload: JSON.stringify({ attendanceStatus }),
        created_at: now,
      },
      now,
    );
  }
}
