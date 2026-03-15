# Bookshelf Feature Batch — Design Spec
**Date:** 2026-03-15
**Status:** Approved

---

## Overview

Eight features to add to the my-bookshelf React + Vite app (`src/App.jsx`). All changes are local-only (no backend or auth changes).

---

## Feature 1 — Kindle Option in Add Book

**What:** Add a Kindle checkbox to the manual Add Book form, alongside the existing Audiobook checkbox.

**Details:**
- The book data model already has two independent boolean fields: `b.au` (audiobook) and `b.ki` (Kindle), stored separately from `b.bind`. Both can be false simultaneously (physical book). They are mutually exclusive in the UI but stored independently in data.
- The edit modal already handles both fields and their mutual exclusivity. Mirror this in `AddBookForm`.
- `AddBookForm` currently has one `isAudiobook` boolean state. Add `isKindle` (boolean, default false).
- Checking one unchecks the other. Both unchecked = physical book.
- New book object: `au: isAudiobook, ki: isKindle, bind: isAudiobook ? 'Audiobook' : isKindle ? 'Kindle' : 'Paperback'`.

---

## Feature 2 — Sort by Publication Year

**What:** Add a "Pub. Year" option to the sort dropdown.

**Details:**
- Add `<option value="pubYear">Pub. Year</option>` to the sort `<select>` in the controls bar.
- In the `sortedBooks` memo, add sort key: `if (sortBy === "pubYear") return parseInt(b.y || "0")`.
- For series groups, use the minimum (earliest) year across books in the series as the group sort key.
- Default sort direction when selecting pub year: descending (newest first). The existing `setSortAsc(false)` on sort change already handles this.

---

## Feature 3 — Publication Year in Edit & Add Book

**What:** Allow manually entering/editing the publication year (`y` field) in both the Edit modal and the Add Book form.

**Details:**
- **Edit modal:** Add a "Publication Year" text input (type="number", min=1, max=2100, step=1) below the existing fields. Reads from `editState.y`, updates `editState.y` as a string. Always editable regardless of whether the book came from Goodreads.
- **Add Book form:** Add a "Publication Year" field below the rating row. Pre-populated from `grData?.year` if the Goodreads lookup returns a year; otherwise blank and manually editable. Stored in book object as a string (e.g. `"2021"`).
- Validation: display a small warning if the entered value is not a 4-digit number; empty string is valid and stored as `""`.

---

## Feature 4 — Seasonal Tabs in Shelf Prop Picker

**What:** Expand `ShelfPropPickerModal` to show all seasons across tabs, with a Custom tab and an Auto-select toggle.

### Data model

`siteSettings.shelfPropOverrides[shelfIndex]` changes from a single value (number or string) to a per-season object:

```js
{
  spring: 0|1|2|3|null,   // null = use seasonal default for this season
  summer: 0|1|2|3|null,
  fall:   0|1|2|3|null,
  winter: 0|1|2|3|null,
  custom: dataUrl|null,    // uploaded image; null = none
  autoSelect: bool         // true = rotate seasonally; false = honour per-season keys
}
```

**Migration — runs on app load** for all entries in `shelfPropOverrides`:
- If value is `undefined` or `null`: no data written; treated as `{ autoSelect: true }` at runtime.
- If value is a number (0–3): write `{ [currentSeasonKey]: number, autoSelect: false }` where `currentSeasonKey` is the season string derived from the current calendar month at migration time: months 3–5 → `"spring"`, 6–8 → `"summer"`, 9–11 → `"fall"`, 12 or 1–2 → `"winter"`.
- If value is a string (data URL): write `{ custom: string, autoSelect: false }`.

After migration, all stored values are in the new object shape. The effective prop logic therefore only needs to handle the object shape, not the legacy formats.

### Effective prop resolution (`getEffectiveProp`)

Priority order:
1. If `override.custom` is a non-empty, non-null string → use the custom image, regardless of season or autoSelect.
2. Else if override is undefined/null, or `override.autoSelect` is true → use `getSeasonalProp(shelfIndex)` (existing behaviour).
3. Else → look up `override[currentSeasonKey]`; if it is `null`, `undefined`, or not present → fall back to `getSeasonalProp(shelfIndex)`.

