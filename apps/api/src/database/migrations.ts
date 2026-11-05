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
          venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
          sport_id TEXT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
          organizer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
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
          updated_at TEXT NOT NULL
        )
      `.execute(db);

      await sql`
        CREATE TABLE IF NOT EXISTS bookings (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          status TEXT NOT NULL,
          price_snapshot INTEGER NOT NULL,
          service_fee_snapshot INTEGER NOT NULL,
          payment_status TEXT NOT NULL,
          attendance_status TEXT NOT NULL,
          booked_at TEXT NOT NULL,
          cancelled_at TEXT,
          idempotency_key TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `.execute(db);

      await sql`
        CREATE TABLE IF NOT EXISTS payments (
          id TEXT PRIMARY KEY,
          booking_id TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
          provider TEXT NOT NULL,
          provider_transaction_id TEXT,
          amount INTEGER NOT NULL,
          currency TEXT NOT NULL,
          status TEXT NOT NULL,
          idempotency_key TEXT NOT NULL UNIQUE,
          verified_at TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
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
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          is_read INTEGER NOT NULL,
          created_at TEXT NOT NULL
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
    name: '002_booking_idempotency',
    up: async (db: Kysely<any>): Promise<void> => {
      await sql`
        ALTER TABLE bookings ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
      `.execute(db);
      await sql`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_idempotency_key ON bookings(idempotency_key) WHERE idempotency_key IS NOT NULL;
      `.execute(db);
    },
  },
  {
    name: '003_districts_table',
    up: async (db: Kysely<any>): Promise<void> => {
      await sql`
        CREATE TABLE IF NOT EXISTS districts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          lat DOUBLE PRECISION NOT NULL,
          lng DOUBLE PRECISION NOT NULL,
          order_index INTEGER NOT NULL DEFAULT 0,
          active INTEGER NOT NULL DEFAULT 1,
          created_at TEXT NOT NULL
        );
      `.execute(db);

      const now = new Date().toISOString();
      const initialDistricts = [
        { id: 'dist_yunusobod', name: 'Yunusobod', slug: 'yunusobod', lat: 41.3654, lng: 69.2891, order_index: 1 },
        { id: 'dist_mirzo_ulugbek', name: 'Mirzo Ulugʻbek', slug: 'mirzo-ulugbek', lat: 41.3289, lng: 69.3378, order_index: 2 },
        { id: 'dist_chilonzor', name: 'Chilonzor', slug: 'chilonzor', lat: 41.2721, lng: 69.2045, order_index: 3 },
        { id: 'dist_mirobod', name: 'Mirobod', slug: 'mirobod', lat: 41.2918, lng: 69.2736, order_index: 4 },
        { id: 'dist_yakkasaroy', name: 'Yakkasaroy', slug: 'yakkasaroy', lat: 41.2825, lng: 69.2514, order_index: 5 },
        { id: 'dist_shayxontohur', name: 'Shayxontohur', slug: 'shayxontohur', lat: 41.3211, lng: 69.2312, order_index: 6 },
        { id: 'dist_olmazor', name: 'Olmazor', slug: 'olmazor', lat: 41.3533, lng: 69.2241, order_index: 7 },
        { id: 'dist_yashnobod', name: 'Yashnobod', slug: 'yashnobod', lat: 41.2981, lng: 69.3328, order_index: 8 },
        { id: 'dist_uchtepa', name: 'Uchtepa', slug: 'uchtepa', lat: 41.2922, lng: 69.1764, order_index: 9 },
        { id: 'dist_sergeli', name: 'Sergeli', slug: 'sergeli', lat: 41.2225, lng: 69.2217, order_index: 10 },
        { id: 'dist_yangihayot', name: 'Yangihayot', slug: 'yangihayot', lat: 41.1983, lng: 69.2089, order_index: 11 },
        { id: 'dist_bektemir', name: 'Bektemir', slug: 'bektemir', lat: 41.2056, lng: 69.3364, order_index: 12 },
      ];

      for (const d of initialDistricts) {
        await sql`
          INSERT INTO districts (id, name, slug, lat, lng, order_index, active, created_at)
          VALUES (${d.id}, ${d.name}, ${d.slug}, ${d.lat}, ${d.lng}, ${d.order_index}, 1, ${now})
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            lat = EXCLUDED.lat,
            lng = EXCLUDED.lng,
            order_index = EXCLUDED.order_index;
        `.execute(db);
      }
    },
  },
];
