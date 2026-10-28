import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DatabaseService } from '../src/database/database.service';
import { BookingsService } from '../src/bookings/bookings.service';
import { SessionsService } from '../src/sessions/sessions.service';

describe('BookingsService', () => {
  let dbService: DatabaseService;
  let bookingsService: BookingsService;
  let sessionsService: SessionsService;

  beforeEach(async () => {
    process.env.SQLITE_PATH = ':memory:';
    dbService = new DatabaseService();
    await dbService.onModuleInit();
    bookingsService = new BookingsService(dbService);
    sessionsService = new SessionsService(dbService);
  });

  afterEach(async () => {
    await dbService.onModuleDestroy();
  });

  it('should successfully reserve a spot in an available session', async () => {
    const booking = await bookingsService.reserveSpot(
      'usr_demo_3',
      'ses_tt_saturday',
    );
    expect(booking).toBeDefined();
    expect(booking.user_id).toBe('usr_demo_3');
    expect(booking.session_id).toBe('ses_tt_saturday');
    expect(booking.status).toBe('CONFIRMED');
    expect(booking.price_snapshot).toBe(28000);
  });

  it('should prevent the same user from making a duplicate active booking', async () => {
    await expect(
      bookingsService.reserveSpot('usr_demo_1', 'ses_tt_saturday'),
    ).rejects.toThrow('You already have an active reservation for this game');
  });

  it('should strictly enforce max capacity and reject bookings when full', async () => {
    const db = dbService.getDb();
    const now = new Date().toISOString();

    const testSession = await sessionsService.createSession(
      {
        venueId: 'ven_chilonzor_arena',
        sportId: 'sport_tt',
        title: 'Tight Limit Table Tennis',
        scheduledAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        durationMinutes: 60,
        maxSlots: 2,
        minParticipants: 2,
        pricePerSlot: 20000,
        serviceFee: 2000,
        skillLevel: 'BEGINNER',
        sessionVibe: 'FRIENDLY',
        bookingDeadline: new Date(Date.now() + 20 * 3600 * 1000).toISOString(),
        cancellationDeadlineHours: 2,
      },
      'usr_admin_1',
    );

    await bookingsService.reserveSpot('usr_demo_1', testSession.id);
    await bookingsService.reserveSpot('usr_demo_2', testSession.id);

    await expect(
      bookingsService.reserveSpot('usr_demo_3', testSession.id),
    ).rejects.toThrow('Sorry, this session just reached maximum capacity');
  });

  it('should reject booking when session has been cancelled', async () => {
    await sessionsService.cancelSession('ses_tt_morning', 'usr_admin_1');

    await expect(
      bookingsService.reserveSpot('usr_demo_3', 'ses_tt_morning'),
    ).rejects.toThrow('Session is not open for registration');
  });

  it('should reject cancellation if deadline has already passed', async () => {
    const db = dbService.getDb();
    const now = new Date();
    const nearFuture = new Date(now.getTime() + 1 * 3600 * 1000).toISOString();

    const urgentSession = await sessionsService.createSession(
      {
        venueId: 'ven_chilonzor_arena',
        sportId: 'sport_tt',
        title: 'Starting In One Hour',
        scheduledAt: nearFuture,
        durationMinutes: 60,
        maxSlots: 4,
        minParticipants: 2,
        pricePerSlot: 20000,
        serviceFee: 2000,
        skillLevel: 'BEGINNER',
        sessionVibe: 'FRIENDLY',
        bookingDeadline: nearFuture,
        cancellationDeadlineHours: 3,
      },
      'usr_admin_1',
    );

    const booking = await bookingsService.reserveSpot(
      'usr_demo_3',
      urgentSession.id,
    );

    await expect(
      bookingsService.cancelBooking(booking.id, 'usr_demo_3', 'USER'),
    ).rejects.toThrow('Cancellation deadline passed');
  });
});

