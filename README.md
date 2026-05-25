# Child Rights Intelligence Platform (CRIP)

A data intelligence dashboard for UNICEF Malaysia monitoring child rights indicators across 9 thematic modules. Aggregates verified government data, live news feeds, parliamentary records, and search trend signals into a single interactive interface.

**Live demo:** Deployed on Netlify — see repo settings for URL.

---

## What this platform does

CRIP consolidates fragmented child rights data from multiple Malaysian government agencies and live sources, enabling UNICEF Malaysia staff to:

- Track child marriage trends by state and year (2019-2024)
- Monitor child abuse and neglect caseloads (JKM annual data)
- Map poverty and facility gaps by state and priority tier
- Read verified Dewan Rakyat Hansard records on child rights legislation
- View real-time discourse signals from Google Trends, Google Alerts, and Bing News
- Search parliamentary debates by speaker, topic, and keyword

---

## Modules

| Module | Path | Description |
|--------|------|-------------|
| Overview | `/` | Key metrics, state risk map, priority tiers |
| Child Marriage | `/marriage` | Cases 2019-2024 by state and ethnicity |
| Abuse & Neglect | `/abuse` | JKM annual cases, TASKA incidents, PDRM sexual crimes |
| Poverty & Risk | `/poverty` | DOSM HIES poverty rates, PLI, state ranking |
| Care Facilities | `/facilities` | JKM-registered facilities by state, gap analysis |
| Discourse NLP | `/sentiment` | 30-day Google Trends + news sentiment feed |
| Parliamentary Hansard | `/parliament` | 38 Dewan Rakyat records (2019-2024) |
| Data Sources | `/sources` | Registry of 10 data sources with access details |
| Glossary | `/glossary` | 50+ terms: agencies, legislation, data, platform |

---

## Data sources

| Source | Type | Coverage |
|--------|------|----------|
| JKM / KPWKM | Verified government | Child abuse, marriage, KASIH, TASKA |
| DOSM OpenDOSM | Live API (CC BY 4.0) | Poverty, HIES, PLI, population |
| Dewan Rakyat Hansard | Verified | 38 parliamentary records, 2019-2024 |
| Google Trends | Live API | 30-day search interest, geo: MY |
| Google Alerts RSS | Live RSS | 5 keyword alerts, Atom feed |
| Bing News Search | Live API | 6 keyword queries, English + BM |
| UNICEF Malaysia | Reference | CRC reports, advocacy briefs |
| PDRM | Verified | Sexual crime stats, cybercrime |
| MOH | Verified | Child health, stunting, SIBS |
| BMJ Open PMC6731912 | Academic | Kelantan child marriage study |

---

## Tech stack

- **Frontend:** React 19 + TypeScript + Vite 7
- **Styling:** Tailwind CSS + custom CSS variables
- **Charts:** Recharts + Chart.js / react-chartjs-2
- **Backend (dev):** Hono + tRPC v11 via `@hono/vite-dev-server`
- **Database:** MySQL via Drizzle ORM
- **Deployment:** Netlify (static) + Netlify Functions (runtime API)
- **Auth:** JWT via `jose`

---

## Getting started

### Prerequisites

- Node.js 20+
- MySQL database (for local dev with full backend)

### 1. Clone and install

```bash
git clone https://github.com/myketapang/unicefmy-crip.git
cd unicefmy-crip
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes (dev) | MySQL connection string |
| `APP_SECRET` | Yes | JWT signing secret |
| `BING_NEWS_API_KEY` | Optional | Azure Bing News API key (free tier: 1,000 tx/month) |
| `GOOGLE_ALERTS_RSS_URLS` | Optional | Comma-separated Google Alerts RSS feed URLs |

> **Bing API key:** Get one free at [Azure Portal](https://portal.azure.com) > Bing Search v7 resource.
>
> **Google Alerts RSS:** Go to [google.com/alerts](https://www.google.com/alerts), create alerts for your keywords, set delivery to "RSS feed", copy the feed URLs.

### 3. Run development server

```bash
npm run dev
```

Opens at `http://localhost:3000`. Both frontend and API run together via Vite dev server.

