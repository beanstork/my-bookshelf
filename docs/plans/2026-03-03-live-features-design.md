# Live Features Design — My Bookshelf
**Date:** 2026-03-03

## Problem
The app currently has all book data hardcoded. Three features need to be added:
1. Auto-sync with Goodreads so book data stays current
2. Book spine colours derived from real cover art
3. Book cover image shown in the detail modal, with a pull-off-shelf animation

## Architecture

### Hosting: Vercel
Deploy the Vite app to Vercel (free tier). Vercel natively supports Vite and allows serverless functions under `/api/`, which solves the Goodreads CORS problem without any extra infrastructure.

### Serverless Proxy
Goodreads RSS cannot be fetched directly from the browser (CORS). A Vercel serverless function at `/api/goodreads` fetches the RSS on behalf of the browser and returns clean JSON.

### Goodreads User
- Profile: https://www.goodreads.com/user/show/174446438-bean
- User ID: `174446438`
- RSS URL: `https://www.goodreads.com/review/list_rss/174446438?shelf=%23all&per_page=200`

---

## Feature 1 — Goodreads Auto-Sync

**Trigger:** On every page load (React `useEffect` on mount).

**Data flow:**
1. App mounts → calls `/api/goodreads`
2. Serverless function fetches Goodreads RSS XML
3. Parses XML → returns JSON array of books
4. App replaces hardcoded `RAW_BOOKS` with live data
5. Loading state shown while fetching; falls back to `RAW_BOOKS` on error

**Fields available from RSS:**
- title, author, ISBN, Goodreads book ID
- User rating (0–5), average rating
- Shelf (read / currently-reading / to-read)
- Custom shelves → used as genre tags
- Date read, date added
- Written review text
- Page count, publication year
- Cover image URL (small + large)

**Known limitation:** Series name and series index are not in the RSS feed. These will be maintained in a static `src/seriesOverrides.js` file that maps Goodreads book IDs to `{ seriesName, seriesIndex }`. The user can update this file manually when needed.

**Serverless function:** `api/goodreads.js` — fetches RSS, parses with `fast-xml-parser`, returns JSON. No API key required (public RSS feed).

---

## Feature 2 — Cover-Derived Spine Colours

**How it works:**
- The RSS sync provides a cover image URL for each book
- On first load, `colorthief` extracts the dominant colour from each cover image
- Colours are cached in `localStorage` keyed by Goodreads book ID
- The cached colour replaces the current random colour function on each book spine
- If colour extraction fails (e.g. image blocked), the existing random colour is used as fallback

**Performance:** Colour extraction happens asynchronously per-book after the initial render, so it doesn't block page load. Books show their fallback colour first, then update as each cover is processed.

---

## Feature 3 — Cover Image in Modal + Pull Animation

**Cover image:** The large cover URL from RSS is stored on each book object and displayed in the detail modal alongside existing metadata.

**Pull-off-shelf animation:**
- On spine click: the spine element animates `translateY(-120%)` over ~300ms with an ease-in curve (simulates being pulled up and out)
- After animation completes, the detail modal opens
- On modal close: the spine animates back down to its resting position (`translateY(0)`) over ~250ms
- Implemented with CSS transitions + a small React state flag (`pulledBookId`)

---

## Deployment Setup

**Files to add:**
- `api/goodreads.js` — Vercel serverless function
- `vercel.json` — minimal config to wire up the API route
- `src/seriesOverrides.js` — static series metadata

**Dependencies to add:**
- `fast-xml-parser` — RSS XML parsing in the serverless function
- `colorthief` — dominant colour extraction from images

**No changes to:** existing book data shape (all current fields preserved), visual design, or any other existing functionality.
