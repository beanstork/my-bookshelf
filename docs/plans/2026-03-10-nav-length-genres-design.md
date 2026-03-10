# Nav Sizing, Length Filter, and Genre Population Design

## Goal
Fix nav button sizing, add a Medium length option to Next Read, and populate genres from Goodreads for to-read books (existing + new).

## 1. Nav Button Equal Sizing
Add `minWidth: 72px` and `justifyContent: 'center'` to `.nav-strip-btn` in `src/components/NavPanel.jsx`. This gives all three buttons (Shelf, Stats, Next Read) the same minimum width regardless of label length. The sub-strip buttons don't need this since they're in a separate row and look fine variable-width.

## 2. Length Filter — Add Medium
New order: **Short (< 300p)** | **Medium (300–500p)** | **Long (> 500p)** | **Any**

In `src/pages/NextRead.jsx`:
- Add `medium` to the length options array after `short`, before `long`, with `any` last
- Default stays `'any'`
- Add filter logic: `if (selectedLength === 'medium' && (b.p <= 0 || b.p < 300 || b.p > 500)) return false`

## 3. Genre Population from Goodreads

### A — Extend api/goodreads-book.js
Add genre extraction after the existing cover extraction. Try in order:
1. `ldData.genre` — JSON-LD Book schema sometimes includes a `genre` field (string or array)
2. `<meta property="og:book:tag" content="...">` — Goodreads includes genre tags as OG meta tags, one per genre

Take the first 3 unique non-empty values. Return as `genres: string[]` alongside existing fields.

### B — Use genres when adding new books
In `AddBookForm` (`src/App.jsx` around line 1332):
Change `g: genre ? [genre] : []` to `g: (grMeta?.genres?.length ? grMeta.genres : (genre ? [genre] : []))`.
This means Goodreads genres take priority over the manual single-genre field when available.

### C — Backfill genres for existing to-read books
In `src/pages/NextRead.jsx`:
- Compute `needsGenres = toReadBooks.filter(b => !b.manual && (b.g || []).length === 0)`
- If `needsGenres.length > 0`, show a small banner above the filters: "N books on your To Read shelf have no genres. [Fetch genres] →"
- `NextRead` receives a new `onUpdateBook` prop (wired from App.jsx's `handleEditBook`)
- On click: loop through `needsGenres` one at a time, call `/api/goodreads-book?id=${b.id}`, apply returned `genres` via `onUpdateBook(b.id, { g: genres })`, show progress "Fetching genres… (3/8)"
- On completion: show "Done! Genres added to 8 books." The banner disappears once all books have genres or after completion
- Errors per book are silently skipped (book keeps empty genres)
- Manual books (`b.manual === true`) are excluded since they have no Goodreads ID

### Data update mechanism
`handleEditBook(id, changes)` in App.jsx (line 2628) already exists and handles both manual books (direct update) and Goodreads books (stored as overrides). Pass it as `onUpdateBook` to `NextRead`.