Note: A shelf can reach a state of `autoSelect: false` with all season keys null and no custom image (e.g. after resetting every tab). This is valid — rule 3 applies and falls back to `getSeasonalProp` for every season. The checkbox will show unchecked even though the behaviour is identical to auto-select. This is intentional: the user has explicitly chosen not to auto-select, and the defaults happen to be the same.

### UI

- Five tabs: 🌸 Spring | 🌊 Summer | 🍂 Fall | ❄️ Winter | 🖼 Custom.
- The tab matching the current calendar season opens by default.
- Each seasonal tab shows the 4 prop thumbnails for that season via `getSeasonalProp(shelfIndex, i)` with the season forced. The currently selected index for that season (from `override[tabSeason]`) is shown with a gold border.
- **Custom tab:** shows uploaded image thumbnails each with a ✕ button (sets `override.custom = null`); and a "+ Upload image" button. When a custom image is active, selecting a seasonal prop from another tab is allowed but has no visible effect until the custom image is removed.
- **Bottom of modal:** `Auto-select` checkbox. When the modal opens with no existing override, this defaults to checked. Does not change when "Reset this season" is pressed — it only reflects whether `override.autoSelect` is true.
- **Tooltip on "Auto-select" label:** "Props will automatically change to match the correct season."
- **"Reset this season" button:** On a seasonal tab, sets `override[currentTabSeason] = null` (does not touch `autoSelect` or other season keys). On the Custom tab, sets `override.custom = null`.

---

## Feature 5 — Edit Profile / Settings Tab Split

**What:** Split the existing `SiteSettingsModal` into two tabs: **Edit Profile** and **Settings**.

**Implementation:** `SiteSettingsModal` gains `activeTab` local state (`'profile'|'settings'`), defaulting to `'profile'`. Tab switcher rendered at the top of the modal.

### Edit Profile tab (existing fields, reorganised)
- Site Name
- Profile Circle Image
- Header Image (upload, URL, position slider)
- Header Icon selector
- Show seasonal garland toggle
- Show "Currently Reading" shelf toggle

### Settings tab

**Sync**
- Goodreads RSS URL input (moved from Edit Profile tab)

**Library Data**
- Import CSV button (moved from main shelf toolbar — the toolbar button and its handler are removed from the main UI)
- Export CSV button (new — see Feature 6)

**Preferences**
- Default Sort: pill-button selector with options matching the sort dropdown: Date Read, Rating, Title, Author, Pages, Pub. Year, Colour.
- Saved to `siteSettings.defaultSort` (a string matching the sort option value, e.g. `"dateRead"`).
- On app load: `sortBy` state initialises to `siteSettings.defaultSort || "dateRead"`. Sort direction (`sortAsc`) is not persisted and always initialises to `false` (descending). This is consistent with the current app behaviour where direction resets to descending whenever the sort option changes. Title/author sorts will therefore start descending on fresh load — a known simplification, acceptable since users can flip direction with one click.
- If the saved `defaultSort` value is not a valid option (e.g. stale data), fall back to `"dateRead"`.

**Danger Zone**
- "Reset all manual overrides…" button. After a `window.confirm()` prompt:
  - Clears the following localStorage keys used by `useLocalData`: `bookshelf_manual_v2`, `bookshelf_overrides_v1`, `bookshelf_deleted_v1`, `bookshelf_custom_colors_v1`.
  - Also clears `shelfPropOverrides` from `siteSettings` (sets `siteSettings.shelfPropOverrides = {}`).
  - Does NOT clear the rest of `siteSettings` (name, profile image, header image, garland setting, RSS URL, defaultSort, etc.). This is intentional — the user loses their book data and shelf decorations but keeps their profile and appearance settings.
  - Triggers `window.location.reload()` after clearing.

---

## Feature 6 — Export Bookshelf as CSV

**What:** Export the full current book library as a downloadable CSV file.