> The platform works without a database — all modules display static fallback data. A database connection enables admin CRUD operations and persistent data edits.

### 4. Build for production

```bash
npm run build
```

This runs three steps:
1. `tsx scripts/prefetch-trends.ts` — fetches Google Trends data into `public/data/trends.json`
2. `vite build` — bundles the frontend into `dist/public/`
3. `esbuild api/boot.ts` — bundles the Hono backend into `dist/boot.js`

---

## Deploying to Netlify

### One-click deploy

1. Push to GitHub
2. Connect repo to Netlify (New site > Import from Git)
3. Build settings are in `netlify.toml` — no manual configuration needed

### Environment variables for production

In Netlify dashboard > Site settings > Environment variables, add:

```
BING_NEWS_API_KEY=your_azure_bing_key
GOOGLE_ALERTS_RSS_URLS=https://www.google.com/alerts/feeds/YOUR_ID/FEED_ID,...
```

> Without these, the Discourse NLP page will show static Google Trends data only (still functional).

### How Netlify deployment works

| Feature | How it works |
|---------|-------------|
| Frontend | Static files served from `dist/public/` |
| Google Trends | Pre-built into `public/data/trends.json` at build time |
| Bing News + Google Alerts | `netlify/functions/news.ts` — Lambda function at `/.netlify/functions/news` |
| Database / tRPC | Not available on Netlify — frontend uses static fallbacks |
| Hansard data | Embedded in `ParliamentPage.tsx` — no server needed |

---

## Project structure

```
├── src/
│   ├── pages/          # One file per module
│   │   ├── OverviewPage.tsx
│   │   ├── MarriagePage.tsx
│   │   ├── AbusePage.tsx
│   │   ├── PovertyPage.tsx
│   │   ├── FacilitiesPage.tsx
│   │   ├── SentimentPage.tsx
│   │   ├── ParliamentPage.tsx
│   │   ├── SourcesPage.tsx
│   │   └── GlossaryPage.tsx
│   ├── components/     # ShellLayout (sidebar), shared UI
│   └── providers/      # tRPC client, auth context
├── api/
│   ├── crip-router.ts  # All tRPC routes
│   └── lib/
│       ├── bing-news.ts
│       ├── google-trends.ts
│       └── google-alerts.ts
├── netlify/
│   └── functions/
│       └── news.ts     # Standalone Netlify Function
├── scripts/
│   └── prefetch-trends.ts  # Build-time Google Trends fetch
├── public/
│   └── data/
│       └── trends.json     # Pre-built at npm run build
└── netlify.toml
```

---

## Admin access

The platform has a protected `/admin` route visible only to users with `role: admin` in the database. Admin users can:

- Edit key metric values shown on each module
- Create and delete data source entries
- Manage platform settings

---

## Data update cycle

| Data type | Update frequency | Method |
|-----------|-----------------|--------|
| Child marriage stats | Annual (parliamentary session) | Manual DB update via admin panel |
| Abuse cases | Annual (JKM report) | Manual DB update |
| Poverty / HIES | Biennial (DOSM) | Manual DB update |
| Google Trends | Every build + 1-hr dev cache | `npm run build` re-fetches |
| Google Alerts / Bing | Live (30-min prod cache) | Netlify Function |
| Hansard records | On code update | Edit `ParliamentPage.tsx` |

---

## Disclaimer

This is a **prototype** built for UNICEF Malaysia internal use (Phase 1). Data is sourced from publicly available government publications. All figures should be verified against primary sources before use in official reports.

- Parliamentary Hansard excerpts are translated and summarised from Bahasa Malaysia
- Google Trends data represents relative search interest, not absolute search volume
- Sentiment classification uses keyword matching; results are indicative, not clinically validated

---

## Acknowledgements

Data sources: DOSM · JKM · KPWKM · Dewan Rakyat · PDRM · MOH · UNICEF Malaysia · BMJ Open

Platform built with assistance from Claude (Anthropic) for UNICEF Malaysia Phase 1 prototype.
