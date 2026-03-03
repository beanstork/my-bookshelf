# Visual Polish Design — My Bookshelf
**Date:** 2026-03-03

## Problem
The current UI has three visually disconnected zones (pink header → orange band → cream body) that clash and make the page feel assembled rather than designed. Additional issues include a cheap emoji icon, native browser dropdowns, unclear stats layout, and a bookshelf that floats on a blank canvas.

## Approach
Unified Cream (Approach A): remove the orange band, let the whole page below the header share one consistent warm cream surface, and clean up individual components to match.

---

## Section 1 — Header
- Remove the 📚 emoji
- Replace with a small inline SVG bookmark icon (~32px) in deep cherry red (`#5C0F1E`) to match the title
- Extend the bottom gradient of the cherry blossom photo so it fades fully into the cream page background (`#F2E8D9`) — no hard edge at the header boundary

## Section 2 — Stats Bar
- Remove the orange/peach background — stats sit directly on the cream page background
- Remove hard divider lines between stat items
- Each stat becomes a small floating card: white background, soft warm shadow, rounded corners
- Cards arranged in a centered row with comfortable spacing
- Numbers stay large and bold; labels remain small uppercase
- Replace the thermometer icon on the Avg Rating stat with a star outline SVG

## Section 3 — Controls (Search, Filters, Sort, Genre, Add Book)
- Remove orange band background — controls sit on the same cream surface as everything else
- Custom-style the Sort and Genre `<select>` dropdowns: consistent border, padding, custom SVG chevron arrow, warm color palette
- Change the "+ Add Book" button from dark berry to muted dusty rose, harmonizing with the cherry blossom header
- Strengthen the active state on shelf filter pills so the selected pill is more clearly distinguished

## Section 4 — Page Body & Bookshelf
- Cream background with existing paper texture runs uninterrupted from below the header to the bottom of the page
- Add a soft inward vignette around the bookshelf to give it depth and ground it on the page
- No changes to the bookshelf wood frame or book spines
