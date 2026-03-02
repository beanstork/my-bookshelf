# Visual Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply 8 visual improvements to the bookshelf app: book packing, header tightening, stats colour/emoji/new stat, button colour, wood frame border, and mossy texture.

**Architecture:** All changes are in `src/App.jsx` inline styles and the `StatsBar` component. No new files needed. Changes are purely cosmetic — no logic changes except adding the Printed Books stat count.

**Tech Stack:** React 18, Vite, inline styles throughout (no CSS-in-JS library, no Tailwind).

---

### Task 1: Books — packed left, increased shelf density

**Files:**
- Modify: `src/App.jsx` — `Shelf` component (~line 455) and `shelves` memo (~line 612)

**Step 1: Change books row from space-between to flex-start with gap**

Find in `Shelf` component:
```jsx
display: "flex", alignItems: "flex-end", justifyContent: "space-between",
padding: "0 12px", minHeight: 170,
flexWrap: "nowrap", overflowX: "auto",
```
Replace with:
```jsx
display: "flex", alignItems: "flex-end", justifyContent: "flex-start", gap: 3,
padding: "0 12px", minHeight: 170,
flexWrap: "nowrap", overflowX: "auto",
```

**Step 2: Increase booksPerShelf from 14 to 20**

Find in `shelves` useMemo:
```js
const booksPerShelf = 14;
```
Replace with:
```js
const booksPerShelf = 20;
```

**Step 3: Verify visually**
Run `npm run dev`, open browser. Books should be packed left with small gaps, shelves should be denser.

**Step 4: Commit**
```bash
git add src/App.jsx
git commit -m "fix: pack books left on shelf, increase density to 20 per shelf"
```

---

### Task 2: Header — reduce bottom padding

**Files:**
- Modify: `src/App.jsx` — header div (~line 665)

**Step 1: Tighten header bottom padding**

Find:
```jsx
padding: "48px 20px 32px", textAlign: "center",
```
Replace with:
```jsx
padding: "32px 20px 12px", textAlign: "center",
```

**Step 2: Verify visually**
The pink header should be noticeably shorter at the bottom, making the stats bar border more visible.

**Step 3: Commit**
```bash
git add src/App.jsx
git commit -m "fix: reduce header bottom padding to expose stats border"
```

---

### Task 3: Stats — darker colour

**Files:**
- Modify: `src/App.jsx` — `StatsBar` component (~line 513-514)

**Step 1: Update stat value colour**

Find:
```jsx
<div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#D4A843", fontSize: 22, fontWeight: 700 }}>{s.value}</div>
<div style={{ fontFamily: "'DM Sans', sans-serif", color: "#8B7355", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>{s.label}</div>
```
Replace with:
```jsx
<div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#7A5510", fontSize: 22, fontWeight: 700 }}>{s.value}</div>
<div style={{ fontFamily: "'DM Sans', sans-serif", color: "#5A3E0A", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>{s.label}</div>
```

**Step 2: Verify visually**
Stat numbers and labels should appear in a darker amber-brown tone.

**Step 3: Commit**
```bash
git add src/App.jsx
git commit -m "fix: darken stats text to amber-brown"
```

---

### Task 4: Stats — emoji changes (Avg Rating and 5-Star Reads)

**Files:**
- Modify: `src/App.jsx` — `StatsBar` stats array (~line 493-497)

**Step 1: Update emojis**

Find:
```jsx
{ label: "Avg Rating", value: avgRating, icon: "⭐" },
{ label: "5-Star Reads", value: fiveStars, icon: "🌟" },
```
Replace with:
```jsx
{ label: "Avg Rating", value: avgRating, icon: "🌡️" },
{ label: "5-Star Reads", value: fiveStars, icon: "⭐⭐⭐⭐⭐" },
```

**Step 2: Scale down icon font size for the 5-star cell**

The five-star icon is wide so the icon div needs `fontSize: 14` for that cell, otherwise it wraps. Update the icon rendering to handle variable size:

Find:
```jsx
<div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
```
Replace with:
```jsx
<div style={{ fontSize: s.icon.length > 2 ? 13 : 20, marginBottom: 4, lineHeight: 1.4 }}>{s.icon}</div>
```

**Step 3: Verify visually**
Avg Rating should show a thermometer. 5-Star Reads should show five star emojis on one line.

**Step 4: Commit**
```bash
git add src/App.jsx
git commit -m "fix: update stats emojis - thermometer for avg rating, five stars for 5-star reads"
```

---

### Task 5: Stats — add Printed Books stat (no border between Audiobooks and Printed Books)

**Files:**
- Modify: `src/App.jsx` — `StatsBar` function (~line 484-519)

**Step 1: Add printedBooks count**

Find inside `StatsBar`:
```js
const audiobooks = books.filter(b => b.au && b.s === "read");
```
Add after:
```js
const printedBooks = books.filter(b => !b.au && b.s === "read");
```

**Step 2: Insert the new stat into the array after Audiobooks**

Find:
```jsx
{ label: "Audiobooks", value: audiobooks.length, icon: "🎧" },
{ label: "Avg Rating", value: avgRating, icon: "🌡️" },
```
Replace with:
```jsx
{ label: "Audiobooks", value: audiobooks.length, icon: "🎧" },
{ label: "Printed Books", value: printedBooks.length, icon: "📖", noLeftBorder: true },
{ label: "Avg Rating", value: avgRating, icon: "🌡️" },
```

**Step 3: Update the border logic to respect the noLeftBorder flag**