**Details:**
- Button lives in Settings tab → Library Data section.
- Exports all books in the current `books` array (merged synced + manual, minus deleted).
- CSV columns (in order): Title, Author, My Rating, Average Rating, Publisher, Binding, Number of Pages, Year Published, Date Read, Date Added, Shelves, ISBN, Audiobook, Kindle, Favourite, Series, Review
  - **Title** → `b.t`
  - **Author** → `b.a`
  - **My Rating** → `b.r`
  - **Average Rating** → `b.ar`
  - **Publisher** → `b.pub`
  - **Binding** → `b.bind`
  - **Number of Pages** → `b.p`
  - **Year Published** → `b.y`
  - **Date Read** → `b.dr`
  - **Date Added** → `b.da`
  - **Shelves** → `[b.s, ...(b.g || [])].filter(Boolean).join(' | ')` — primary shelf first, then genres, empty-genre arrays handled gracefully, e.g. `"read | sci-fi | adventure"` or `"to-read"` if no genres
  - **ISBN** → `b.isbn`
  - **Audiobook** → `b.au ? "true" : "false"` (lowercase string literals)
  - **Kindle** → `b.ki ? "true" : "false"` (lowercase string literals)
  - **Favourite** → `b.fav ? "true" : "false"` (lowercase string literals)
  - **Series** → `b.sn`
  - **Review** → `b.rev`
- All field values are wrapped in double-quotes; internal double-quotes are escaped as `""`.
- File named `bookshelf-export-YYYY-MM-DD.csv`.
- Download via `Blob` + temporary `<a>` element (no server needed).

---

## Feature 7 — Share Button: Expanding Confirmation

**What:** Improve the share button UX with an expanding pill confirmation. Keep the existing icon.

**Details:**
- **Icon:** Keep the existing network-share SVG (three circles connected by two diagonal lines).
- **Confirmation:** On click, the button expands from a 36×36px circle to a pill shape (~150px wide) via `max-width` CSS transition, revealing "Link copied!" text beside the icon. After 2.5 seconds it collapses back.
- CSS on button: `max-width: 36px` collapsed, `max-width: 150px` expanded. Transitions: `max-width 0.3s ease`, `background 0.2s`, `border-color 0.2s`. `overflow: hidden`, `white-space: nowrap` to contain text during animation.
- Expanded style: `background: rgba(92,154,58,0.2)`, `border-color: rgba(92,154,58,0.5)`. "Link copied!" text colour: `#5C9A3A`, `fontSize: 13px`.
- The existing `shareConfirmed` boolean state (already in App) drives the expanded/collapsed state. It is already reset to `false` via a `setTimeout` in the existing click handler. Update that timeout to **2500ms** (the single authoritative duration). No second-click or blur collapse is needed.
- This button is already inside a `{!isReadOnly && ...}` block (confirmed in Feature 8), so the animation code is never rendered on the share page.

---

## Feature 8 — Share Page: Prominent Banner Above Header

**What:** On the read-only (`?share`) view, replace the existing subtle amber strip with a prominent full-width banner placed above the cherry-tree header image.

**Details:**
- **Remove:** The existing `{isReadOnly && <div>}` amber strip inside the header div (~line 3126–3134 in App.jsx) is deleted.
- **Add:** A new `{isReadOnly && <div>}` banner rendered as a sibling *before* the cherry-tree header `<div>` but *within the same parent wrapper*. This means it appears above the header image but still within the main page layout, not floating outside it.
  - Style: `background: linear-gradient(135deg, #5C0F1E, #8B2840)`, full width, `padding: 11px 20px`, `textAlign: center`.
  - Line 1: `"👀 You're visiting {siteSettings.name}'s Bookshelf"` — `color: #F5ECD7`, `fontSize: 13`, `fontWeight: 600`, `marginBottom: 2`.
  - Line 2: `"Read-only view"` — `color: rgba(245,236,215,0.7)`, `fontSize: 11`.
- **Share button:** Wrap the share button in `{!isReadOnly && ...}` (add guard if not already present). Confirm in code at implementation time.

---

## Data & State Summary

| Feature | New state/storage |
|---|---|
| 1 | `isKindle` local state in `AddBookForm` |
| 2 | New `"pubYear"` branch in sort memo |
| 3 | `editState.y` already exists; add UI field in both modals |
| 4 | `shelfPropOverrides[i]` shape changes; migration on app load |
| 5 | `siteSettings.defaultSort`; `activeTab` local state in modal |
| 6 | No new state; pure computation + Blob download |
| 7 | Existing `shareConfirmed` state; CSS `max-width` transition |
| 8 | No new state; DOM order + style change |

---

## Out of Scope

- Multi-user / auth (deferred)
- Mobile-specific layout changes
- Any changes to stats pages or NextRead page
