import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DatabaseService } from '../src/database/database.service';
import { AuthService } from '../src/auth/auth.service';
import { GoogleAuthService } from '../src/auth/google.service';
import { TurnstileService } from '../src/auth/turnstile.service';
import { AdminService } from '../src/admin/admin.service';
import { PaymentsService } from '../src/payments/payments.service';
import { ClickProvider } from '../src/payments/providers/click.provider';
import { PaymeProvider } from '../src/payments/providers/payme.provider';
import { SimulatedProvider } from '../src/payments/providers/simulated.provider';
import { insertTestFixtures } from './test-fixtures';

describe('Auth, Admin & Payments Suite', () => {
  let dbService: DatabaseService;
  let authService: AuthService;
  let googleAuthService: GoogleAuthService;
  let turnstileService: TurnstileService;
  let adminService: AdminService;
  let paymentsService: PaymentsService;

  beforeEach(async () => {
    process.env.SQLITE_PATH = ':memory:';
    dbService = new DatabaseService();
    await dbService.onModuleInit();
    await insertTestFixtures(dbService.getDb());

    googleAuthService = new GoogleAuthService();
    turnstileService = new TurnstileService();
    authService = new AuthService(dbService, googleAuthService, turnstileService);
    adminService = new AdminService(dbService);
    paymentsService = new PaymentsService(
      dbService,
      new ClickProvider(),
      new PaymeProvider(),
      new SimulatedProvider(),
    );

    const now = new Date().toISOString();
    const db = dbService.getDb();

    await db.insertInto('users').values([
      {
        id: '99eebc99-9c0b-4ef8-bb6d-6bb9bd380d11',
        google_id: 'g_test_1',
        email: 'user1@pley.uz',
        first_name: 'TestUser1',
        last_name: 'Player',
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
        google_id: 'g_test_2',
        email: 'user2@pley.uz',
        first_name: 'TestUser2',
        last_name: 'Player',
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

    await db.insertInto('bookings').values([
      {
        id: 'ddeebc99-9c0b-4ef8-bb6d-6bb9bd380e11',
        session_id: '17eebc99-9c0b-4ef8-bb6d-6bb9bd380c11',
        user_id: '99eebc99-9c0b-4ef8-bb6d-6bb9bd380d11',
        status: 'CONFIRMED',
        price_snapshot: 28000,
        service_fee_snapshot: 3000,
        payment_status: 'PAID',
        attendance_status: 'UNCONFIRMED',
        booked_at: now,
        cancelled_at: null,
        created_at: now,
        updated_at: now,
      },
    ]).execute();
  });

  afterEach(async () => {
    await dbService.onModuleDestroy();
  });

  it('should create new user from Google profile and assign role based on db users table', async () => {
    const res = await authService.findOrCreateGoogleUser({
      sub: 'google_sub_12345',
      email: 'newplayer@gmail.com',
      given_name: 'Rustam',
      family_name: 'Player',
      picture: 'https://lh3.googleusercontent.com/a/test_pic',
    });

    expect(res.token).toBeDefined();
    expect(res.user.first_name).toBe('Rustam');
    expect(res.user.email).toBe('newplayer@gmail.com');
    expect(res.user.google_id).toBe('google_sub_12345');
    expect(res.user.role).toBe('USER');

    const verified = await authService.getUserFromToken(res.token);
    expect(verified).toBeDefined();
    expect(verified?.id).toBe(res.user.id);
    expect(verified?.role).toBe('USER');

    const adminRes = await authService.findOrCreateGoogleUser({
      sub: 'google_admin_99999',
      email: 'admin@pley.uz',
      given_name: 'Jasur',
      family_name: 'Admin',
    });
    expect(adminRes.user.role).toBe('ADMIN');
  });

  it('should generate Google OAuth authorization URL with client_id', () => {
    process.env.GOOGLE_CLIENT_ID = 'test_client_id.apps.googleusercontent.com';
    const url = authService.getGoogleAuthUrl('http://localhost:3000/auth/callback');
    expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    expect(url).toContain('test_client_id.apps.googleusercontent.com');
    expect(url).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback');
  });

  it('should calculate accurate operational metrics in AdminService', async () => {
    const metrics = await adminService.getDashboardMetrics();
    expect(metrics.totalUsers).toBeGreaterThanOrEqual(2);
    expect(metrics.totalVenues).toBe(3);
    expect(metrics.totalSessions).toBe(3);
    expect(metrics.confirmedBookings).toBe(1);
    expect(metrics.grossBookingVolumeUz).toBeGreaterThan(0);
    expect(metrics.platformRevenueUz).toBeGreaterThan(0);
  });

  it('should process simulated payments idempotently', async () => {
    const res1 = await paymentsService.initiatePayment(
      {
        bookingId: 'ddeebc99-9c0b-4ef8-bb6d-6bb9bd380e11',
        provider: 'SIMULATED',
        returnUrl: 'https://pley.uz/my-games',
      },
      '99eebc99-9c0b-4ef8-bb6d-6bb9bd380d11',
    );

    expect(res1.status).toBe('SUCCESS');
    expect(res1.isSimulated).toBe(true);

    const res2 = await paymentsService.initiatePayment(
      {
        bookingId: 'ddeebc99-9c0b-4ef8-bb6d-6bb9bd380e11',
        provider: 'SIMULATED',
        returnUrl: 'https://pley.uz/my-games',
      },
      '99eebc99-9c0b-4ef8-bb6d-6bb9bd380d11',
    );

    expect(res2.status).toBe('SUCCESS');
  });

  it('should reject payment from unauthorized user on another booking', async () => {
    await expect(
      paymentsService.initiatePayment(
        {
          bookingId: 'ddeebc99-9c0b-4ef8-bb6d-6bb9bd380e11',
          provider: 'SIMULATED',
          returnUrl: 'https://pley.uz/my-games',
        },
        'aaebbc99-9c0b-4ef8-bb6d-6bb9bd380d22',
      ),
    ).rejects.toThrow('Cannot pay for another user reservation');
  });
});