Find:
```jsx
<div key={s.label} style={{
  padding: "16px 24px", textAlign: "center", flex: 1, minWidth: 100,
  borderRight: i < stats.length - 1 ? "1px solid rgba(0,0,0,0.1)" : "none",
}}>
```
Replace with:
```jsx
<div key={s.label} style={{
  padding: "16px 24px", textAlign: "center", flex: 1, minWidth: 100,
  borderRight: i < stats.length - 1 ? "1px solid rgba(0,0,0,0.1)" : "none",
  borderLeft: s.noLeftBorder ? "none" : undefined,
  marginLeft: s.noLeftBorder ? -1 : 0,
}}>
```

Note: The right border on the Audiobooks cell will render, but the Printed Books cell has no left border and a -1 margin to visually merge them. To actually suppress the divider between them, a cleaner approach is to remove the right border from Audiobooks when the next stat is `noLeftBorder`. Update the border logic:

```jsx
borderRight: (i < stats.length - 1 && !stats[i + 1]?.noLeftBorder) ? "1px solid rgba(0,0,0,0.1)" : "none",
```

**Step 4: Verify visually**
Six stats visible. Audiobooks and Printed Books share a segment with no divider between them.

**Step 5: Commit**
```bash
git add src/App.jsx
git commit -m "feat: add Printed Books stat, grouped with Audiobooks segment"
```

---

### Task 6: Add Book button — darker gold

**Files:**
- Modify: `src/App.jsx` — Add Book button (~line 759)

**Step 1: Update button gradient**

Find:
```jsx
background: "linear-gradient(135deg, #D4A843, #B8860B)",
```
Replace with:
```jsx
background: "linear-gradient(135deg, #8B6014, #5A3E00)",
```

**Step 2: Verify visually**
Button should be a rich dark golden-brown rather than bright yellow-gold.

**Step 3: Commit**
```bash
git add src/App.jsx
git commit -m "fix: darken Add Book button to deep amber-brown"
```

---

### Task 7: Bookshelf — thick wood frame border

**Files:**
- Modify: `src/App.jsx` — bookshelf section (~line 772)

**Step 1: Wrap the back panel in a wood frame div**

Find:
```jsx
{/* Bookshelf */}
<div style={{ padding: "20px 20px 60px", maxWidth: 1100, margin: "0 auto" }}>
  {/* Back panel texture */}
  <div style={{
    backgroundColor: "#3D1215",
    ...
  }}>
```
Replace with:
```jsx
{/* Bookshelf */}
<div style={{ padding: "20px 20px 60px", maxWidth: 1100, margin: "0 auto" }}>
  {/* Wood frame */}
  <div style={{
    padding: 18,
    background: "linear-gradient(135deg, #8B3030 0%, #6B2225 30%, #5C1A1E 60%, #6B2225 80%, #7B2A2E 100%)",
    borderRadius: 14,
    boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,180,160,0.15), inset 0 -2px 4px rgba(0,0,0,0.4)",
    border: "1px solid #8B3535",
  }}>
  {/* Back panel texture */}
  <div style={{
    backgroundColor: "#3D1215",
    ...
  }}>
```

**Step 2: Close the new wood frame div**

Find the closing `</div>` that closes the back panel, and add another `</div>` after it to close the wood frame:

Find:
```jsx
        </div>

        {/* Count */}
```
Replace with:
```jsx
        </div>
        </div>{/* end wood frame */}

        {/* Count */}
```

**Step 3: Verify visually**
The bookshelf should appear framed in a thick cherry-wood surround, like a real bookcase unit.

**Step 4: Commit**
```bash
git add src/App.jsx
git commit -m "feat: add thick cherry wood frame border around bookshelf"
```

---

### Task 8: Mossy texture on light green controls band

**Files:**
- Modify: `src/App.jsx` — controls band div (~line 691)

**Step 1: Replace the existing grain texture SVG with a mossy blob pattern**

Find the `backgroundImage` value on the controls band div (the one with `backgroundColor: "#bad9b9"`). Replace the existing SVG data URI with a mossy pattern:

```jsx
backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cellipse cx='30' cy='40' rx='18' ry='12' fill='rgba(46,80,50,0.07)' opacity='0.8'/%3E%3Cellipse cx='90' cy='25' rx='14' ry='9' fill='rgba(46,80,50,0.06)'/%3E%3Cellipse cx='150' cy='55' rx='20' ry='11' fill='rgba(46,80,50,0.07)'/%3E%3Cellipse cx='60' cy='90' rx='16' ry='10' fill='rgba(46,80,50,0.05)'/%3E%3Cellipse cx='130' cy='100' rx='12' ry='8' fill='rgba(46,80,50,0.07)'/%3E%3Cellipse cx='20' cy='130' rx='15' ry='10' fill='rgba(46,80,50,0.06)'/%3E%3Cellipse cx='100' cy='150' rx='18' ry='11' fill='rgba(46,80,50,0.07)'/%3E%3Cellipse cx='165' cy='140' rx='13' ry='9' fill='rgba(46,80,50,0.05)'/%3E%3Cellipse cx='50' cy='165' rx='11' ry='7' fill='rgba(46,80,50,0.06)'/%3E%3Cellipse cx='145' cy='170' rx='16' ry='10' fill='rgba(46,80,50,0.07)'/%3E%3C/svg%3E")`,
```

**Step 2: Verify visually**
The light green band should have a subtle organic, mossy pattern — like soft lichen patches on stone.

**Step 3: Commit**
```bash
git add src/App.jsx
git commit -m "fix: replace grain texture with mossy blob pattern on controls band"
```
