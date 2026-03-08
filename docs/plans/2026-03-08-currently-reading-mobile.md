# Currently Reading Panel, Mobile Layout & Modal Close Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a toggleable Currently Reading cover panel, fix mobile layout, and prevent modals from closing on overlay click.

**Architecture:** All changes live in `src/App.jsx` and `src/components/NavPanel.jsx`. The Currently Reading panel is a new component added to App.jsx. The two-column layout is a flex wrapper around the existing bookshelf container. Mobile responsiveness is handled via `@media` rules — NavPanel gets CSS classes for the responsive pivot; App.jsx's existing `<style>` block gets rules for stats, filters, and the panel. No new files required.

**Tech Stack:** React 19, Vite, inline styles + CSS-in-JS via `<style>` block, no test framework (verify visually in browser with `npm run dev`).

---

## Task 1: Fix modal close behaviour — remove click-outside, add Escape key

**Files:**
- Modify: `src/App.jsx` — 4 modals: BookModal (~line 540), AddBookForm (~line 1115), SiteSettingsModal (~line 1696), ShelfPropPickerModal (~line 1835)

### Step 1: Fix BookModal overlay (line ~548)

Change:
```jsx
onClick={mode === 'view' ? onClose : undefined}
```
To: *(remove the onClick entirely — delete the attribute)*
```jsx
// no onClick on the outer overlay div
```

Then add a `useEffect` Escape listener inside `BookModal`, directly after the `if (!book) return null;` guard (line ~430):
```jsx
useEffect(() => {
  const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
  document.addEventListener('keydown', handleKey);
  return () => document.removeEventListener('keydown', handleKey);
}, [onClose]);
```

### Step 2: Fix AddBookForm overlay (line ~1115)

Change:
```jsx
}} onClick={onClose}>
```
To:
```jsx
}}>
```

Add Escape listener inside `AddBookForm`, after the component's state declarations:
```jsx
useEffect(() => {
  const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
  document.addEventListener('keydown', handleKey);
  return () => document.removeEventListener('keydown', handleKey);
}, [onClose]);
```

### Step 3: Fix SiteSettingsModal overlay (line ~1696)

Change:
```jsx
<div style={overlayStyle} onClick={onClose}>
```
To:
```jsx
<div style={overlayStyle}>
```

Add Escape listener inside `SiteSettingsModal`, after state declarations:
```jsx
useEffect(() => {
  const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
  document.addEventListener('keydown', handleKey);
  return () => document.removeEventListener('keydown', handleKey);
}, [onClose]);
```

### Step 4: Fix ShelfPropPickerModal overlay (line ~1835)

Change:
```jsx
<div style={overlayStyle} onClick={onClose}>
```
To:
```jsx
<div style={overlayStyle}>
```

Add Escape listener inside `ShelfPropPickerModal`, after `const fileRef = useRef(null);`:
```jsx
useEffect(() => {
  const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
  document.addEventListener('keydown', handleKey);
  return () => document.removeEventListener('keydown', handleKey);
}, [onClose]);
```

### Step 5: Verify
Run `npm run dev`. Open a book modal, click the overlay — modal should stay open. Press Escape — modal should close. Repeat for Edit Profile, Shelf Prop Picker, Add Book.

### Step 6: Commit
```
git add src/App.jsx
git commit -m "fix: modals only close on Escape or explicit buttons, not overlay click"
```

---

## Task 2: Add CurrentlyReadingCard and CurrentlyReadingPanel components

**Files:**
- Modify: `src/App.jsx` — add two new components before `SiteSettingsModal` (~line 1660)

### Step 1: Add CurrentlyReadingCard component

Insert before the `ShelfPropPickerModal` function:

