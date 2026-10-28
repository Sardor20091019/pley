# PLEY.UZ — Social Sports Platform (Tashkent, Uzbekistan)

> **"No team? No problem. Just show up and play."**

Pley.uz is a mobile-first social sports platform for Tashkent, Uzbekistan that enables recreational athletes and students to discover upcoming sports sessions, grab an individual spot, meet fellow players, and share the cost of playing without needing to book an entire venue or organize a whole team.

---

## 1. Brand Identity & Visual Design

Pley is designed as a **playful, energetic cartoon sports playground**:
- **Palette**: Playful Lime (`#D7FF64`), Electric Purple (`#7655F7`), Coral Orange (`#FF795D`), Sky Blue (`#78D8FF`), Warm Cream (`#FFF9EF`), and Ink Black (`#242424`).
- **Tactile Components**: Rounded cards (24px radius), thick 2.5px dark outlines, hard-edged offset drop shadows (`4px 4px 0px #242424`), and tactile compress effects on tap.
- **Original Mascot ("Pleyo")**: An energetic illustrated cartoon sports character with expressive moods (happy, celebrating, bouncing, curious).
- **Original Vector Illustrations**: Handcrafted SVG illustrations for the hero court, table tennis duels, basketball hoops, celebratory trophy, and curious empty states.
- **Languages (i18n)**: Uzbek Latin (`uz` — primary default), Russian (`ru`), and English (`en`).
- **Currency**: Uzbek Som (`UZS`), with clear price breakdowns (court fee + service fee).

---

## 2. Monorepo Architecture

The workspace is organized as an npm monorepo adhering strictly to architectural separation of concerns:

```
pleyuz/
├── apps/
│   ├── api/                   # NestJS v10+ REST API (/api/v1)
│   │   ├── src/
│   │   │   ├── database/      # PostgreSQL + Kysely query builder
│   │   │   ├── auth/          # Telegram WebApp signature verification & dev login
│   │   │   ├── users/         # Profile management & gamification achievements
│   │   │   ├── sports/        # Table Tennis, 3x3 Basketball, Badminton, Volleyball
│   │   │   ├── venues/        # Tashkent sports clubs (Chilonzor, Yunusobod, etc.)
│   │   │   ├── sessions/      # Game scheduling, filters & participant tracking
│   │   │   ├── bookings/      # Transactional spot reservations & capacity locks
│   │   │   ├── payments/      # Click & Payme provider interfaces + Dev simulator
│   │   │   ├── admin/         # Operational metrics, revenue calculation & audit logs
│   │   │   ├── notifications/ # In-app alerts & booking confirmation triggers
│   │   │   └── partnership/   # Venue inquiry submission & leads management
│   │   └── test/              # Vitest automated unit & integration test suite
│   │
│   └── web/                   # Next.js 16 / React 19 App Router Frontend
│       ├── src/
│       │   ├── app/           # Routes: /, /discover, /sessions/[id], /my-games, /profile, /admin, /terms, /privacy
│       │   ├── components/    # Reusable UI, Mascot, Illustrations, Layout, Session cards
│       │   ├── hooks/         # useAuth, useTelegram, useI18n
│       │   └── lib/           # API client, types, translation dictionaries
│       ├── tailwind.config.ts # Playful cartoon design tokens
│       └── postcss.config.mjs
│
├── .env.example               # Safe template with placeholder configuration
├── package.json               # Root monorepo workspace scripts
└── README.md
```

---

## 3. Key Features

1. **Public Landing Page (`/`)**:
   - Hero section with cartoon sports composition, clear value proposition, and instant action button.
   - 3-step "How Pley Works" guide.
   - Sports cards: Table Tennis and 3x3 Basketball (active), plus Badminton and Volleyball (coming soon).
   - Live upcoming games preview directly from backend data.
   - "Why Pley?" value comparison cards.
   - "Got a court? Let's fill it" interactive venue partnership inquiry form.

2. **Discover Games (`/discover`)**:
   - Interactive search by venue name or title.
   - Multi-dimensional filters: Sport type, District (Yunusobod, Chilonzor, Mirzo Ulugʻbek), Skill level (Beginner, Casual, Intermediate, Advanced), and Availability.
   - Capacity meter showing exact spots remaining.
   - Illustrated empty states when filters produce no matches.

3. **Session Details (`/sessions/[id]`)**:
   - Venue address, amenities, and equipment notes.
   - Transparent price breakdown (court cost + platform service fee).
   - Confirmed participant roster with skill levels.
   - Real-time spot capacity meter.
   - Cancellation deadline notice.
   - Instant booking action with confetti celebration.
   - Telegram WebApp one-tap sharing.

4. **My Games Dashboard (`/my-games`)**:
   - Tabbed view: Upcoming Games, Past Games, Cancelled Bookings.
   - Real-time cancellation eligibility check based on venue cancellation policy.

5. **Profile & Settings (`/profile`)**:
   - Player avatar, skill level, and age bracket configuration.
   - Real achievements based on actual activity (*First Step on Court*, *Regular Contender*, *Versatile Athlete*, *Tashkent Explorer*).
   - Instant demo account switcher for rapid local testing (*Jasur Admin*, *Timur Player*, *Madina Player*).

6. **Admin Operations Center (`/admin`)**:
   - Real computed metrics: Gross booking volume (UZS), platform revenue (UZS), active sessions, user counts, and fill rate.
   - New session creation modal with full date/time, price, and capacity validation.
   - Live bookings monitor and audit log inspection.

---

## 4. Getting Started

### Prerequisites
- Node.js v20+ (tested on Node v26)
- npm v10+

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/pleyuz.git
cd pleyuz

# Install dependencies for all monorepo workspaces
npm install
```

### Environment Configuration
```bash
cp .env.example .env
```
*(By default, if `DATABASE_URL` is omitted, the backend automatically initializes an in-memory / local SQLite dialect with complete demo data so you can run the entire platform immediately with zero configuration!)*

### Running the Application

```bash
# Start backend API (runs on http://localhost:4000/api/v1)
npm run dev:api

# In a separate terminal, start frontend web app (runs on http://localhost:3000)
npm run dev:web
```

---

## 5. Verification & Testing

The project includes an automated test suite verifying transactional spot reservation, capacity protection, duplicate booking prevention, cancellation policies, and RBAC guards:

```bash
# Run unit & integration tests
npm test

# Run TypeScript typechecks across the monorepo
npm run lint

# Compile production builds
npm run build
```

---

## 6. Telegram Mini App & Integrations Status

| Integration | Status | Requirements to Go Live |
|---|---|---|
| **Telegram Mini App** | Ready | Set `TELEGRAM_BOT_TOKEN` from [@BotFather](https://t.me/BotFather) and register Web App URL. |
| **Simulated Payment Adapter** | Active (Dev Mode) | None. Instantly simulates transactions for local testing. |
| **Click.uz Payment** | Interface Ready | Requires commercial merchant contract with Click.uz to obtain `CLICK_SERVICE_ID`, `CLICK_MERCHANT_ID`, and `CLICK_SECRET_KEY`. |
| **Payme.uz Payment** | Interface Ready | Requires merchant registration with Paycom to obtain `PAYME_MERCHANT_ID` and `PAYME_SECRET_KEY`. |
| **PostgreSQL Database** | Ready | Set `DATABASE_URL` in `.env` for production database connection. |

