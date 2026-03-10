# Nav Restructure + Book Picker Design

## Goal
Collapse the four stats views into a single "Stats" nav button with a sub-nav, and add a new "Next Read" book picker feature as the third nav item.

## Nav Restructure

### New nav layout
Three top-level items: **Shelf | Stats | Next Read**

The `NAV_ITEMS` array in `src/components/NavPanel.jsx` is replaced with these three items.

### Stats sub-nav
When any stats sub-view is active (`timeline`, `genres`, `authors`, `goals`), a secondary strip renders directly below the main nav pill containing four buttons: **Over Time | Genres | Authors | Goals**.

- The "Stats" button is marked active whenever `currentView` is one of the four stats sub-views
- The secondary strip is visible when `currentView` is one of those four views
- Navigating to Shelf or Next Read collapses the secondary strip
- Clicking a sub-nav item calls `onNavigate(key)` as normal
- Sub-nav uses the same pill/button styling as the main nav but slightly smaller

### New view key
`next-read` is added as a valid view key alongside the existing ones.

## Next Read Feature

### View entry point
`displayedView === 'next-read'` renders a new `<NextRead>` component, passing `books={books}`.

### Component: NextRead

**Data:** Works entirely from `books.filter(b => b.s === 'to-read')`.

#### Step 1 — Criteria selection

Three optional filter controls:

**Genre chips**
- Collect all unique genres from to-read books: `toReadBooks.flatMap(b => b.g)`
- Render as toggleable chips (multi-select); none selected = any genre
- Only rendered if at least one to-read book has genres

**Length toggle**
- Three options: Short (< 300p) / Any / Long (> 500p)
- Based on `b.p` (pages field); books with `p === 0` or missing treated as "Any"
- Default: Any

**Mood chips**
- Fixed set of 5 moods with genre mappings:
  - Comforting → `['contemporary', 'romance', 'humor', 'fiction']`
  - Challenging → `['philosophy', 'classics', 'literary fiction', 'non-fiction']`
  - Adventurous → `['fantasy', 'science fiction', 'adventure', 'thriller']`
  - Emotional → `['romance', 'literary fiction', 'drama', 'contemporary']`
  - Thought-provoking → `['science fiction', 'philosophy', 'non-fiction', 'historical fiction']`
- A mood chip only renders if at least one to-read book's genres overlap with that mood's genre list
- Multiple moods can be selected (OR logic — book matches if it fits any selected mood)
- If no to-read books have genres, the mood section is hidden entirely

**Matching logic**
A book is eligible if it satisfies ALL active filters:
- Genre: book's `g` array contains at least one selected genre chip (or no chips selected)
- Length: book's `p` falls in the selected range (or Any)
- Mood: book's `g` array overlaps with the genre list of at least one selected mood (or no moods selected)
- Books with no genres (`g` is empty) are excluded only if a genre or mood filter is active

**"Pick for me" button**
- Disabled + greyed out if no to-read books exist or no eligible books match the current filters
- Shows count of eligible books: "Pick from 12 books" (or "No matches — try different filters")

#### Step 2 — The reveal

State: `pickedBook` (null or a book object), `seenIds` (Set of already-shown book IDs this session).

When "Pick for me" is clicked:
- Filter eligible books, exclude already-seen IDs
- If all eligible books have been seen, reset `seenIds` and pick from the full eligible set
- Pick randomly from remaining candidates
- Add picked book's id to `seenIds`
- Set `pickedBook` and show the reveal panel

**Reveal panel displays:**
- Cover image (if `b.cover` exists, else a decorative placeholder in the app's warm palette)
- Title (large, Playfair Display serif)
- Author
- Page count + publication year
- Genres as chips
- Goodreads average rating (`b.ar`) if > 0
- Series info (`b.sn`, `b.si`) if present

**Actions:**
- **"Try another"** — picks a different eligible book (same filter state, excludes already-seen)
- **"That's the one! 🎉"** — celebratory confirmation state: shows a warm congratulatory message ("Happy reading!"), no data changes

**Empty state:** If `toReadBooks.length === 0`, show a friendly message: "Your To Read shelf is empty — add some books first!"

## Styling
- Follows existing app aesthetic: dark background `#1E1208`, warm text `#E8D5B7`, accent `#8B2840`, gold `#D4A843`
- Fonts: Playfair Display for headings, DM Sans for UI
- Sub-nav uses same pill shape as main nav, slightly reduced padding
