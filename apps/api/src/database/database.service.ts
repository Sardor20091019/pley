import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kysely, PostgresDialect, sql } from 'kysely';
import { DatabaseSchema } from './database.types';
import { Pool } from 'pg';
import { DatabaseSync } from 'node:sqlite';
import { NodeSqliteDialect } from './node-sqlite.dialect';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private dbInstance: Kysely<DatabaseSchema> | null = null;
  private poolInstance: Pool | null = null;
  private sqliteInstance: DatabaseSync | null = null;

  public async onModuleInit(): Promise<void> {
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl && !databaseUrl.startsWith('sqlite:')) {
      this.poolInstance = new Pool({
        connectionString: databaseUrl,
      });
      this.dbInstance = new Kysely<DatabaseSchema>({
        dialect: new PostgresDialect({
          pool: this.poolInstance,
        }),
      });
    } else {
      const dbPath = process.env.SQLITE_PATH || ':memory:';
      this.sqliteInstance = new DatabaseSync(dbPath);
      this.dbInstance = new Kysely<DatabaseSchema>({
        dialect: new NodeSqliteDialect(this.sqliteInstance),
      });
    }

    await this.initSchema();
    await this.seedDemoData();
  }

  public async onModuleDestroy(): Promise<void> {
    if (this.dbInstance) {
      await this.dbInstance.destroy();
      this.dbInstance = null;
    }
    if (this.poolInstance) {
      await this.poolInstance.end();
      this.poolInstance = null;
    }
    this.sqliteInstance = null;
  }

  public getDb(): Kysely<DatabaseSchema> {
    if (!this.dbInstance) {
      throw new Error('Database service is not initialized');
    }
    return this.dbInstance;
  }

  private async initSchema(): Promise<void> {
    const db = this.getDb();

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        google_id TEXT UNIQUE,
        email TEXT UNIQUE,
        telegram_id TEXT UNIQUE,
        telegram_username TEXT,
        first_name TEXT NOT NULL,
        last_name TEXT,
        avatar_url TEXT,
        age_bracket TEXT NOT NULL,
        skill_level TEXT NOT NULL,
        preferred_sports TEXT NOT NULL,
        preferred_neighborhoods TEXT NOT NULL,
        profile_visibility TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `.execute(db);

    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT`.execute(db);
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT`.execute(db);
    } catch {}

    await sql`
      CREATE TABLE IF NOT EXISTS sports (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        min_players_per_slot INTEGER NOT NULL,
        active INTEGER NOT NULL,
        created_at TEXT NOT NULL
      )
    `.execute(db);

    await sql`
      CREATE TABLE IF NOT EXISTS venues (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        district TEXT NOT NULL,
        address TEXT NOT NULL,
        description TEXT NOT NULL,
        supported_sports TEXT NOT NULL,
        hourly_rate INTEGER NOT NULL,
        is_partner INTEGER NOT NULL,
        active INTEGER NOT NULL,
        contact_phone TEXT,
        amenities TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `.execute(db);

    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        venue_id TEXT NOT NULL,
        sport_id TEXT NOT NULL,
        organizer_id TEXT NOT NULL,
        title TEXT NOT NULL,
        scheduled_at TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        max_slots INTEGER NOT NULL,
        min_participants INTEGER NOT NULL,
        price_per_slot INTEGER NOT NULL,
        service_fee INTEGER NOT NULL,
        skill_level TEXT NOT NULL,
        session_vibe TEXT NOT NULL,
        equipment_provided INTEGER NOT NULL,
        equipment_details TEXT,
        rules_notes TEXT,
        booking_deadline TEXT NOT NULL,
        cancellation_deadline_hours INTEGER NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (venue_id) REFERENCES venues(id),
        FOREIGN KEY (sport_id) REFERENCES sports(id),
        FOREIGN KEY (organizer_id) REFERENCES users(id)
      )
    `.execute(db);

    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        status TEXT NOT NULL,
        price_snapshot INTEGER NOT NULL,
        service_fee_snapshot INTEGER NOT NULL,
        payment_status TEXT NOT NULL,
        attendance_status TEXT NOT NULL,
        booked_at TEXT NOT NULL,
        cancelled_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `.execute(db);

    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        booking_id TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_transaction_id TEXT,
        amount INTEGER NOT NULL,
        currency TEXT NOT NULL,
        status TEXT NOT NULL,
        idempotency_key TEXT NOT NULL UNIQUE,
        verified_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
      )
    `.execute(db);

    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        actor_id TEXT NOT NULL,
        action TEXT NOT NULL,
        target_type TEXT NOT NULL,
        target_id TEXT NOT NULL,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `.execute(db);

    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `.execute(db);

    await sql`
      CREATE TABLE IF NOT EXISTS partnership_inquiries (
        id TEXT PRIMARY KEY,
        contact_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        venue_name TEXT NOT NULL,
        district TEXT NOT NULL,
        sport_types TEXT NOT NULL,
        message TEXT,
        created_at TEXT NOT NULL
      )
    `.execute(db);
  }

  public async seedDemoData(): Promise<void> {
    const db = this.getDb();
    const existingSports = await db.selectFrom('sports').select('id').execute();

    if (existingSports.length > 0) {
      return;
    }

    const now = new Date().toISOString();

    await db
      .insertInto('users')
      .values([
        {
          id: 'usr_admin_1',
          google_id: null,
          email: 'admin@pley.uz',
          telegram_id: '9999999',
          telegram_username: 'pley_admin',
          first_name: 'Jasur',
          last_name: 'Admin',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          age_bracket: '25-34',
          skill_level: 'INTERMEDIATE',
          preferred_sports: JSON.stringify(['table-tennis', 'basketball-3x3']),
          preferred_neighborhoods: JSON.stringify(['Yunusobod', 'Chilonzor']),
          profile_visibility: 'PUBLIC',
          role: 'ADMIN',
          status: 'ACTIVE',
          created_at: now,
          updated_at: now,
        },
        {
          id: 'usr_demo_1',
          google_id: null,
          email: 'timur@pley.uz',
          telegram_id: '1001',
          telegram_username: 'timur_uz',
          first_name: 'Timur',
          last_name: 'K.',
          avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
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
          id: 'usr_demo_2',
          google_id: null,
          email: 'madina@pley.uz',
          telegram_id: '1002',
          telegram_username: 'madina_pley',
          first_name: 'Madina',
          last_name: 'A.',
          avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
          age_bracket: '18-24',
          skill_level: 'CASUAL',
          preferred_sports: JSON.stringify(['table-tennis', 'basketball-3x3']),
          preferred_neighborhoods: JSON.stringify(['Yunusobod']),
          profile_visibility: 'PUBLIC',
          role: 'USER',
          status: 'ACTIVE',
          created_at: now,
          updated_at: now,
        },
        {
          id: 'usr_demo_3',
          google_id: null,
          email: 'sardor@pley.uz',
          telegram_id: '1003',
          telegram_username: 'sardor_hoops',
          first_name: 'Sardor',
          last_name: 'R.',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          age_bracket: '25-34',
          skill_level: 'INTERMEDIATE',
          preferred_sports: JSON.stringify(['basketball-3x3']),
          preferred_neighborhoods: JSON.stringify(['Mirzo Ulugʻbek']),
          profile_visibility: 'PUBLIC',
          role: 'USER',
          status: 'ACTIVE',
          created_at: now,
          updated_at: now,
        },
      ])
      .execute();

    await db
      .insertInto('sports')
      .values([
        {
          id: 'sport_tt',
          name: 'Table Tennis',
          slug: 'table-tennis',
          description: 'Fast-paced, high-reflex matches. Perfect for 1v1 duels or friendly round-robin tables.',
          icon: 'table-tennis',
          min_players_per_slot: 1,
          active: 1,
          created_at: now,
        },
        {
          id: 'sport_bball',
          name: '3x3 Basketball',
          slug: 'basketball-3x3',
          description: 'Half-court energetic 3v3 hoops. Pick-up style with fair rotations.',
          icon: 'basketball',
          min_players_per_slot: 1,
          active: 1,
          created_at: now,
        },
        {
          id: 'sport_badmin',
          name: 'Badminton',
          slug: 'badminton',
          description: 'High flying shuttlecocks, great cardio and tons of laughs.',
          icon: 'shuttlecock',
          min_players_per_slot: 1,
          active: 1,
          created_at: now,
        },
        {
          id: 'sport_vball',
          name: 'Volleyball',
          slug: 'volleyball',
          description: 'Social sets, bumps and spikes with welcoming teammates.',
          icon: 'volleyball',
          min_players_per_slot: 1,
          active: 1,
          created_at: now,
        },
      ])
      .execute();

    await db
      .insertInto('venues')
      .values([
        {
          id: 'ven_chilonzor_arena',
          name: 'Chilonzor Sports Club',
          district: 'Chilonzor',
          address: 'Chilonzor 9-mavze, 21-uy (Near Mirzo Ulugʻbek metro)',
          description: 'Indoor air-conditioned hall with 6 pro Donic table tennis tables and parquet basketball floor.',
          supported_sports: JSON.stringify(['table-tennis', 'basketball-3x3']),
          hourly_rate: 180000,
          is_partner: 1,
          active: 1,
          contact_phone: '+998 71 200 11 22',
          amenities: JSON.stringify(['Showers', 'Lockers', 'Water Cooler', 'Free Rackets']),
          created_at: now,
          updated_at: now,
        },
        {
          id: 'ven_yunusobod_hub',
          name: 'Yunusobod PingPong & Hoops',
          district: 'Yunusobod',
          address: 'Amir Temur shoh koʻchasi, 114 (Yunusobod 4-mavze)',
          description: 'Modern sports hub with high ceilings, shock-absorbent flooring, and lounge area.',
          supported_sports: JSON.stringify(['table-tennis', 'basketball-3x3', 'badminton']),
          hourly_rate: 200000,
          is_partner: 1,
          active: 1,
          contact_phone: '+998 71 200 33 44',
          amenities: JSON.stringify(['Air Conditioning', 'Free Parking', 'Equipment Rental', 'Cafe']),
          created_at: now,
          updated_at: now,
        },
        {
          id: 'ven_mirzo_court',
          name: 'Mirzo Ulugʻbek Community Court',
          district: 'Mirzo Ulugʻbek',
          address: 'Buyuk Ipak Yoʻli koʻchasi, 45 (Near Ecopark)',
          description: 'Cozy sports club with top-tier lighting and friendly local community.',
          supported_sports: JSON.stringify(['table-tennis', 'volleyball']),
          hourly_rate: 150000,
          is_partner: 1,
          active: 1,
          contact_phone: '+998 71 200 55 66',
          amenities: JSON.stringify(['Changing Rooms', 'Filtered Water', 'Pro Nets']),
          created_at: now,
          updated_at: now,
        },
      ])
      .execute();

    const futureDate1 = new Date(Date.now() + 24 * 3600 * 1000);
    futureDate1.setHours(17, 0, 0, 0);

    const futureDate2 = new Date(Date.now() + 48 * 3600 * 1000);
    futureDate2.setHours(19, 0, 0, 0);

    const futureDate3 = new Date(Date.now() + 72 * 3600 * 1000);
    futureDate3.setHours(11, 0, 0, 0);

    await db
      .insertInto('sessions')
      .values([
        {
          id: 'ses_tt_saturday',
          venue_id: 'ven_chilonzor_arena',
          sport_id: 'sport_tt',
          organizer_id: 'usr_admin_1',
          title: 'Saturday Table Tennis Social',
          scheduled_at: futureDate1.toISOString(),
          duration_minutes: 90,
          max_slots: 6,
          min_participants: 2,
          price_per_slot: 28000,
          service_fee: 3000,
          skill_level: 'BEGINNER',
          session_vibe: 'FRIENDLY',
          equipment_provided: 1,
          equipment_details: 'Rackets and 3-star balls provided for free. Clean indoor sneakers required.',
          rules_notes: 'Rotating games up to 11 points so everyone gets to play everyone! All levels welcome.',
          booking_deadline: new Date(futureDate1.getTime() - 2 * 3600 * 1000).toISOString(),
          cancellation_deadline_hours: 4,
          status: 'PUBLISHED',
          created_at: now,
          updated_at: now,
        },
        {
          id: 'ses_bball_sunday',
          venue_id: 'ven_yunusobod_hub',
          sport_id: 'sport_bball',
          organizer_id: 'usr_admin_1',
          title: 'Sunday Sunset 3x3 Hoops',
          scheduled_at: futureDate2.toISOString(),
          duration_minutes: 120,
          max_slots: 6,
          min_participants: 6,
          price_per_slot: 35000,
          service_fee: 4000,
          skill_level: 'CASUAL',
          session_vibe: 'SOCIAL',
          equipment_provided: 1,
          equipment_details: 'Size 7 composite basketball and pinnies provided.',
          rules_notes: 'Half-court 3v3 up to 15 points (1s and 2s). Casual pick-up style with team re-draw.',
          booking_deadline: new Date(futureDate2.getTime() - 2 * 3600 * 1000).toISOString(),
          cancellation_deadline_hours: 6,
          status: 'PUBLISHED',
          created_at: now,
          updated_at: now,
        },
        {
          id: 'ses_tt_morning',
          venue_id: 'ven_mirzo_court',
          sport_id: 'sport_tt',
          organizer_id: 'usr_admin_1',
          title: 'Weekday Morning Reflex Rally',
          scheduled_at: futureDate3.toISOString(),
          duration_minutes: 60,
          max_slots: 4,
          min_participants: 2,
          price_per_slot: 22000,
          service_fee: 2500,
          skill_level: 'ALL_LEVELS',
          session_vibe: 'LEARNING',
          equipment_provided: 1,
          equipment_details: 'Tables, balls and loaner paddles available.',
          rules_notes: 'Start your morning with cardio and friendly ping pong rallies.',
          booking_deadline: new Date(futureDate3.getTime() - 2 * 3600 * 1000).toISOString(),
          cancellation_deadline_hours: 2,
          status: 'PUBLISHED',
          created_at: now,
          updated_at: now,
        },
      ])
      .execute();

    await db
      .insertInto('bookings')
      .values([
        {
          id: 'bk_demo_1',
          session_id: 'ses_tt_saturday',
          user_id: 'usr_demo_1',
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
        {
          id: 'bk_demo_2',
          session_id: 'ses_tt_saturday',
          user_id: 'usr_demo_2',
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
      ])
      .execute();
  }
}
