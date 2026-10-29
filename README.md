# PLEY.UZ — Social Sports Platform (Tashkent, Uzbekistan)

> **"No team? No problem. Just show up and play."**

Pley.uz is a modern, social recreational sports platform built for Tashkent, Uzbekistan. It empowers players, students, and active athletes to discover upcoming matches, reserve individual roster spots, meet community players, and divide venue costs without the friction of renting entire courts or assembling full squads.

---

## 1. Visual Identities & Design Philosophy

Pley.uz features a dual-theme design system toggled seamlessly at runtime:

### 🎾 Cartoon Mode (Playful & Tactile)
- **Palette**: Playful Lime (`#D7FF64`), Electric Purple (`#7655F7`), Coral Orange (`#FF795D`), Sky Blue (`#78D8FF`), Warm Cream (`#FFF9EF`), and Ink Black (`#242424`).
- **Tactile Neo-Brutalist Language**: 24px/32px rounded corners, prominent 2.5px solid dark borders, hard-edged offset drop shadows (`4px 4px 0px #242424`), and tactile compress effects on tap/click (`active:translate-x-0.5 active:translate-y-0.5`).
- **Mascot ("Pleyo")**: Custom vector sports mascot with expressive moods (`happy`, `celebrating`, `bouncing`, `curious`).

### 📰 Editorial Mode (Gazette & Heritage)
- **Palette**: Parchment Cream (`#F5F0E8`), Obsidian Ink (`#1A1510`), Burnished Bronze (`#8B7355`), and Muted Sand (`#EDE6D5`).
- **Typography & Layout**: Classical Georgia serif headers, classified dossier tables, delicate hairline borders, and newspaper-inspired editorial layout.

### 🌐 Internationalization & Localized Currency
- **3 Languages**: Uzbek Latin (`uz` — default), Russian (`ru`), and English (`en`).
- **Currency**: Uzbek Som (`UZS`), with clear fee breakdowns (venue fee + platform service fee).

---

## 2. Monorepo Architecture

The repository is structured as a high-performance npm workspace:

```
pleyuz/
├── apps/
│   ├── api/                   # NestJS v10+ Enterprise REST API (/api/v1)
│   │   ├── src/
│   │   │   ├── database/      # PostgreSQL layer with Kysely typed query builder
│   │   │   ├── auth/          # Google OAuth 2.0 verification, JWT tokens & dev bypass
│   │   │   ├── users/         # Profile management, skill levels & achievement badges
│   │   │   ├── sports/        # Table Tennis, 3x3 Basketball, Badminton, Volleyball, Padel
│   │   │   ├── venues/        # Tashkent sport centers (Chilonzor, Yunusobod, etc.)
│   │   │   ├── sessions/      # Game scheduling, filters & participant tracking
│   │   │   ├── bookings/      # ACID transactional spot reservations & capacity locks
│   │   │   ├── payments/      # Click & Payme interfaces + interactive simulation
│   │   │   ├── admin/         # Operational metrics, gross booking volume & audits
│   │   │   ├── notifications/ # In-app notification triggers
│   │   │   ├── partnership/   # Venue inquiry submission & authenticated leads
│   │   │   └── upload/        # UploadThing file upload pipeline (ufsUrl)
│   │   └── test/              # Vitest automated unit & integration test suite
│   │
│   └── web/                   # Angular 19 Standalone Architecture (App Router)
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/      # Services (Auth, Api, Theme, I18n, Analytics, Cookies)
│       │   │   ├── features/  # Views: Home, Discover, SessionDetail, MyGames, Profile, Admin
│       │   │   └── shared/    # Components: Mascot, Turnstile, CookieConsent, Modals
│       │   ├── styles.css     # Tailwind CSS styles & typography tokens
│       │   └── index.html     # Google Analytics 4 & Cookie Consent v2 scripts
│       └── tailwind.config.js # Custom theme colors & shadow presets
│
├── api/                       # Vercel Serverless Function entry points (NestJS bridge)
├── scripts/                   # Build synchronization & deployment helpers
├── .env.example               # Safe environment variable template
├── vercel.json                # Vercel routing & serverless build specification
├── package.json               # Monorepo scripts & dependencies
└── README.md                  # Project documentation
```

---

## 3. Key Platform Capabilities

1. **Interactive Match Discovery (`/discover`)**:
   - Filter by sport category, Tashkent district (Yunusobod, Chilonzor, Mirzo Ulugʻbek), skill bracket (Beginner, Casual, Intermediate, Advanced), and vacant spot availability.
   - Live spot capacity meter preventing overbooking.

2. **Session Detail & Spot Reservation (`/sessions/:id`)**:
   - Court dossier with equipment perks (showers, parking, equipment provided).
   - Real-time participant roster and transparent price breakdown.
   - Protected cancellation policies (100% refund > 3 hours prior; non-refundable within 3 hours).

3. **Secure Authentication & Bot Mitigation**:
   - Official Google OAuth 2.0 sign-in flow.
   - Cloudflare Turnstile invisible/managed challenge protection.
   - Protected partnership submissions requiring authenticated identities.

4. **Privacy & Analytics Compliance**:
   - Google Analytics 4 (`G-DN4DZEFLB8`) integration.
   - Google Consent Mode v2 with interactive Cookie Consent banner and granular category preference management.

5. **Athlete Dossier & My Games (`/profile`, `/my-games`)**:
   - Track active tickets, past games, and cancellations.
   - Profile avatar updates powered by UploadThing.
   - Gamification achievement badges based on court activity.

6. **Admin Operations Center (`/admin`)**:
   - Role-based access control (`admin` role required).
   - Financial analytics: Gross booking volume, platform service revenue, fill rates, and live audit registries.

---

## 4. Local Development Quickstart

### Prerequisites
- Node.js v20+ (tested on Node v26)
- npm v10+

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/pleyuz.git
cd pleyuz

# Install dependencies across all monorepo packages
npm install
```

### Environment Configuration
```bash
cp .env.example .env
```
*(By default, if `DATABASE_URL` is omitted, the API automatically runs on a local SQLite in-memory dialect pre-populated with Tashkent venues and matches for instant zero-config testing!)*

### Starting the Servers

Run both services in separate terminal windows:

```bash
# 1. Backend API (runs at http://localhost:4000/api/v1)
npm run dev:api

# 2. Frontend Application (runs at http://localhost:3000)
npm run dev:web
```

---

## 5. Verification & Testing

```bash
# Run unit & integration test suites (Vitest)
npm test

# Run strict TypeScript type checks across both apps
npm run lint

# Compile production bundles for API & Web
npm run build
```

---

## 6. Deployment (Vercel Monorepo)

The application is structured to deploy directly on **Vercel** with full backend and frontend functionality:

- **Frontend**: Pre-compiled Angular SPA mirrored to `./browser` via `scripts/sync-build-output.js`.
- **Backend**: Express/NestJS Serverless Function adapter located at `api/index.js` routing all `/api/v1/*` requests.
- **Root Directory**: Set to `./` (Monorepo root) in Vercel project settings.

