import { Kysely, sql } from 'kysely';

export interface Migration {
  name: string;
  up: (db: Kysely<any>) => Promise<void>;
}

export const migrations: Migration[] = [
  {
    name: '001_initial_schema',
    up: async (db: Kysely<any>): Promise<void> => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          google_id TEXT UNIQUE,
          email TEXT UNIQUE NOT NULL,
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
          organizer_id TEXT,
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
          image_url TEXT,
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
          inquiry_type TEXT NOT NULL DEFAULT 'VENUE',
          image_url TEXT,
          scheduled_at TEXT,
          price_per_slot INTEGER,
          status TEXT NOT NULL DEFAULT 'PENDING',
          created_at TEXT NOT NULL
        )
      `.execute(db);
    },
  },
  {
    name: '002_add_inquiry_and_session_image_columns',
    up: async (db: Kysely<any>): Promise<void> => {
      await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS image_url TEXT`.execute(db);
      await sql`ALTER TABLE partnership_inquiries ADD COLUMN IF NOT EXISTS inquiry_type TEXT DEFAULT 'VENUE'`.execute(db);
      await sql`ALTER TABLE partnership_inquiries ADD COLUMN IF NOT EXISTS image_url TEXT`.execute(db);
      await sql`ALTER TABLE partnership_inquiries ADD COLUMN IF NOT EXISTS scheduled_at TEXT`.execute(db);
      await sql`ALTER TABLE partnership_inquiries ADD COLUMN IF NOT EXISTS price_per_slot INTEGER`.execute(db);
      await sql`ALTER TABLE partnership_inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING'`.execute(db);
    },
  },
  {
    name: '003_drop_session_organizer_not_null',
    up: async (db: Kysely<any>): Promise<void> => {
      try {
        await sql`ALTER TABLE sessions ALTER COLUMN organizer_id DROP NOT NULL`.execute(db);
      } catch {}
    },
  },
];
