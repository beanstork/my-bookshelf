# Visual Refresh Design — 2026-03-02

## Overview
Seven visual improvements inspired by the cherry tree photo (`images/cherry tree.jpg`).

## Colour Palette
- **Header:** cherry tree photo (upper canopy, `center 22%`) + pink-to-deeper-pink gradient overlay
- **Controls band:** `#F5C4A0` — pale apricot coral from bottom-of-sunset in the photo
- **Background:** `#F2E8D9` — warm papyrus/parchment with fine paper-fibre SVG texture
- **Bookshelf frame:** `#B89060` gradient — warm bench-tone maple (references the bench in the photo)
- **Shelf planks:** `#C4A882` — lighter caramel maple
- **Back panel:** `#7A6048` — medium warm walnut
- **CTA buttons:** `#A0445A` — dusty rose, echoes cherry blossom pink
- **Stat values:** `#5C2010`, labels `#6B3520` — readable dark brown on coral

## Changes

### 1. Cherry Tree Header
- Import `images/cherry tree.jpg` as Vite asset
- Header div: `position: relative; overflow: hidden; borderRadius: 0 0 40px 40px`
- Three layers: photo background (cover, `center 22%`) + gradient overlay (more opaque at bottom) + content div (`zIndex: 1`)
- Title text shadow for additional legibility against photo

### 2. Sunset Coral Band
- Replace `#bad9b9` + mossy texture with flat `#F5C4A0`
- `marginTop: 12` gap below the rounded header
- StatsBar container: white semi-transparent background stays, border warm-toned
- Stat text darkened to `#5C2010` / `#6B3520`

### 3. Papyrus Background
- `#2e4130` → `#F2E8D9` with fine horizontal + sparse vertical SVG line texture (paper fibres)
- Scrollbar updated to warm caramel `#C4A882`
- Filter pills, labels, search/sort inputs all shifted to warm brown palette
- "Showing X books" counter: `#4A3020`

### 4. Alternating Bookends
- Even shelves (0, 2, 4…): bookend on right
- Odd shelves (1, 3, 5…): bookend on left
- 4 shapes cycling by `shelfIndex % 4`: doorstop, arch-top, stepped, wedge
- Warm maple gradient + directional drop shadow

### 5. Book Spine Text
- Author div removed
- Title `fontSize`: `9 → 11` (narrow books), `11 → 14` (standard books)
- `maxHeight: height - 40` (using freed space)

### 6. Add Book Buttons
- Both the trigger button and the form submit button: flat `#A0445A`, text `#F9EDE8`
- No gradient, subtle rose box-shadow

### 7. Maple Bookshelf
- Frame: `#B89060` warm maple gradient
- Shelf planks: `#C4A882`
- Back panel: `#7A6048`
- Grain SVG strokes updated to warm amber tones throughout
