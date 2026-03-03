# Live Features Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Goodreads live sync, real cover-derived spine colours, cover images in the modal, and a pull-off-shelf animation.

**Architecture:** A Vercel serverless function at `/api/goodreads` proxies the Goodreads RSS feed (solving CORS), returns normalised JSON, and the React app fetches it on mount. Cover colours are extracted client-side using `colorthief` from Open Library cover images (CORS-safe), cached in `localStorage`. The `BookSpine` component gains an `isPulled` prop for the slide-up animation.

**Tech Stack:** React 19, Vite 7, Vercel (hosting + serverless), `fast-xml-parser` (RSS parsing, Node), `colorthief` (browser colour extraction), Open Library Covers API (no key required)

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install `colorthief` (browser) and `fast-xml-parser` (serverless)**

Run in separate Bash calls:
```bash
cd /c/Users/Nour/my-bookshelf
npm install colorthief
```
```bash
cd /c/Users/Nour/my-bookshelf
npm install fast-xml-parser
```

**Step 2: Verify both appear in `package.json` dependencies**

Check `package.json` — both `colorthief` and `fast-xml-parser` should now be listed under `"dependencies"`.

**Step 3: Commit**
```bash
cd /c/Users/Nour/my-bookshelf
git add package.json package-lock.json
git commit -m "feat: install colorthief and fast-xml-parser"
```

---

### Task 2: Create Vercel serverless function

**Files:**
- Create: `api/goodreads.js`

This function fetches the Goodreads RSS XML, parses it, and returns a normalised JSON array of books. It runs on Vercel's Node.js runtime and solves the browser CORS problem.

**Step 1: Create the `api/` directory and `goodreads.js`**

Create `api/goodreads.js` with this exact content:

```js
import { XMLParser } from 'fast-xml-parser';

const GOODREADS_USER_ID = '174446438';
const RSS_URL = `https://www.goodreads.com/review/list_rss/${GOODREADS_USER_ID}?shelf=%23all&per_page=200`;

const EXCLUSIVE_SHELVES = new Set(['read', 'currently-reading', 'to-read', 'dnf']);