```jsx
function CurrentlyReadingCard({ book, onClick, tiltRight }) {
  const [hovered, setHovered] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  const coverSources = [
    book.cover || null,
    book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg` : null,
    book.isbn ? `https://books.google.com/books/content?vid=ISBN:${book.isbn}&printsec=frontcover&img=1&zoom=1` : null,
  ].filter(Boolean);
  const coverSrc = srcIndex < coverSources.length ? coverSources[srcIndex] : null;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        marginBottom: 20,
        transform: hovered
          ? `rotate(${tiltRight ? 3 : -3}deg) scale(1.04)`
          : 'rotate(0deg) scale(1)',
        transition: 'transform 0.2s ease',
        transformOrigin: 'bottom center',
        display: 'inline-block',
        width: '100%',
      }}
    >
      {coverSrc ? (
        <img
          src={coverSrc}
          alt={book.t}
          onError={() => setSrcIndex(i => i + 1)}
          style={{
            width: '100%', maxWidth: 140, display: 'block',
            borderRadius: 4,
            boxShadow: '0 6px 20px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.25)',
          }}
        />
      ) : (
        <div style={{
          width: '100%', maxWidth: 140, height: 190, borderRadius: 4,
          background: 'linear-gradient(135deg, #8B6040, #5C3A1E)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, padding: 8, textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
            {book.t}
          </span>
        </div>
      )}
      <p style={{
        margin: '7px 0 2px', fontSize: 12, fontWeight: 600,
        color: '#3A2010', fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1.3, maxWidth: 140,
        overflow: 'hidden', display: '-webkit-box',
        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
      }}>
        {book.t}
      </p>
      <p style={{
        margin: 0, fontSize: 11, color: '#7A5030',
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: 140, overflow: 'hidden',
        whiteSpace: 'nowrap', textOverflow: 'ellipsis',
      }}>
        {book.a}
      </p>
    </div>
  );
}
```

### Step 2: Add CurrentlyReadingPanel component

Insert directly after `CurrentlyReadingCard`:

```jsx
function CurrentlyReadingPanel({ books, onBookClick }) {
  return (
    <div className="cr-panel" style={{
      width: 180, flexShrink: 0,
      paddingTop: 4,
    }}>
      <h3 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        color: '#5C0F1E', fontSize: 15, fontWeight: 700,
        margin: '0 0 16px', letterSpacing: '-0.3px',
      }}>
        Currently Reading
      </h3>
      {books.length === 0 ? (
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: '#8B7355', fontSize: 14, fontStyle: 'italic',
          lineHeight: 1.5,
        }}>
          Nothing on the nightstand yet
        </p>
      ) : (
        books.map((book, i) => (
          <CurrentlyReadingCard
            key={book.id}
            book={book}
            onClick={() => onBookClick(book)}
            tiltRight={i % 2 === 0}
          />
        ))
      )}
    </div>
  );
}
```

### Step 3: Verify components exist
Run `npm run build` — should compile with no errors (the components aren't rendered yet, just defined).

### Step 4: Commit
```
git add src/App.jsx
git commit -m "feat: add CurrentlyReadingCard and CurrentlyReadingPanel components"
```

---

## Task 3: Add toggle to settings modal and wire up state

**Files:**
- Modify: `src/App.jsx` — SiteSettingsModal state + UI, and `handleSave`

### Step 1: Add state in SiteSettingsModal

In `SiteSettingsModal`, after the existing `const [garlandEnabled, ...]` state line, add:
```jsx
const [currentlyReadingEnabled, setCurrentlyReadingEnabled] = useState(settings.currentlyReadingEnabled || false);
```

### Step 2: Add to handleSave

In `handleSave`, add `currentlyReadingEnabled` to the `onSave` call:
```jsx
onSave({ name: name.trim() || "My Bookshelf", imageUrl, imagePosition, headerIcon: selectedIcon, garlandEnabled, profileImage, currentlyReadingEnabled });
```

### Step 3: Add toggle UI in the modal

In the settings modal JSX, directly after the garland toggle `<div>`, add:
```jsx
<div style={{ marginBottom: 20 }}>
  <label style={labelStyle}>Currently Reading Panel</label>
  <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
    <input
      type="checkbox"
      checked={currentlyReadingEnabled}
      onChange={e => setCurrentlyReadingEnabled(e.target.checked)}
      style={{ width: 16, height: 16, accentColor: "#D4A843", cursor: "pointer" }}
    />
    <span style={{ color: "#D4A843", fontSize: 13 }}>
      Show currently reading panel beside the bookshelf
    </span>
  </label>
