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

    const now = new Date().toISOString();
    await dbService.getDb().insertInto('users').values([
      {
        id: '88eebc99-9c0b-4ef8-bb6d-6bb9bd380d00',
        google_id: 'g_admin_test',
        email: 'admin@test.com',
        first_name: 'Admin',
        last_name: 'Tester',
        avatar_url: null,
        age_bracket: '25-34',
        skill_level: 'INTERMEDIATE',
        preferred_sports: JSON.stringify(['table-tennis']),
        preferred_neighborhoods: JSON.stringify(['Yunusobod']),
        profile_visibility: 'PUBLIC',
        role: 'ADMIN',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now,
      },
      {
        id: '99eebc99-9c0b-4ef8-bb6d-6bb9bd380d11',
        google_id: 'g_user_1',
        email: 'user1@test.com',
        first_name: 'User1',
        last_name: null,
        avatar_url: null,
        age_bracket: '18-24',
        skill_level: 'BEGINNER',
        preferred_sports: JSON.stringify(['table-tennis']),
        preferred_neighborhoods: JSON.stringify(['Chilonzor']),
        profile_visibility: 'PUBLIC',
        role: 'USER',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'aaebbc99-9c0b-4ef8-bb6d-6bb9bd380d22',
        google_id: 'g_user_2',
        email: 'user2@test.com',
        first_name: 'User2',
        last_name: null,
        avatar_url: null,
        age_bracket: '18-24',
        skill_level: 'BEGINNER',
        preferred_sports: JSON.stringify(['table-tennis']),
        preferred_neighborhoods: JSON.stringify(['Yunusobod']),
        profile_visibility: 'PUBLIC',
        role: 'USER',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'bbeebc99-9c0b-4ef8-bb6d-6bb9bd380d33',
        google_id: 'g_user_3',
        email: 'user3@test.com',
        first_name: 'User3',
        last_name: null,
        avatar_url: null,
        age_bracket: '18-24',
        skill_level: 'BEGINNER',
        preferred_sports: JSON.stringify(['table-tennis']),
        preferred_neighborhoods: JSON.stringify(['Yunusobod']),
        profile_visibility: 'PUBLIC',
        role: 'USER',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now,
      },
    ]).execute();
  });

  afterEach(async () => {
    await dbService.onModuleDestroy();
  });

  it('should successfully reserve a spot in an available session', async () => {
    const booking = await bookingsService.reserveSpot(
      'bbeebc99-9c0b-4ef8-bb6d-6bb9bd380d33',
      '17eebc99-9c0b-4ef8-bb6d-6bb9bd380c11',
    );
    expect(booking).toBeDefined();
    expect(booking.user_id).toBe('bbeebc99-9c0b-4ef8-bb6d-6bb9bd380d33');
    expect(booking.session_id).toBe('17eebc99-9c0b-4ef8-bb6d-6bb9bd380c11');
    expect(booking.status).toBe('CONFIRMED');
    expect(booking.price_snapshot).toBe(28000);
  });

  it('should prevent the same user from making a duplicate active booking', async () => {
    await bookingsService.reserveSpot('99eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', '17eebc99-9c0b-4ef8-bb6d-6bb9bd380c11');
    await expect(
      bookingsService.reserveSpot('99eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', '17eebc99-9c0b-4ef8-bb6d-6bb9bd380c11'),
    ).rejects.toThrow('You already have an active reservation for this game');
  });

  it('should strictly enforce max capacity and reject bookings when full', async () => {
    const testSession = await sessionsService.createSession(
      {
        venueId: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
        sportId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
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
      '88eebc99-9c0b-4ef8-bb6d-6bb9bd380d00',
    );

    await bookingsService.reserveSpot('99eebc99-9c0b-4ef8-bb6d-6bb9bd380d11', testSession.id);
    await bookingsService.reserveSpot('aaebbc99-9c0b-4ef8-bb6d-6bb9bd380d22', testSession.id);

    await expect(
      bookingsService.reserveSpot('bbeebc99-9c0b-4ef8-bb6d-6bb9bd380d33', testSession.id),
    ).rejects.toThrow('Sorry, this session just reached maximum capacity');
  });

  it('should reject booking when session has been cancelled', async () => {
    await sessionsService.cancelSession('39eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', '88eebc99-9c0b-4ef8-bb6d-6bb9bd380d00');

    await expect(
      bookingsService.reserveSpot('bbeebc99-9c0b-4ef8-bb6d-6bb9bd380d33', '39eebc99-9c0b-4ef8-bb6d-6bb9bd380c33'),
    ).rejects.toThrow('Session is not open for registration');
  });

  it('should reject cancellation if deadline has already passed', async () => {
    const now = new Date();
    const nearFuture = new Date(now.getTime() + 1 * 3600 * 1000).toISOString();

    const urgentSession = await sessionsService.createSession(
      {
        venueId: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
        sportId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
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
      '88eebc99-9c0b-4ef8-bb6d-6bb9bd380d00',
    );

    const booking = await bookingsService.reserveSpot(
      'bbeebc99-9c0b-4ef8-bb6d-6bb9bd380d33',
      urgentSession.id,
    );

    await expect(
      bookingsService.cancelBooking(booking.id, 'bbeebc99-9c0b-4ef8-bb6d-6bb9bd380d33', 'USER'),
    ).rejects.toThrow('Cancellation deadline passed');
  });
});
