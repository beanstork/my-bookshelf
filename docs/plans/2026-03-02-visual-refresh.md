# Visual Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Apply 7 visual improvements: cherry tree photo header, sunset coral controls band, papyrus background, alternating bookends on shelves, larger book spine titles, palette-matched buttons, and maple-wood bookshelf.

**Architecture:** All changes are in `src/App.jsx` — inline styles and the `Shelf`/`BookSpine` components. One image import is added at the top of the file. No new files, no logic changes, purely cosmetic.

**Tech Stack:** React 18, Vite, inline styles throughout. The cherry tree image at `images/cherry tree.jpg` is imported via Vite's asset pipeline.

---

### Task 1: Cherry tree photo header with rounded bottom corners

**Files:**
- Modify: `src/App.jsx` — line 1 (add import) and lines 666–690 (header div)

**Step 1: Add image import at the very top of the file**

Find the first line of the file:
```js
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
```
Replace with:
```js
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import cherryTreeImg from '../images/cherry tree.jpg';
```

**Step 2: Replace the header div**

Find:
```jsx
      {/* Header */}
      <div style={{
        padding: "32px 20px 12px", textAlign: "center",
        backgroundColor: "#fce4ef",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cg transform='translate(80,75)' fill='rgb(212,120,154)'%3E%3Cellipse cx='0' cy='-20' rx='8' ry='13' opacity='0.15'/%3E%3Cellipse cx='0' cy='-20' rx='8' ry='13' opacity='0.15' transform='rotate(72)'/%3E%3Cellipse cx='0' cy='-20' rx='8' ry='13' opacity='0.15' transform='rotate(144)'/%3E%3Cellipse cx='0' cy='-20' rx='8' ry='13' opacity='0.15' transform='rotate(216)'/%3E%3Cellipse cx='0' cy='-20' rx='8' ry='13' opacity='0.15' transform='rotate(288)'/%3E%3C/g%3E%3Ccircle cx='80' cy='75' r='4' fill='rgb(240,160,184)' opacity='0.25'/%3E%3Cellipse cx='22' cy='130' rx='4' ry='7' transform='rotate(25 22 130)' fill='rgb(212,120,154)' opacity='0.1'/%3E%3Cellipse cx='140' cy='28' rx='5' ry='8' transform='rotate(-15 140 28)' fill='rgb(212,120,154)' opacity='0.1'/%3E%3Cellipse cx='12' cy='48' rx='3' ry='5' transform='rotate(40 12 48)' fill='rgb(212,120,154)' opacity='0.07'/%3E%3Cellipse cx='148' cy='122' rx='4' ry='6' transform='rotate(-30 148 122)' fill='rgb(212,120,154)' opacity='0.08'/%3E%3C/svg%3E")`,
        backgroundSize: "160px 160px",
        backgroundRepeat: "repeat",
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: "#8B1A2A", fontSize: 42, fontWeight: 900, margin: 0,
          letterSpacing: "-1px",
          WebkitTextStroke: "1.5px #1a0810",
          paintOrder: "stroke fill",
        }}>
          My Bookshelf
        </h1>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: "#7B3050", fontSize: 18, margin: "8px 0 0", fontStyle: "italic",
        }}>
          Read, Listen, Share
        </p>
      </div>
