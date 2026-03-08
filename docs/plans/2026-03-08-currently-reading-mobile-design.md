# Design: Currently Reading Panel, Mobile Layout & Modal Close Behaviour
Date: 2026-03-08

## Overview
Three related improvements to the bookshelf site:
1. A "Currently Reading" panel showing front covers, toggled via settings
2. Mobile layout fixes for NavPanel, stats/filters, bookshelf, and the new panel
3. Modals only close via Escape or explicit buttons — not by clicking the overlay

---

## 1. Currently Reading Panel

### Toggle
- New checkbox in SiteSettingsModal: **"Show Currently Reading panel"**
- Stored as `siteSettings.currentlyReadingEnabled` (boolean, default false)
- Sits alongside the existing "Seasonal Frame Decorations" toggle

### Desktop Layout
- When **enabled**: the bookshelf area becomes a flex row
  - Bookshelf column: `flex: 1`, min-width ~0 (narrows naturally)
  - Currently Reading column: fixed ~260px wide, gap of ~20px
  - Smooth CSS transition on the layout shift
- When **disabled**: bookshelf stays centred, full width (current behaviour)

### Panel Content
- Heading: "Currently Reading" in Playfair Display serif, site's dark rose colour
- Each book displayed as a card:
  - Cover image ~130px wide, loaded via the existing Goodreads cover API (same source as BookModal)
  - Soft drop shadow on covers
  - Title + author in small DM Sans text below
  - Clicking opens the existing BookModal (same as clicking a spine)
- Hover effect: `transform: rotate(3deg) scale(1.04)` with `transition: 0.2s ease` — direction alternates per card (odd cards tilt right, even tilt left)
- Empty state: italic placeholder text "Nothing on the nightstand yet"
- If `currentlyReadingEnabled` is false, panel renders null

### Mobile
- Currently Reading panel stacks **below** the bookshelf (full width)
- Displays as a horizontal scroll strip: covers in a single row, `overflow-x: auto`
- Heading above the strip, same styling

---

## 2. Mobile Layout Fixes

All responsive styles added via `@media` queries in the existing `<style>` block in App.jsx. Breakpoint: **768px**.

### NavPanel
- Below 768px: switches from fixed left vertical pill to fixed **top horizontal bar**
- `top: 0, left: 0, right: 0` — full width, icons in a row instead of column
- `flex-direction: row`, `justify-content: center`
- Page content gets `padding-top` on mobile to clear the bar

### Stats bar & filters
- `width: 100%, box-sizing: border-box, padding: 0 12px`
- Prevents overflow left/right on small viewports

### Bookshelf
- Outer wrapper: `width: 100%, padding: 8px` on mobile
- Shelf rows already have `overflow-x: auto`; ensure the frame doesn't clip them

### Currently Reading (mobile)
- Becomes full-width horizontal strip below bookshelf
- `flex-direction: column` on the outer wrapper (bookshelf + panel stack vertically)

---

## 3. Modal Close Behaviour

### Current behaviour
All modals close when clicking the dimmed overlay behind them (`onClick={onClose}` on the overlay div).

### New behaviour
- Remove `onClick={onClose}` from overlay divs on **all** modals:
  - BookModal
  - SiteSettingsModal
  - ShelfPropPickerModal
  - AddBookForm (if applicable)
- Add `useEffect` keyboard listener in each modal for `Escape` key → calls `onClose`
- Close triggers become: **Escape key**, **Save**, **Cancel**, **Done**, **×** button only

---

## Data & Cover Images
- Currently-reading books: `books.filter(b => b.s === 'currently-reading')`
- Cover images: fetched via `/api/goodreads-cover?isbn=${book.isbn}` (existing endpoint)
- Fallback: coloured rectangle using the book's extracted spine colour if no cover loads

---

## Files Affected
- `src/App.jsx` — layout, toggle, modal fixes, Currently Reading component, @media styles
- `src/components/NavPanel.jsx` — mobile top-bar behaviour
- No new files required