</div>
```

### Step 4: Verify
Run `npm run dev`. Open Edit Profile — the new checkbox should appear below the garland toggle. Toggle it and Save — setting should persist on page refresh.

### Step 5: Commit
```
git add src/App.jsx
git commit -m "feat: add currently reading panel toggle to settings"
```

---

## Task 4: Two-column layout — bookshelf + Currently Reading panel

**Files:**
- Modify: `src/App.jsx` — bookshelf section wrapper (~line 2408), currently reading books derivation, panel rendering

### Step 1: Derive currently reading books

In the `App` component, after the `shelves` useMemo, add:
```jsx
const currentlyReadingBooks = useMemo(
  () => books.filter(b => b.s === 'currently-reading'),
  [books]
);
```

### Step 2: Add CSS for mobile panel (to existing `<style>` block)

In the `<style>` block inside the App JSX (around line 2237), append to the existing string:
```css
@media (max-width: 768px) {
  .bookshelf-row { flex-direction: column !important; }
  .cr-panel { width: 100% !important; overflow-x: auto; display: flex; flex-direction: row; gap: 16px; padding-bottom: 12px; }
  .cr-panel h3 { flex-shrink: 0; writing-mode: horizontal-tb; margin-bottom: 0; align-self: center; margin-right: 8px; }
}
```

### Step 3: Wrap bookshelf in flex row

Find the bookshelf outer container (the `{/* Bookshelf */}` div at ~line 2408):
```jsx
{/* Bookshelf */}
<div style={{ padding: "20px 20px 60px", maxWidth: 1100, margin: "0 auto", position: "relative" }}>
```

Replace with:
```jsx
{/* Bookshelf + Currently Reading row */}
<div
  className="bookshelf-row"
  style={{
    display: 'flex',
    gap: 24,
    alignItems: 'flex-start',
    padding: "20px 20px 60px",
    maxWidth: siteSettings.currentlyReadingEnabled ? 1360 : 1100,
    margin: "0 auto",
    transition: 'max-width 0.35s ease',
    position: "relative",
  }}
>
  <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
```

Then find the closing `</div>` of that bookshelf container (the one ending after the vignette overlay, `</div>` at ~line 2465) and add **after** it (before the closing `</div>` of the new flex row):
```jsx
  </div>{/* end bookshelf column */}

  {siteSettings.currentlyReadingEnabled && (
    <CurrentlyReadingPanel
      books={currentlyReadingBooks}
      onBookClick={(book) => {
        setPulledBookId(book.id);
        setSelectedBookId(book.id);
      }}
    />
  )}