```
Replace with:
```jsx
      {/* Header */}
      <div style={{
        padding: "36px 20px 24px", textAlign: "center",
        position: "relative", overflow: "hidden",
        borderRadius: "0 0 40px 40px",
      }}>
        {/* Cherry tree photo */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("${cherryTreeImg}")`,
          backgroundSize: "cover",
          backgroundPosition: "center 22%",
          backgroundRepeat: "no-repeat",
        }} />
        {/* Gradient overlay — lighter at top to show branches, denser at bottom for text */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(252,228,239,0.38) 0%, rgba(252,210,220,0.68) 60%, rgba(248,220,225,0.82) 100%)",
        }} />
        {/* Content sits above overlays */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: "#5C0F1E", fontSize: 42, fontWeight: 900, margin: 0,
            letterSpacing: "-1px",
            WebkitTextStroke: "1.5px #1a0810",
            paintOrder: "stroke fill",
            textShadow: "0 2px 14px rgba(252,228,239,0.9), 0 1px 4px rgba(252,228,239,0.7)",
          }}>
            My Bookshelf
          </h1>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "#6B2030", fontSize: 18, margin: "8px 0 0", fontStyle: "italic",
            textShadow: "0 1px 6px rgba(252,228,239,0.95)",
          }}>
            Read, Listen, Share
          </p>
        </div>
      </div>
```

**Step 3: Verify visually**
Run `npm run dev`. The header should show the cherry tree photo (upper canopy and sky) with a soft pink wash, the title clearly readable, and the bottom corners curving into the page.

**Step 4: Commit**
```bash
git add src/App.jsx
git commit -m "feat: replace header with cherry tree photo, rounded bottom corners"
```

---

### Task 2: Sunset coral controls band + contrast-safe stat text

**Files:**
- Modify: `src/App.jsx` — stats/controls band (~line 693), StatsBar colors (~lines 508–519)

**Step 1: Update the controls band to sunset coral, add gap, remove moss texture**

Find:
```jsx
      {/* Stats + Controls band */}
      <div style={{
        backgroundColor: "#bad9b9",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cellipse cx='30' cy='40' rx='18' ry='12' fill='rgba(46,80,50,0.07)' opacity='0.8'/%3E%3Cellipse cx='90' cy='25' rx='14' ry='9' fill='rgba(46,80,50,0.06)'/%3E%3Cellipse cx='150' cy='55' rx='20' ry='11' fill='rgba(46,80,50,0.07)'/%3E%3Cellipse cx='60' cy='90' rx='16' ry='10' fill='rgba(46,80,50,0.05)'/%3E%3Cellipse cx='130' cy='100' rx='12' ry='8' fill='rgba(46,80,50,0.07)'/%3E%3Cellipse cx='20' cy='130' rx='15' ry='10' fill='rgba(46,80,50,0.06)'/%3E%3Cellipse cx='100' cy='150' rx='18' ry='11' fill='rgba(46,80,50,0.07)'/%3E%3Cellipse cx='165' cy='140' rx='13' ry='9' fill='rgba(46,80,50,0.05)'/%3E%3Cellipse cx='50' cy='165' rx='11' ry='7' fill='rgba(46,80,50,0.06)'/%3E%3Cellipse cx='145' cy='170' rx='16' ry='10' fill='rgba(46,80,50,0.07)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        paddingBottom: 16,
      }}>
```
Replace with:
```jsx
      {/* Stats + Controls band */}
      <div style={{
        backgroundColor: "#F5C4A0",
        marginTop: 12,
        paddingBottom: 16,
      }}>
```

**Step 2: Update StatsBar container and text colors**

Find:
```jsx
    <div style={{
      display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap",
      background: "rgba(255,255,255,0.25)", borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.4)", overflow: "hidden",
      margin: "0 20px",
    }}>
```
Replace with:
```jsx
    <div style={{
      display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap",
      background: "rgba(255,255,255,0.35)", borderRadius: 12,
      border: "1px solid rgba(200,140,100,0.3)", overflow: "hidden",
      margin: "0 20px",
    }}>
```

Find:
```jsx
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#7A5510", fontSize: 22, fontWeight: 700 }}>{s.value}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#5A3E0A", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>{s.label}</div>
```
Replace with:
```jsx
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#5C2010", fontSize: 22, fontWeight: 700 }}>{s.value}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#6B3520", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>{s.label}</div>
```

**Step 3: Verify visually**
The stats/controls area should be a warm peachy-coral, with darker readable stat text. A visible gap sits between the curved pink header and the coral band.

**Step 4: Commit**
```bash
git add src/App.jsx
git commit -m "fix: coral controls band, gap below header, darkened stat text"
```

---

### Task 3: Papyrus beige background + palette-wide global styles

**Files:**
- Modify: `src/App.jsx` — outer App div (~line 646), global `<style>` block (~lines 653–664), pillStyle (~line 636), search/sort inputs (~lines 710–758), "Showing X books" counter (~line 807)

**Step 1: Update outer background to papyrus beige with paper-fibre texture**

Find:
```jsx
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#2e4130",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Ccircle cx='20' cy='35' r='1.2' fill='rgba(255,255,255,0.04)'/%3E%3Ccircle cx='65' cy='18' r='1' fill='rgba(255,255,255,0.05)'/%3E%3Ccircle cx='85' cy='72' r='1.2' fill='rgba(255,255,255,0.03)'/%3E%3Ccircle cx='42' cy='88' r='1' fill='rgba(255,255,255,0.04)'/%3E%3Ccircle cx='98' cy='50' r='1.2' fill='rgba(255,255,255,0.04)'/%3E%3Ccircle cx='15' cy='65' r='1' fill='rgba(255,255,255,0.03)'/%3E%3Ccircle cx='55' cy='55' r='1' fill='rgba(255,255,255,0.05)'/%3E%3Ccircle cx='75' cy='100' r='1.2' fill='rgba(255,255,255,0.03)'/%3E%3Ccircle cx='5' cy='12' r='1' fill='rgba(255,255,255,0.04)'/%3E%3Ccircle cx='110' cy='90' r='1' fill='rgba(255,255,255,0.04)'/%3E%3Ccircle cx='30' cy='110' r='1.2' fill='rgba(255,255,255,0.03)'/%3E%3Ccircle cx='95' cy='8' r='1' fill='rgba(255,255,255,0.04)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      fontFamily: "'DM Sans', sans-serif",
    }}>
```
Replace with:
```jsx
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F2E8D9",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Cline x1='0' y1='10' x2='200' y2='8' stroke='rgba(160,120,70,0.07)' stroke-width='0.7'/%3E%3Cline x1='0' y1='22' x2='200' y2='24' stroke='rgba(140,100,55,0.05)' stroke-width='0.5'/%3E%3Cline x1='0' y1='35' x2='200' y2='33' stroke='rgba(160,120,70,0.06)' stroke-width='0.6'/%3E%3Cline x1='0' y1='48' x2='200' y2='50' stroke='rgba(140,100,55,0.05)' stroke-width='0.5'/%3E%3Cline x1='0' y1='62' x2='200' y2='60' stroke='rgba(160,120,70,0.07)' stroke-width='0.7'/%3E%3Cline x1='0' y1='75' x2='200' y2='77' stroke='rgba(140,100,55,0.04)' stroke-width='0.4'/%3E%3Cline x1='0' y1='88' x2='200' y2='86' stroke='rgba(160,120,70,0.06)' stroke-width='0.6'/%3E%3Cline x1='43' y1='0' x2='45' y2='100' stroke='rgba(160,120,70,0.03)' stroke-width='0.4'/%3E%3Cline x1='120' y1='0' x2='122' y2='100' stroke='rgba(140,100,55,0.03)' stroke-width='0.3'/%3E%3Cline x1='173' y1='0' x2='175' y2='100' stroke='rgba(160,120,70,0.025)' stroke-width='0.3'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      fontFamily: "'DM Sans', sans-serif",
    }}>
```

**Step 2: Update global styles (scrollbar + select option)**

Find:
```jsx
        * { scrollbar-width: thin; scrollbar-color: #4a6b4a #2e4130; }
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track { background: #2e4130; }
        *::-webkit-scrollbar-thumb { background: #4a6b4a; border-radius: 3px; }
        input:focus, select:focus, textarea:focus { border-color: #D4A843 !important; box-shadow: 0 0 0 2px rgba(212,168,67,0.15); }
        select option { background: #1A120B; color: #E8D5B7; }
```
Replace with:
```jsx
        * { scrollbar-width: thin; scrollbar-color: #C4A882 #F2E8D9; }
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track { background: #F2E8D9; }
        *::-webkit-scrollbar-thumb { background: #C4A882; border-radius: 3px; }
        input:focus, select:focus, textarea:focus { border-color: #A0445A !important; box-shadow: 0 0 0 2px rgba(160,68,90,0.15); }
        select option { background: #F2E8D9; color: #3A2515; }
```

**Step 3: Update pill filter button styles**

Find:
```jsx
  const pillStyle = (active) => ({
    padding: "6px 16px", borderRadius: 20, border: "1px solid",
    borderColor: active ? "#2e4130" : "rgba(46,65,48,0.35)",
    background: active ? "rgba(46,65,48,0.18)" : "transparent",
    color: active ? "#1a3020" : "#3d5a40",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer",
    transition: "all 0.2s", flex: 1, textAlign: "center",
  });
```
Replace with:
```jsx
  const pillStyle = (active) => ({
    padding: "6px 16px", borderRadius: 20, border: "1px solid",
    borderColor: active ? "#8B2840" : "rgba(120,50,60,0.35)",
    background: active ? "rgba(139,40,64,0.12)" : "transparent",
    color: active ? "#6B1830" : "#7A3040",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer",
    transition: "all 0.2s", flex: 1, textAlign: "center",
  });
```

**Step 4: Update search input border/placeholder colour**

Find:
```jsx
              border: "1px solid rgba(46,65,48,0.3)", background: "rgba(255,255,255,0.55)",
              color: "#1a3020", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
```
Replace with:
```jsx
              border: "1px solid rgba(120,70,50,0.3)", background: "rgba(255,255,255,0.65)",
              color: "#3A2010", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
```

**Step 5: Update sort/genre label text and select colours**

Find (the Sort label span):
```jsx
            <span style={{ color: "#3d5a40", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Sort</span>
```
Replace with:
```jsx
            <span style={{ color: "#6B3520", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Sort</span>
```

Find (the Genre label span):
```jsx
            <span style={{ color: "#3d5a40", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Genre</span>
```
Replace with:
```jsx
            <span style={{ color: "#6B3520", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>Genre</span>
```

Find (sort select style — first select):
```jsx
              padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(46,65,48,0.3)",
              background: "rgba(255,255,255,0.55)", color: "#1a3020", fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none",
            }}>
              <option value="dateRead">Date Read</option>
```
Replace with:
```jsx
              padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(120,70,50,0.3)",
              background: "rgba(255,255,255,0.65)", color: "#3A2010", fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none",
            }}>
              <option value="dateRead">Date Read</option>
```

Find (genre select style — second select):
```jsx
              padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(46,65,48,0.3)",
              background: "rgba(255,255,255,0.55)", color: "#1a3020", fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none",
            }}>
              <option value="all">All Genres</option>
```
Replace with:
```jsx
              padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(120,70,50,0.3)",
              background: "rgba(255,255,255,0.65)", color: "#3A2010", fontSize: 13,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none",
            }}>
              <option value="all">All Genres</option>
```

**Step 6: Update "Showing X books" counter colour**

Find:
```jsx
        <div style={{ textAlign: "center", marginTop: 20, color: "#5A4A3A", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
```
Replace with:
```jsx
        <div style={{ textAlign: "center", marginTop: 20, color: "#4A3020", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
```

**Step 7: Verify visually**
Background should look like warm parchment/papyrus paper. Filter buttons, labels, and counter text all readable in dark warm-brown.

**Step 8: Commit**
```bash
git add src/App.jsx
git commit -m "fix: papyrus beige background, warm palette for controls, legibility pass"
```

---

### Task 4: Alternating bookends on shelves

**Files:**
- Modify: `src/App.jsx` — `Shelf` component (~lines 451–485)

**Step 1: Replace the Shelf component entirely**

Find:
```jsx
function Shelf({ books, onBookClick, shelfIndex }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {/* Books row */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "flex-start", gap: 3,
        padding: "0 12px", minHeight: 170,
        flexWrap: "nowrap", overflowX: "auto",
      }}>
        {books.map((book, i) => (
          <BookSpine key={book.id} book={book} onClick={onBookClick} index={shelfIndex * 20 + i} />
        ))}
      </div>
```
Replace with:
```jsx
function Shelf({ books, onBookClick, shelfIndex }) {
  const isRight = shelfIndex % 2 === 0;
  const shapeIndex = shelfIndex % 4;

  // Four bookend shapes cycling per shelf
  const bookendShape = [
    // 0: doorstop — angled top-left corner, sits on right
    { clipPath: "polygon(20% 6%, 100% 0%, 100% 100%, 0% 100%)", borderRadius: "2px 4px 4px 2px" },
    // 1: arch top — rounded peak, sits on left
    { borderRadius: "44% 44% 4px 4px" },
    // 2: double-step — notched top corner, sits on right
    { borderRadius: "4px 20px 4px 4px" },
    // 3: wedge — slanted opposite way, sits on left
    { clipPath: "polygon(0% 0%, 80% 12%, 100% 12%, 100% 100%, 0% 100%)", borderRadius: "4px 2px 2px 4px" },
  ][shapeIndex];

  const bookendStyle = {
    width: 26,
    height: 130,
    alignSelf: "flex-end",
    flexShrink: 0,
    background: "linear-gradient(180deg, #D4BC96 0%, #C4A882 25%, #B89A70 65%, #A88055 100%)",
    boxShadow: isRight
      ? "-4px 4px 10px rgba(0,0,0,0.38), inset 2px 0 4px rgba(255,220,180,0.2)"
      : "4px 4px 10px rgba(0,0,0,0.38), inset -2px 0 4px rgba(255,220,180,0.2)",
    ...bookendShape,
  };

  return (
    <div style={{ marginBottom: 8 }}>
      {/* Books row */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "flex-start", gap: 3,
        padding: "0 12px", minHeight: 170,
        flexWrap: "nowrap", overflowX: "auto",
      }}>
        {!isRight && <div style={bookendStyle} />}
        {books.map((book, i) => (
          <BookSpine key={book.id} book={book} onClick={onBookClick} index={shelfIndex * 20 + i} />
        ))}
        {isRight && <div style={bookendStyle} />}
      </div>
```

**Step 2: Verify visually**
Shelf 1 (index 0): doorstop bookend on right. Shelf 2 (index 1): arch bookend on left. Shelf 3 (index 2): stepped bookend on right. Shelf 4 (index 3): wedge bookend on left. Each bookend has a warm maple gradient and a drop shadow.

**Step 3: Commit**
```bash
git add src/App.jsx
git commit -m "feat: alternating shaped bookends on each shelf"
```

---

### Task 5: Book spine — remove author, increase title size

**Files:**
- Modify: `src/App.jsx` — `BookSpine` component (~lines 145–168)

**Step 1: Increase title font size and remove author div**

Find:
```jsx
      <div style={{
        writingMode: "vertical-rl", textOrientation: "mixed",
        color: textColor, fontFamily: "'Libre Baskerville', 'Georgia', serif",
        fontSize: width < 28 ? 9 : 11, fontWeight: 600,
        letterSpacing: "0.5px",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        maxHeight: height - 50,
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        lineHeight: 1.2,
      }}>
        {book.t}
      </div>
      <div style={{
        writingMode: "vertical-rl", textOrientation: "mixed",
        color: textColor, fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: width < 28 ? 7 : 8, fontWeight: 400,
        opacity: 0.7, marginTop: 6,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        maxHeight: 60,
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
      }}>
        {book.a.split(' ').pop()}
      </div>
```
Replace with:
```jsx
      <div style={{
        writingMode: "vertical-rl", textOrientation: "mixed",
        color: textColor, fontFamily: "'Libre Baskerville', 'Georgia', serif",
        fontSize: width < 28 ? 11 : 14, fontWeight: 600,
        letterSpacing: "0.5px",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        maxHeight: height - 40,
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
        lineHeight: 1.2,
      }}>
        {book.t}
      </div>
```

**Step 2: Verify visually**
Book titles should be noticeably larger and legible on spine. No author text appears.

**Step 3: Commit**
```bash
git add src/App.jsx
git commit -m "fix: larger book spine titles, remove author text"
```

---

### Task 6: Add Book button — flat rose colour, both buttons

**Files:**
- Modify: `src/App.jsx` — Add Book trigger button (~line 761), Add to Bookshelf submit button (~line 436)

**Step 1: Update the "+ Add Book" trigger button**

Find:
```jsx
          <button onClick={() => setShowAddForm(true)} style={{
            padding: "8px 20px", borderRadius: 8,
            background: "linear-gradient(135deg, #8B6014, #5A3E00)",
            border: "none", color: "#1A120B", fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(212,168,67,0.3)",
          }}>
```
Replace with:
```jsx
          <button onClick={() => setShowAddForm(true)} style={{
            padding: "8px 20px", borderRadius: 8,
            background: "#A0445A",
            border: "none", color: "#F9EDE8", fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(160,68,90,0.3)",
          }}>
```

**Step 2: Update the "Add to Bookshelf" submit button inside AddBookForm**

Find:
```jsx
          <button onClick={handleSubmit} style={{
            background: "linear-gradient(135deg, #8B6014, #5A3E00)", border: "none",
            borderRadius: 8, padding: "12px 24px", color: "#F5E6C8",
```
Replace with:
```jsx
          <button onClick={handleSubmit} style={{
            background: "#A0445A", border: "none",
            borderRadius: 8, padding: "12px 24px", color: "#F9EDE8",
```

**Step 3: Verify visually**
Both buttons should be a flat dusty rose that reads clearly against the coral and papyrus backgrounds.

**Step 4: Commit**
```bash
git add src/App.jsx
git commit -m "fix: flat rose colour on Add Book buttons"
```

---

### Task 7: Maple/bench-tone bookshelf colours

**Files:**
- Modify: `src/App.jsx` — wood frame div (~line 777), shelf plank (~line 465), back panel (~line 785)

**Step 1: Update the wood frame to warm bench-tone maple**

Find:
```jsx
        <div style={{
          padding: 18,
          background: "linear-gradient(135deg, #8B3030 0%, #6B2225 30%, #5C1A1E 60%, #6B2225 80%, #7B2A2E 100%)",
          borderRadius: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,180,160,0.15), inset 0 -2px 4px rgba(0,0,0,0.4)",
          border: "1px solid #8B3535",
        }}>
```
Replace with:
```jsx
        <div style={{
          padding: 18,
          background: "linear-gradient(135deg, #C8A878 0%, #B89060 30%, #A87A48 60%, #B89060 80%, #C4A070 100%)",
          borderRadius: 14,
          boxShadow: "0 8px 32px rgba(80,50,20,0.45), inset 0 2px 4px rgba(255,220,170,0.2), inset 0 -2px 4px rgba(0,0,0,0.25)",
          border: "1px solid #C0986A",
        }}>
```

**Step 2: Update the back panel to darker warm walnut**

Find:
```jsx
        <div style={{
          backgroundColor: "#3D1215",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='80'%3E%3Cpath d='M0,10 Q75,8 150,12 Q225,15 300,10' stroke='rgba(255,120,80,0.08)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0,25 Q100,27 200,23 Q250,21 300,25' stroke='rgba(180,40,40,0.07)' stroke-width='1' fill='none'/%3E%3Cpath d='M0,40 Q80,38 160,42 Q220,45 300,40' stroke='rgba(255,120,80,0.06)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0,55 Q120,57 200,53 Q260,51 300,55' stroke='rgba(180,40,40,0.07)' stroke-width='1' fill='none'/%3E%3Cpath d='M0,70 Q70,68 140,72 Q210,75 300,70' stroke='rgba(255,120,80,0.05)' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 80px",
          backgroundRepeat: "repeat",
          borderRadius: 8, padding: "24px 12px 12px",
          border: "1px solid #5A1A1E",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), inset 0 -2px 10px rgba(0,0,0,0.3)",
        }}>
```
Replace with:
```jsx
        <div style={{
          backgroundColor: "#7A6048",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='80'%3E%3Cpath d='M0,10 Q75,8 150,12 Q225,15 300,10' stroke='rgba(200,160,100,0.1)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0,25 Q100,27 200,23 Q250,21 300,25' stroke='rgba(160,120,70,0.08)' stroke-width='1' fill='none'/%3E%3Cpath d='M0,40 Q80,38 160,42 Q220,45 300,40' stroke='rgba(200,160,100,0.08)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0,55 Q120,57 200,53 Q260,51 300,55' stroke='rgba(160,120,70,0.08)' stroke-width='1' fill='none'/%3E%3Cpath d='M0,70 Q70,68 140,72 Q210,75 300,70' stroke='rgba(200,160,100,0.07)' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 80px",
          backgroundRepeat: "repeat",
          borderRadius: 8, padding: "24px 12px 12px",
          border: "1px solid #8A7050",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.35), inset 0 -2px 10px rgba(0,0,0,0.2)",
        }}>
```

**Step 3: Update the shelf plank to lighter maple**

Find:
```jsx
      <div style={{
        height: 14,
        backgroundColor: "#6B2225",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='20'%3E%3Cpath d='M0,5 Q100,3 200,6 Q250,8 300,5' stroke='rgba(255,160,100,0.12)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0,12 Q80,14 160,11 Q230,9 300,12' stroke='rgba(200,60,60,0.1)' stroke-width='1' fill='none'/%3E%3Cpath d='M0,17 Q120,15 200,18 Q270,20 300,17' stroke='rgba(255,160,100,0.08)' stroke-width='0.8' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: "300px 20px",
        backgroundRepeat: "repeat-x",
        borderRadius: "0 0 3px 3px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,200,180,0.2)",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,200,180,0.15)" }} />
```
Replace with:
```jsx
      <div style={{
        height: 14,
        backgroundColor: "#C4A882",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='20'%3E%3Cpath d='M0,5 Q100,3 200,6 Q250,8 300,5' stroke='rgba(200,160,100,0.15)' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0,12 Q80,14 160,11 Q230,9 300,12' stroke='rgba(160,120,60,0.12)' stroke-width='1' fill='none'/%3E%3Cpath d='M0,17 Q120,15 200,18 Q270,20 300,17' stroke='rgba(200,160,100,0.1)' stroke-width='0.8' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: "300px 20px",
        backgroundRepeat: "repeat-x",
        borderRadius: "0 0 3px 3px",
        boxShadow: "0 4px 8px rgba(80,50,20,0.4), inset 0 2px 0 rgba(255,230,180,0.25)",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,230,180,0.2)" }} />
```

**Step 4: Verify visually**
The bookshelf frame should look like warm honey maple/light wood — the same natural tone as the bench in the cherry tree photo. Shelf planks are a lighter caramel. Back panel is a medium warm walnut.

**Step 5: Commit**
```bash
git add src/App.jsx
git commit -m "fix: maple/bench-tone bookshelf — lighter warm wood throughout"
```
