# Stats Pages — Design Document
_Date: 2026-03-03_

## Overview

Add four stats/analytics pages to My Bookshelf, accessible via a fixed floating navigation panel on the left side of the screen. Pages replace the full bookshelf view and return via a back button.

## Navigation

- Fixed left-side panel, always visible, vertically centred
- Five icon+label buttons: 📚 Shelf · 📈 Over Time · 🎭 Genres · ✍️ Authors · 🎯 Goals
- Active page highlighted in burgundy (`#8B2840`) matching existing active pill style
- Implemented as `src/components/NavPanel.jsx`
- Driven by `currentView` state in `App.jsx`: `"bookshelf" | "timeline" | "genres" | "authors" | "goals"`

## Page Transitions

- Clicking a nav button replaces the entire page content (bookshelf disappears)
- Stats pages have a ← Back button at top left to return to bookshelf
- Page fades in using the existing `fadeIn` CSS animation

## New Files

```
src/
  components/
    NavPanel.jsx
  pages/
    StatsTimeline.jsx
    StatsGenres.jsx
    StatsAuthors.jsx
    StatsGoals.jsx
api/
  reading-goal.js
```

## New Dependency

`recharts` — for all charts (bar, donut, horizontal bar, arc/ring).

## Data Flow

All stats pages receive `books` array as a prop. Calculations are done inside each page component. No additional client-side data fetching except the reading goal API call.

---

## Page 1 — Reading Over Time (`StatsTimeline`)

**Chart:** Vertical bar chart (Recharts `BarChart`) — books read per year
**Toggle:** Switch between "books" and "pages" view
**Below chart:** Summary table: Year | Books | Pages | Avg Rating
**Data source:** `books.filter(b => b.s === "read" && b.dr)`, grouped by year from `b.dr`
**Colours:** Warm gold (`#D4A843`) bars on cream background

---

## Page 2 — Genre Breakdown (`StatsGenres`)

**Chart:** Donut chart (Recharts `PieChart` with inner radius)
**Interaction:** Click a slice → highlight + show detail panel on right
**Detail panel:** Genre name, book count, % of total, avg rating, top 3 books
**Untagged:** Books with `b.g.length === 0` grouped as "Untagged"
**Colours:** Warm palette derived from existing genre pill colours

---

## Page 3 — Top Authors (`StatsAuthors`)

**Chart:** Horizontal bar chart (Recharts `BarChart` with `layout="vertical"`)
**Sorted by:** Book count (default), toggle to total pages
**Each row shows:** Author name, book count, avg rating
**Interaction:** Click author row → inline panel listing their books

---

## Page 4 — Reading Goals (`StatsGoals`)

### Current Year
- Goal target: fetched from `api/reading-goal.js` (scrapes Goodreads profile page)
- Override: small edit button lets user set manually
- Visual: large progress ring (SVG arc) — books read vs target, "X books to go" label
- Falls back to manual entry if API call fails

### Past Years
- Table: Year | Target | Actual | Hit/Missed
- Actual counts: computed from book data
- Targets: stored in `localStorage` under key `bookshelf_goals_v1` as `{ "2024": 30, "2025": 24, ... }`
- Inline editable: click any past year target to edit it

### New Serverless Function — `api/reading-goal.js`
- Fetches `https://www.goodreads.com/user/show/174446438-bean`
- Parses HTML for reading challenge goal number (e.g. "30 books")
- Returns `{ year: 2026, goal: 30 }` or `{ error: "..." }`
- Cached for 1 hour (`s-maxage=3600`)

---

## Shared Page Layout

All stats pages use the same cream background and header as the main app. Each page has:
- ← Back button (top left)
- Page title in Playfair Display
- Content area with max-width 1100px, centred

## Aesthetic

Charts styled to match the bookshelf palette:
- Background: `#F2E8D9` (cream)
- Primary bars/fills: `#D4A843` (gold) and `#8B2840` (burgundy)
- Text: `#3A2515` (dark brown)
- Grid lines: `rgba(160,120,70,0.15)` (subtle warm)
- Font: DM Sans for labels, Playfair Display for titles