</div>{/* end bookshelf-row */}
```

**Important:** The original closing `</div>` for the old bookshelf padding container must be removed — it is replaced by `</div>{/* end bookshelf column */}` above.

### Step 4: Verify
Run `npm run dev`. Enable the toggle in settings — the bookshelf should shift left and the Currently Reading panel should appear to the right. Covers should load for any currently-reading books. Hover over a cover — it should tilt. Click a cover — BookModal opens. On a narrow window (< 768px), the panel should appear below the bookshelf.

### Step 5: Commit
```
git add src/App.jsx
git commit -m "feat: two-column layout with currently reading panel, toggled from settings"
```

---

## Task 5: Mobile — NavPanel top bar

**Files:**
- Modify: `src/components/NavPanel.jsx` — add className attributes and a `<style>` block with @media rules

### Step 1: Add `<style>` block and classNames

Replace the entire NavPanel component with:
```jsx
export default function NavPanel({ currentView, onNavigate }) {
  return (
    <>
      <style>{`
        .nav-panel {
          position: fixed;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 200;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(255,251,245,0.6);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          padding: 10px 6px;
          box-shadow: 0 4px 24px rgba(80,40,20,0.18), 0 1px 4px rgba(80,40,20,0.08);
          border: 1px solid rgba(200,160,120,0.35);
        }
        .nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 9px 10px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.18s;
          min-width: 54px;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          line-height: 1;
        }
        @media (max-width: 768px) {
          .nav-panel {
            left: 0;
            right: 0;
            top: 0;
            transform: none;
            flex-direction: row;
            justify-content: center;
            border-radius: 0 0 16px 16px;
            padding: 6px 8px;
            gap: 2px;
          }
          .nav-btn {
            padding: 7px 10px;
            min-width: 48px;
          }
        }
      `}</style>
      <div className="nav-panel">
        {NAV_ITEMS.map(({ key, Icon, label }) => {
          const active = currentView === key;
          return (
            <button
              key={key}
              className="nav-btn"
              onClick={() => onNavigate(key)}
              title={label}
              style={{
                background: active ? '#8B2840' : 'transparent',
                color: active ? '#FDF0F3' : '#6B3520',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(139,40,64,0.10)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon />
              <span className="nav-label">{label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
```

### Step 2: Add mobile top-padding to page on mobile

In App.jsx's `<style>` block, append:
```css
@media (max-width: 768px) {
  .page-root { padding-top: 64px; }
}
```

Then add `className="page-root"` to the outermost page `<div>` (the one with `minHeight: "100vh"`, `backgroundColor: "#F2E8D9"`, ~line 2219).

### Step 3: Verify
Run `npm run dev`. Resize browser to < 768px — NavPanel should appear as a horizontal bar at the top. Page content should clear it. At > 768px — NavPanel should be the left pill as before.

### Step 4: Commit
```
git add src/components/NavPanel.jsx src/App.jsx
git commit -m "fix: NavPanel becomes top bar on mobile"
```

---

## Task 6: Mobile — stats, filters, and bookshelf

**Files:**
- Modify: `src/App.jsx` — add classNames to stats/filter/bookshelf elements, add @media rules to `<style>` block

### Step 1: Add classNames to key layout elements

Add `className="stats-bar-wrap"` to the StatsBar wrapper div (~line 2302):
```jsx
<div className="stats-bar-wrap" style={{ position: "relative", zIndex: 1, paddingBottom: 14 }}>
```

Add `className="controls-wrap"` to the controls container div (~line 2314):
```jsx
<div className="controls-wrap" style={{ padding: "12px 20px 8px", maxWidth: 900, margin: "0 auto" }}>
```

### Step 2: Add @media rules to `<style>` block

Append to the existing CSS in the `<style>` block:
```css
@media (max-width: 768px) {
  .stats-bar-wrap { padding: 0 8px 14px; box-sizing: border-box; }
  .controls-wrap { padding: 10px 10px 6px; box-sizing: border-box; width: 100%; }
  .bookshelf-row { padding: 10px 8px 40px !important; }
}
```

### Step 3: Verify
Run `npm run dev` on mobile viewport. Stats bar should fill the screen width without overflowing. Filter pills and search bar should be properly padded. Bookshelf should fill the screen with edge padding. Horizontal shelf scroll should still work when books overflow.

### Step 4: Final build check
```
npm run build
```
Expected: clean build, no errors, only the existing chunk-size warning.

### Step 5: Commit and push
```
git add src/App.jsx src/components/NavPanel.jsx
git commit -m "fix: mobile layout — stats, filters and bookshelf fill viewport correctly"
git push
```

---

## Summary of commits
1. `fix: modals only close on Escape or explicit buttons`
2. `feat: add CurrentlyReadingCard and CurrentlyReadingPanel components`
3. `feat: add currently reading panel toggle to settings`
4. `feat: two-column layout with currently reading panel`
5. `fix: NavPanel becomes top bar on mobile`
6. `fix: mobile layout — stats, filters and bookshelf`
