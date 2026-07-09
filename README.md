# LeadScout

Scan Google Maps for businesses in a niche + city that have **no website**
(or a broken/missing one), save them to MongoDB, filter/sort them, and
export a clean CSV — built for outreach and cold-pitching web dev work.

## Stack

- Next.js (App Router) + TypeScript
- Server Actions for all backend logic (no separate API layer needed)
- Tailwind CSS v4
- MongoDB + Mongoose
- Google Places API (New) — Text Search

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get a Google Places API key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or use an existing one)
3. Enable **"Places API (New)"** under APIs & Services
4. Create an API key under Credentials
5. (Recommended) Restrict the key to the Places API and set a daily quota
   cap to avoid surprise billing — Google gives $200/month free credit,
   Text Search is billed per request beyond that.

### 3. Get a MongoDB connection string

Easiest: a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.
Or run MongoDB locally with `mongodb://localhost:27017/leadscout`.

### 4. Environment variables

Copy `.env.local.example` to `.env.local` and fill in both values:

```bash
cp .env.local.example .env.local
```

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/leadscout
GOOGLE_PLACES_API_KEY=your_key_here
```

### 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

- **Scan** — enter a niche (e.g. "gym") and a city (e.g. "Multan"). This
  calls the Places API Text Search endpoint (up to 3 pages / ~60 results
  per scan, matching what Google Maps itself shows for one search) and
  upserts each result into MongoDB keyed by `placeId`, so re-scanning the
  same area never creates duplicates.
- **Unclaimed detection** — a business counts as having no website if the
  Places API returns no `websiteUri` field for it. Those rows are flagged
  with an amber "Unclaimed" badge and highlighted.
- **Filters** — niche, city, rating, review count, status, and a
  "no website only" toggle, all synced to the URL so you can bookmark or
  share a filtered view.
- **Status pipeline** — mark each lead `new → contacted → responded → won
  / dead` right from the table as you work through outreach.
- **Export** — the CSV export respects whatever filters are currently
  applied.

## Notes on scale

Each scan is capped at ~60 results (3 pages of 20) per niche+city, which
mirrors Google Maps' own per-search limit. To build a list of thousands,
run multiple scans across different niches and cities/neighborhoods —
each one adds to the same database without duplicating existing leads.

## Detecting "outdated" websites

This version detects **missing** websites (the highest-signal, easiest
pitch). Flagging *outdated* sites among the ones that do have a website
is a good next step — e.g. a background job that fetches each
`websiteUrl`, checks for a mobile viewport meta tag, HTTPS, and how
recently it was likely updated, then stores an `outdated: boolean` flag
on the lead the same way `hasWebsite` works now.