function parseGoodreadsDate(dateStr) {
  if (!dateStr || dateStr === '') return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

function parseShelfAndGenres(userShelves) {
  if (!userShelves) return { shelf: 'read', genres: [] };
  const all = String(userShelves).split(',').map(s => s.trim()).filter(Boolean);
  const exclusive = all.find(s => EXCLUSIVE_SHELVES.has(s)) || 'read';
  const genres = all.filter(s => !EXCLUSIVE_SHELVES.has(s) && s !== 'audiobook' && s !== 'favorites');
  return { shelf: exclusive, genres };
}

function parseTitle(rawTitle) {
  // Goodreads RSS sometimes formats as "Title by Author" — strip the " by ..." suffix
  const byIndex = rawTitle.lastIndexOf(' by ');
  if (byIndex > 0 && byIndex > rawTitle.length / 2) {
    return rawTitle.substring(0, byIndex).trim();
  }
  return rawTitle.trim();
}

function itemToBook(item) {
  const userShelves = item.user_shelves || '';
  const { shelf, genres } = parseShelfAndGenres(userShelves);

  const bookNode = item.book || {};
  const pages = parseInt(bookNode.num_pages) || 0;
  const avgRating = parseFloat(item.average_rating) || 0;
  const userRating = parseInt(item.user_rating) || 0;
  const isbn = String(item.isbn || bookNode.isbn || '').replace(/[^0-9X]/gi, '');

  // Cover: prefer large, fall back to medium/small
  const cover =
    item.book_large_image_url ||
    item.book_medium_image_url ||
    item.book_image_url ||
    item.book_small_image_url ||
    '';

  return {
    id: String(item.book_id || ''),
    t: parseTitle(String(item.title || '')),
    a: String(item.author_name || ''),
    r: userRating,
    ar: Math.round(avgRating * 100) / 100,
    p: pages,
    y: String(item.book_published || bookNode.publication_year || ''),
    dr: parseGoodreadsDate(item.user_read_at),
    da: parseGoodreadsDate(item.user_date_added),
    s: shelf,
    g: genres,
    sn: '',           // series — maintained in seriesOverrides.js
    si: 0,
    au: userShelves.includes('audiobook'),
    fav: userShelves.includes('favorites'),
    isbn,
    pub: String(bookNode.publisher || ''),
    bind: String(bookNode.binding || ''),
    rev: String(item.user_review || ''),
    cover,
  };
}

export default async function handler(req, res) {
  try {
    const response = await fetch(RSS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bookshelf-app/1.0)' },
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Goodreads returned ${response.status}` });
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      cdataPropName: '__cdata',
      isArray: (name) => name === 'item',
    });

    const parsed = parser.parse(xml);
    const items = parsed?.rss?.channel?.item || [];

    const books = items
      .map(itemToBook)
      .filter(b => b.id && b.t);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json(books);
  } catch (err) {
    console.error('Goodreads fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch Goodreads data' });
  }
}
```

**Step 2: Commit**
```bash
cd /c/Users/Nour/my-bookshelf
git add api/goodreads.js
git commit -m "feat: add Vercel serverless function for Goodreads RSS proxy"
```

---

### Task 3: Create `vercel.json`

**Files:**
- Create: `vercel.json`

**Step 1: Create `vercel.json` at the project root**

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

This tells Vercel to route `/api/*` requests to the serverless functions in the `api/` directory. No further config needed — Vercel auto-detects Vite.

**Step 2: Commit**
```bash
cd /c/Users/Nour/my-bookshelf
git add vercel.json
git commit -m "feat: add vercel.json config for API routing"
```

---

### Task 4: Create `src/seriesOverrides.js`

**Files:**
- Create: `src/seriesOverrides.js`

The RSS feed does not include series info. This file maps Goodreads book IDs to series metadata and is updated manually when needed.

**Step 1: Create `src/seriesOverrides.js`**

```js
// Maps Goodreads book ID → { sn: "Series Name", si: 1 }
// Update this file manually when you add series books.
// Book IDs come from the Goodreads URL: goodreads.com/book/show/BOOK_ID
const SERIES_OVERRIDES = {
  // Example (uncomment and edit):
  // "7235533": { sn: "The Hunger Games", si: 1 },
  // "6148028": { sn: "The Hunger Games", si: 2 },
};

export default SERIES_OVERRIDES;
```

**Step 2: Commit**
```bash
cd /c/Users/Nour/my-bookshelf
git add src/seriesOverrides.js
git commit -m "feat: add seriesOverrides for manual series metadata"
```

---

### Task 5: Create `src/useGoodreadsSync.js`

**Files:**
- Create: `src/useGoodreadsSync.js`

This hook fetches live book data from the serverless function on mount, merges series overrides, and falls back to the hardcoded `RAW_BOOKS` if the request fails.

**Step 1: Create `src/useGoodreadsSync.js`**

```js
import { useState, useEffect } from 'react';
import SERIES_OVERRIDES from './seriesOverrides.js';

function mergeSeriesOverrides(books) {
  return books.map(b => {
    const override = SERIES_OVERRIDES[b.id];
    return override ? { ...b, sn: override.sn, si: override.si } : b;
  });
}

export default function useGoodreadsSync(fallbackBooks) {
  const [books, setBooks] = useState(fallbackBooks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBooks() {
      try {
        const res = await fetch('/api/goodreads');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setBooks(mergeSeriesOverrides(data));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('Goodreads sync failed, using local data:', err.message);
          setError(err.message);
          setBooks(mergeSeriesOverrides(fallbackBooks));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBooks();
    return () => { cancelled = true; };
  }, []);  // run once on mount

  return { books, loading, error };
}
```

**Step 2: Commit**
```bash
cd /c/Users/Nour/my-bookshelf
git add src/useGoodreadsSync.js
git commit -m "feat: add useGoodreadsSync hook with fallback to local data"
```

---

### Task 6: Integrate sync hook into `App.jsx`

**Files:**
- Modify: `src/App.jsx`

**Step 1: Add import at the top of App.jsx (after the existing imports)**

Find:
```js
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import cherryTreeImg from '../images/cherry-tree.jpg';
```

Replace with:
```js
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import cherryTreeImg from '../images/cherry-tree.jpg';
import useGoodreadsSync from './useGoodreadsSync.js';
```

**Step 2: Replace `useState(RAW_BOOKS)` with the sync hook**

Inside the `App` function, find:
```js
const [books, setBooks] = useState(RAW_BOOKS);
```

Replace with:
```js
const { books: syncedBooks, loading: syncLoading } = useGoodreadsSync(RAW_BOOKS);
const [books, setBooks] = useState(RAW_BOOKS);

useEffect(() => {
  if (!syncLoading) setBooks(syncedBooks);
}, [syncedBooks, syncLoading]);
```

**Step 3: Add a loading indicator to the header area**

In the return JSX, find the stats + controls band comment:
```jsx
{/* Stats + Controls — sits on page cream */}
```

Just before it, add:
```jsx
{syncLoading && (
  <div style={{
    textAlign: 'center', padding: '6px', fontSize: 12,
    color: '#8B5E3C', fontFamily: "'DM Sans', sans-serif",
    opacity: 0.7,
  }}>
    Syncing with Goodreads…
  </div>
)}
```

**Step 4: Commit**
```bash
cd /c/Users/Nour/my-bookshelf
git add src/App.jsx
git commit -m "feat: integrate Goodreads live sync into App, replace hardcoded RAW_BOOKS"
```

---

### Task 7: Create `src/useCoverColors.js`

**Files:**
- Create: `src/useCoverColors.js`

Extracts dominant colour from Open Library cover images (CORS-safe) using `colorthief`. Caches results in `localStorage` so extraction only happens once per book.

**Step 1: Create `src/useCoverColors.js`**

```js
import { useState, useEffect } from 'react';
import ColorThief from 'colorthief';

const CACHE_KEY = 'bookshelf_cover_colors_v1';
const BATCH_SIZE = 5;

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function getCoverUrl(isbn) {
  if (!isbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
}

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

async function extractColor(isbn) {
  return new Promise((resolve) => {
    const url = getCoverUrl(isbn);
    if (!url) return resolve(null);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const [r, g, b] = colorThief.getColor(img);
        resolve(rgbToHex(r, g, b));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    // Add cache-bust param only if Open Library returns a placeholder
    img.src = url;
  });
}

export default function useCoverColors(books) {
  const [colors, setColors] = useState(() => loadCache());

  useEffect(() => {
    if (!books || books.length === 0) return;

    const cache = loadCache();
    const toProcess = books.filter(b => b.isbn && !cache[b.id]);

    if (toProcess.length === 0) return;

    let cancelled = false;

    async function processBatch(batch) {
      const results = await Promise.all(
        batch.map(async b => {
          const color = await extractColor(b.isbn);
          return { id: b.id, color };
        })
      );
      return results;
    }

    async function run() {
      const currentCache = loadCache();
      for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
        if (cancelled) break;
        const batch = toProcess.slice(i, i + BATCH_SIZE);
        const results = await processBatch(batch);
        results.forEach(({ id, color }) => {
          if (color) currentCache[id] = color;
        });
        saveCache(currentCache);
        if (!cancelled) setColors({ ...currentCache });
      }
    }

    run();
    return () => { cancelled = true; };
  }, [books]);

  return colors;
}
```

**Step 2: Commit**
```bash
cd /c/Users/Nour/my-bookshelf
git add src/useCoverColors.js
git commit -m "feat: add useCoverColors hook with Open Library extraction and localStorage cache"
```

---

### Task 8: Wire cover colours into `BookSpine` and add pull animation

**Files:**
- Modify: `src/App.jsx`

This task has two parts: (a) pass cover colours down to `BookSpine`, and (b) add the pull-off-shelf animation.

**Step 1: Add `useCoverColors` import to App.jsx**

Find:
```js
import useGoodreadsSync from './useGoodreadsSync.js';
```

Replace with:
```js
import useGoodreadsSync from './useGoodreadsSync.js';
import useCoverColors from './useCoverColors.js';
```

**Step 2: Add `coverColors` and `pulledBookId` state to the App function**

Find:
```js
const { books: syncedBooks, loading: syncLoading } = useGoodreadsSync(RAW_BOOKS);
const [books, setBooks] = useState(RAW_BOOKS);
```

Replace with:
```js
const { books: syncedBooks, loading: syncLoading } = useGoodreadsSync(RAW_BOOKS);
const [books, setBooks] = useState(RAW_BOOKS);
const coverColors = useCoverColors(books);
const [pulledBookId, setPulledBookId] = useState(null);
```

**Step 3: Replace the `setSelectedBook` click handler with an animated version**

Find:
```jsx
{shelves.map((shelfBooks, i) => (
  <Shelf key={i} books={shelfBooks} onBookClick={setSelectedBook} shelfIndex={i} />
))}
```

Replace with:
```jsx
{shelves.map((shelfBooks, i) => (
  <Shelf
    key={i}
    books={shelfBooks}
    onBookClick={(book) => {
      setPulledBookId(book.id);
      setTimeout(() => setSelectedBook(book), 320);
    }}
    shelfIndex={i}
    coverColors={coverColors}
    pulledBookId={pulledBookId}
  />
))}
```

**Step 4: Reset `pulledBookId` when modal closes**

Find:
```jsx
{selectedBook && <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
```

Replace with:
```jsx
{selectedBook && (
  <BookModal
    book={selectedBook}
    onClose={() => {
      setSelectedBook(null);
      setPulledBookId(null);
    }}
  />
)}
```

**Step 5: Update `Shelf` component signature to accept new props**

Find:
```js
function Shelf({ books, onBookClick, shelfIndex }) {
```

Replace with:
```js
function Shelf({ books, onBookClick, shelfIndex, coverColors = {}, pulledBookId = null }) {
```

**Step 6: Pass `coverColor` and `isPulled` to `BookSpine` inside `Shelf`**

Find:
```jsx
{books.map((book, i) => (
  <BookSpine key={book.id} book={book} onClick={onBookClick} index={shelfIndex * 20 + i} />
))}
```

Replace with:
```jsx
{books.map((book, i) => (
  <BookSpine
    key={book.id}
    book={book}
    onClick={onBookClick}
    index={shelfIndex * 20 + i}
    coverColor={coverColors[book.id] || null}
    isPulled={pulledBookId === book.id}
  />
))}
```

**Step 7: Update `BookSpine` to accept and use `coverColor` and `isPulled`**

Find:
```js
function BookSpine({ book, onClick, index }) {
  const color = getBookColor(book.id);
```

Replace with:
```js
function BookSpine({ book, onClick, index, coverColor = null, isPulled = false }) {
  const color = coverColor || getBookColor(book.id);
```

**Step 8: Update `BookSpine` inline style to handle the pull animation**

Find inside `BookSpine`:
```jsx
      style={{
        width, height, minWidth: width,
        background: `linear-gradient(90deg, ${darken(color, darkFactor * 0.85)} 0%, ${color} 15%, ${darken(color, 1.05)} 50%, ${color} 85%, ${darken(color, darkFactor * 0.7)} 100%)`,
        borderRadius: "2px 4px 4px 2px",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 3px",
        boxSizing: "border-box",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: "inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(0,0,0,0.1), 2px 0 4px rgba(0,0,0,0.2)",
        alignSelf: "flex-end",
        flexShrink: 0,
        overflow: "hidden",
        animation: `slideUp 0.4s ease ${index * 0.015}s both`,
      }}
```

Replace with:
```jsx
      style={{
        width, height, minWidth: width,
        background: `linear-gradient(90deg, ${darken(color, darkFactor * 0.85)} 0%, ${color} 15%, ${darken(color, 1.05)} 50%, ${color} 85%, ${darken(color, darkFactor * 0.7)} 100%)`,
        borderRadius: "2px 4px 4px 2px",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 3px",
        boxSizing: "border-box",
        transition: isPulled
          ? "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.32s ease"
          : "transform 0.2s ease, box-shadow 0.2s ease",
        transform: isPulled ? "translateY(-150%)" : undefined,
        boxShadow: isPulled
          ? "inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(0,0,0,0.1), 2px 12px 24px rgba(0,0,0,0.5)"
          : "inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(0,0,0,0.1), 2px 0 4px rgba(0,0,0,0.2)",
        alignSelf: "flex-end",
        flexShrink: 0,
        overflow: "hidden",
        animation: `slideUp 0.4s ease ${index * 0.015}s both`,
      }}
```

**Step 9: Commit**
```bash
cd /c/Users/Nour/my-bookshelf
git add src/App.jsx
git commit -m "feat: cover colours from Open Library, pull-off-shelf animation"
```

---

### Task 9: Update `BookModal` to show cover image

**Files:**
- Modify: `src/App.jsx` (the `BookModal` function, around line 162)

**Step 1: Add the cover image to the modal**

Inside `BookModal`, find the header section with the title and author. Find:
```jsx
        <div style={{ padding: "28px 32px" }}>
          {/* Title & Author */}
          <h2 style={{
```

Replace with:
```jsx
        <div style={{ padding: "28px 32px" }}>
          {/* Cover image */}
          {book.cover && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <img
                src={book.cover}
                alt={`Cover of ${book.t}`}
                style={{
                  maxHeight: 200, maxWidth: 140,
                  borderRadius: 4,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
          {/* Title & Author */}
          <h2 style={{
```

**Step 2: Commit**
```bash
cd /c/Users/Nour/my-bookshelf
git add src/App.jsx
git commit -m "feat: show book cover image in detail modal"
```

---

### Task 10: Verify locally

**Step 1: Start the dev server**
```bash
cd /c/Users/Nour/my-bookshelf
npm run dev
```

Open `http://localhost:5173` in your browser.

**Note:** The `/api/goodreads` endpoint will return a 404 locally because Vercel serverless functions only run on Vercel (or via `vercel dev`). The app should fall back gracefully to `RAW_BOOKS` and log a warning in the console. This is expected behaviour.

**Check the following locally:**
- Page loads without errors (RAW_BOOKS fallback is active)
- Cover colours begin appearing on spines after a few seconds (Open Library extraction running)
- Clicking a book spine causes it to slide up before the modal opens
- The modal now shows a cover image (using the `cover` field from RAW_BOOKS — note: RAW_BOOKS books have no `cover` field yet, so modal images will be absent locally; they will appear after Vercel deploy when live RSS data includes cover URLs)
- Closing the modal slides the spine back down

**Step 2: Install Vercel CLI and test the API endpoint**
```bash
npm install -g vercel
```
```bash
cd /c/Users/Nour/my-bookshelf
vercel dev
```

Open `http://localhost:3000`. Now `/api/goodreads` will also run. Check:
- Console shows no sync errors
- Books update to match your current Goodreads shelves
- Cover images appear in the modal

---

### Task 11: Deploy to Vercel

**Step 1: Create a free Vercel account**

Go to https://vercel.com and sign up (free). Connect your GitHub account when prompted.

**Step 2: Push the project to GitHub if not already there**

If the project isn't on GitHub yet:
```bash
cd /c/Users/Nour/my-bookshelf
gh repo create my-bookshelf --public --source=. --push
```

If it's already on GitHub:
```bash
cd /c/Users/Nour/my-bookshelf
git push origin master
```

**Step 3: Deploy via Vercel CLI**
```bash
cd /c/Users/Nour/my-bookshelf
vercel --prod
```

Follow the prompts:
- Link to your Vercel account
- Project name: `my-bookshelf` (or your choice)
- Framework: Vite (auto-detected)
- Build command: `npm run build` (auto-detected)
- Output directory: `dist` (auto-detected)

**Step 4: Verify the live deployment**

Open the Vercel URL (e.g. `https://my-bookshelf.vercel.app`):
- Page loads and shows "Syncing with Goodreads…" briefly
- Books update to your current Goodreads library
- Cover images appear in the modal
- Spine colours update as cover colours are extracted
- Pull animation works on book click
