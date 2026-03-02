# Visual Fixes Design — 2026-03-02

## Overview
Eight targeted visual improvements to the bookshelf app based on screenshot review.

## Changes

### 1. Book Spacing
- Remove `justifyContent: "space-between"` from shelf books row
- Replace with `justifyContent: "flex-start"` and `gap: 3`
- Increase `booksPerShelf` from 14 to 20
- Books pack left; last shelf may have trailing empty space — intentional

### 2. Header Bottom Padding
- Reduce from `padding: "48px 20px 32px"` to `"32px 20px 12px"`
- Makes the stats band border more visually distinct

### 3. Stats Colour
- Stat values: `#D4A843` → `#7A5510` (dark amber-brown)
- Stat labels: `#8B7355` → `#5A3E0A`

### 4. Emoji Changes
- Avg Rating: `⭐` → `🌡️`
- 5-Star Reads: `🌟` → `⭐⭐⭐⭐⭐`

### 5. New Printed Books Stat
- Value: count of `read` books where `au === false`
- Emoji: `📖`
- Label: "Printed Books"
- Position: immediately after Audiobooks
- No divider border between Audiobooks and Printed Books cells

### 6. Add Book Button Colour
- Change gradient from `linear-gradient(135deg, #D4A843, #B8860B)`
- To `linear-gradient(135deg, #8B6014, #5A3E00)`

### 7. Bookshelf Wood Frame Border
- Wrap back panel in an outer div acting as a wooden frame
- `border: "16px solid #6B2225"` with cherry wood gradient via `outline` or box-shadow layering
- Rounded corners `borderRadius: 12`
- Inner shadow for depth: `inset 0 4px 12px rgba(0,0,0,0.4)`

### 8. Mossy Texture on Light Green Band
- Add SVG pattern of irregular blobs in `rgba(46,80,50,0.06)` to the `#bad9b9` controls band
- Tiled, gives a subtle moss/lichen organic feel
