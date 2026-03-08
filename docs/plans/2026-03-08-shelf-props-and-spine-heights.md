
```markdown
# Shelf Props & Spine Heights Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add seasonal SVG props to each shelf (spring plants currently) and make spine heights realistically correlate with page count.

**Architecture:** All changes in `src/App.jsx`. Task 1 fixes `getBookHeight` to use page count and adjusts related measurements. Task 2 adds a `getSeasonalProp(shelfIndex)` helper returning inline SVG and threads it into the `Shelf` component's spacer div. No new files or dependencies.

**Tech Stack:** React 18, Vite, inline SVG, inline styles. No test suite — verify with `npm run build`.

---

### Task 1: Spine heights by page count

**Files:**
- Modify: `src/App.jsx` — `getBookHeight` function (~line 59), BookSpine call site (~line 98), Shelf `minHeight` (~line 1222), bookend `height` (~line 1207)

**Step 1: Update `getBookHeight` to accept and use pages**

Find (lines 59-62):
```js
function getBookHeight(id) {
  const r = seededRandom(parseInt(id));
  return 160 + r * 40; // 160-200px
}
```

Replace with:
```js
function getBookHeight(id, pages) {
  const r = seededRandom(parseInt(id));
  if (!pages || pages < 150) return 138 + r * 10;  // 138–148px
  if (pages < 300)           return 154 + r * 14;  // 154–168px
  if (pages < 500)           return 171 + r * 14;  // 171–185px
  if (pages < 700)           return 187 + r * 13;  // 187–200px
  return                            200 + r * 15;  // 200–215px
}
```

**Step 2: Pass pages to getBookHeight in BookSpine**

Find (around line 98):
```js
  const height = getBookHeight(book.id);
```

Replace with:
```js
  const height = getBookHeight(book.id, book.p);
```

**Step 3: Increase books row minHeight from 170 to 220**

Find (around line 1222):
```jsx
        padding: "0 12px", minHeight: 170,
```

Replace with:
```jsx
        padding: "0 12px", minHeight: 220,
```

**Step 4: Increase bookend height from 130 to 155**

Find (in bookendStyle, around line 1207):
```js
    height: 130,
```

Replace with:
```js
    height: 155,
```

**Step 5: Build to verify**

Run: `npm run build`
Expected: build succeeds with no errors.

**Step 6: Commit**

```
git add src/App.jsx
git commit -m "Spine heights now reflect page count: 138–215px across 5 tiers"
```

---

### Task 2: Seasonal shelf props

**Files:**
- Modify: `src/App.jsx` — add `getSeasonalProp` before `function Shelf(`, update both spacer divs inside `Shelf`

**Step 1: Add `getSeasonalProp` function**

Add the following function immediately before `function Shelf(` (around line 1194):

```jsx
function getSeasonalProp(shelfIndex) {
  const month = new Date().getMonth() + 1; // 1–12
  const v = shelfIndex % 4;

  const Pot = ({ color = "#C4703A", rim = "#A8582A" }) => (
    <>
      <path d="M12 36 L14 50 L30 50 L32 36 Z" fill={color}/>
      <rect x="10" y="32" width="24" height="5" rx="2" fill={rim}/>
      <ellipse cx="22" cy="34" rx="10" ry="2.5" fill="#5A3010" opacity="0.35"/>
    </>
  );

  // Spring: March–May
  if (month >= 3 && month <= 5) {
    const plants = [
      // 0: Cactus
      <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Pot />
        <rect x="18" y="14" width="8" height="22" rx="4" fill="#5A8A3A"/>
        <path d="M18 26 Q10 24 10 17 Q10 13 14 13 L18 13" stroke="#5A8A3A" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M26 22 Q34 20 34 14 Q34 10 30 10 L26 10" stroke="#5A8A3A" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <line x1="19" y1="18" x2="16" y2="16" stroke="#8BC870" strokeWidth="1"/>
        <line x1="23" y1="24" x2="26" y2="22" stroke="#8BC870" strokeWidth="1"/>
        <line x1="20" y1="30" x2="17" y2="29" stroke="#8BC870" strokeWidth="1"/>
      </svg>,
      // 1: Leafy plant
      <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Pot />
        <path d="M22 33 Q21 25 22 18" stroke="#6A8830" strokeWidth="2" fill="none"/>
        <ellipse cx="15" cy="22" rx="8" ry="4" fill="#6BAA35" transform="rotate(-25 15 22)"/>
        <ellipse cx="29" cy="20" rx="8" ry="4" fill="#5A9A28" transform="rotate(25 29 20)"/>
        <ellipse cx="16" cy="14" rx="7" ry="3.5" fill="#7ABF40" transform="rotate(-35 16 14)"/>
        <ellipse cx="28" cy="12" rx="7" ry="3.5" fill="#6BAA35" transform="rotate(30 28 12)"/>
        <ellipse cx="22" cy="10" rx="5" ry="3" fill="#5A9A28"/>
      </svg>,
      // 2: Flower
      <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Pot />
        <path d="M22 33 L22 22" stroke="#6A8830" strokeWidth="2"/>
        <ellipse cx="16" cy="27" rx="6" ry="3" fill="#5A9A28" transform="rotate(-30 16 27)"/>
        <ellipse cx="28" cy="25" rx="6" ry="3" fill="#6BAA35" transform="rotate(30 28 25)"/>
        {[0, 60, 120, 180, 240, 300].map(deg => (
          <ellipse key={deg} cx="22" cy="14" rx="2.5" ry="6" fill="#F4A83A" transform={`rotate(${deg} 22 20)`}/>
        ))}
        <circle cx="22" cy="20" r="4.5" fill="#E07820"/>
      </svg>,
      // 3: Succulent (blue-green pot)
      <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Pot color="#7A9BAA" rim="#6A8898" />
        <ellipse cx="22" cy="30" rx="10" ry="5" fill="#7ABC8A"/>
        <ellipse cx="14" cy="25" rx="6" ry="9" fill="#6AAA78" transform="rotate(-20 14 25)"/>
        <ellipse cx="30" cy="25" rx="6" ry="9" fill="#5A9A68" transform="rotate(20 30 25)"/>
        <ellipse cx="18" cy="18" rx="5" ry="8" fill="#7ABC8A" transform="rotate(-10 18 18)"/>
        <ellipse cx="26" cy="18" rx="5" ry="8" fill="#6AAA78" transform="rotate(10 26 18)"/>
        <ellipse cx="22" cy="14" rx="6" ry="8" fill="#8ACA98"/>
        <circle cx="22" cy="13" r="3" fill="#B0E8BC"/>
      </svg>,
    ];
    return plants[v];
  }

  // Summer: June–August
  if (month >= 6 && month <= 8) {
    const props = [
      // 0: Seashell
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="22" cy="30" rx="14" ry="10" fill="#E8C890"/>
        <ellipse cx="22" cy="30" rx="14" ry="10" stroke="#C4A060" strokeWidth="1"/>
        <path d="M22 20 Q28 24 30 30" stroke="#C4A060" strokeWidth="1" fill="none"/>
        <path d="M22 20 Q16 24 14 30" stroke="#C4A060" strokeWidth="1" fill="none"/>
        <path d="M22 20 Q23 26 22 30" stroke="#C4A060" strokeWidth="0.8" fill="none"/>
        <ellipse cx="22" cy="19" rx="3" ry="2" fill="#D4B070"/>
      </svg>,
      // 1: Candle
      <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="28" width="12" height="22" rx="2" fill="#F5ECD7" stroke="#E0D0B0" strokeWidth="0.5"/>
        {[34, 38, 42].map(y => (
          <path key={y} d={`M18 ${y} Q22 ${y-2} 26 ${y}`} stroke="#D4B878" strokeWidth="1" fill="none" opacity="0.4"/>
        ))}
        <line x1="22" y1="28" x2="22" y2="23" stroke="#5A4020" strokeWidth="1.5"/>
        <ellipse cx="22" cy="21" rx="3" ry="4" fill="#F4A020" opacity="0.9"/>
        <ellipse cx="22" cy="20" rx="1.5" ry="2" fill="#FFDD80"/>
      </svg>,
      // 2: Sunflower
      <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Pot />
        <path d="M22 33 L22 20" stroke="#6A8830" strokeWidth="2.5"/>
        <ellipse cx="16" cy="27" rx="5" ry="3" fill="#5A9A28" transform="rotate(-25 16 27)"/>
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <ellipse key={deg} cx="22" cy="12" rx="2" ry="6" fill="#F4C020" transform={`rotate(${deg} 22 19)`}/>
        ))}
        <circle cx="22" cy="19" r="5" fill="#7A4820"/>
        <circle cx="20" cy="18" r="1" fill="#C07838" opacity="0.6"/>
        <circle cx="24" cy="17" r="1" fill="#C07838" opacity="0.6"/>
        <circle cx="22" cy="21" r="1" fill="#C07838" opacity="0.6"/>
      </svg>,
      // 3: Beach bucket
      <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 30 L15 50 L29 50 L31 30 Z" fill="#E8A030"/>
        <rect x="12" y="26" width="20" height="5" rx="2" fill="#D49020"/>
        <path d="M14 26 Q22 20 30 26" stroke="#B07010" strokeWidth="1.5" fill="none"/>
        <line x1="22" y1="36" x2="22" y2="44" stroke="#B07010" strokeWidth="1.5" strokeDasharray="2 2"/>
        <line x1="16" y1="40" x2="28" y2="40" stroke="#B07010" strokeWidth="1.5" strokeDasharray="2 2"/>
      </svg>,
    ];
    return props[v];
  }

  // Autumn: September–November
  if (month >= 9 && month <= 11) {
    const props = [
      // 0: Mini pumpkin
      <svg width="44" height="48" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="22" cy="34" rx="14" ry="10" fill="#E87820"/>
        <ellipse cx="22" cy="34" rx="9" ry="10" fill="#D06010" opacity="0.6"/>
        <ellipse cx="22" cy="34" rx="4" ry="10" fill="#E87820" opacity="0.5"/>
        <rect x="20" y="22" width="4" height="7" rx="2" fill="#5A7830"/>
        <path d="M22 24 Q26 20 28 24" stroke="#5A7830" strokeWidth="1.5" fill="none"/>
        <ellipse cx="22" cy="43" rx="8" ry="2" fill="#C05C00" opacity="0.3"/>
      </svg>,
      // 1: Acorn
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="22" cy="32" rx="9" ry="10" fill="#C07838"/>
        <path d="M13 26 Q13 18 22 18 Q31 18 31 26 Z" fill="#7A5428"/>
        <ellipse cx="22" cy="18" rx="9" ry="3" fill="#8A6438"/>
        <line x1="22" y1="15" x2="22" y2="10" stroke="#5A4020" strokeWidth="1.5"/>
        <path d="M22 11 Q25 9 27 12" stroke="#5A4020" strokeWidth="1" fill="none"/>
      </svg>,
      // 2: Mushroom
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="30" width="8" height="11" rx="2" fill="#F0E0C8"/>
        <path d="M8 30 Q8 14 22 14 Q36 14 36 30 Z" fill="#C83028"/>
        <ellipse cx="22" cy="30" rx="14" ry="4" fill="#A02018"/>
        <circle cx="16" cy="24" r="2.5" fill="white" opacity="0.8"/>
        <circle cx="24" cy="21" r="2" fill="white" opacity="0.8"/>
        <circle cx="29" cy="26" r="2.5" fill="white" opacity="0.8"/>
        <circle cx="19" cy="29" r="1.5" fill="white" opacity="0.6"/>
      </svg>,
      // 3: Fallen leaf
      <svg width="44" height="48" viewBox="0 0 44 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 42 Q6 30 8 16 Q12 6 22 6 Q32 6 36 16 Q38 30 22 42 Z" fill="#D4601C"/>
        <line x1="22" y1="42" x2="22" y2="10" stroke="#B04010" strokeWidth="1.5"/>
        <line x1="22" y1="26" x2="13" y2="19" stroke="#B04010" strokeWidth="1"/>
        <line x1="22" y1="32" x2="31" y2="25" stroke="#B04010" strokeWidth="1"/>
        <line x1="22" y1="20" x2="29" y2="14" stroke="#B04010" strokeWidth="1"/>
        <line x1="22" y1="36" x2="14" y2="30" stroke="#B04010" strokeWidth="1"/>
      </svg>,
    ];
    return props[v];
  }

  // Winter: December–February
  const props = [
    // 0: Snow globe
    <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="46" width="16" height="6" rx="2" fill="#B0B0B8"/>
      <rect x="12" y="42" width="20" height="6" rx="2" fill="#A0A0A8"/>
      <circle cx="22" cy="28" r="14" fill="#C8DDF0" opacity="0.85"/>
      <circle cx="22" cy="28" r="14" stroke="#A0B8D0" strokeWidth="1.5" fill="none"/>
      <path d="M12 34 Q17 30 22 34 Q27 38 32 34" fill="white"/>
      <line x1="22" y1="34" x2="22" y2="24" stroke="#8B5E3C" strokeWidth="2"/>
      <path d="M15 28 Q22 24 29 28" stroke="#5A8A3A" strokeWidth="2.5" fill="none"/>
      <circle cx="17" cy="24" r="1.5" fill="white" opacity="0.9"/>
      <circle cx="27" cy="22" r="1" fill="white" opacity="0.9"/>
      <circle cx="25" cy="28" r="1" fill="white" opacity="0.9"/>
    </svg>,
    // 1: Pine sprig in pot
    <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Pot color="#8B6038" rim="#7A5028"/>
      <line x1="22" y1="32" x2="22" y2="20" stroke="#5A4020" strokeWidth="2"/>
      <polygon points="22,8 13,22 31,22" fill="#2A6A30"/>
      <polygon points="22,14 12,26 32,26" fill="#3A7A40"/>
      <circle cx="17" cy="16" r="1.5" fill="#E83030"/>
      <circle cx="27" cy="19" r="1.5" fill="#E83030"/>
      <circle cx="15" cy="23" r="1.5" fill="#E8C030"/>
      <circle cx="29" cy="23" r="1.5" fill="#E8C030"/>
    </svg>,
    // 2: Candle with holly
    <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="28" width="12" height="22" rx="2" fill="#F5ECD7" stroke="#E0D0B0" strokeWidth="0.5"/>
      {[34, 38, 42].map(y => (
        <path key={y} d={`M18 ${y} Q22 ${y-2} 26 ${y}`} stroke="#D4B878" strokeWidth="1" fill="none" opacity="0.4"/>
      ))}
      <line x1="22" y1="28" x2="22" y2="23" stroke="#5A4020" strokeWidth="1.5"/>
      <ellipse cx="22" cy="21" rx="3" ry="4" fill="#F4A020" opacity="0.9"/>
      <ellipse cx="22" cy="20" rx="1.5" ry="2" fill="#FFDD80"/>
      <ellipse cx="15" cy="29" rx="4" ry="2.5" fill="#2A7030" transform="rotate(-20 15 29)"/>
      <ellipse cx="29" cy="29" rx="4" ry="2.5" fill="#2A7030" transform="rotate(20 29 29)"/>
      <circle cx="22" cy="28" r="2" fill="#C83028"/>
      <circle cx="18" cy="30" r="1.5" fill="#C83028"/>
      <circle cx="26" cy="30" r="1.5" fill="#C83028"/>
    </svg>,
    // 3: Snowman
    <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="44" r="8" fill="#F0F4F8" stroke="#D0D8E0" strokeWidth="1"/>
      <circle cx="22" cy="30" r="6" fill="#F0F4F8" stroke="#D0D8E0" strokeWidth="1"/>
      <circle cx="22" cy="20" r="4.5" fill="#F0F4F8" stroke="#D0D8E0" strokeWidth="1"/>
      <circle cx="20" cy="19" r="1" fill="#3A3A3A"/>
      <circle cx="24" cy="19" r="1" fill="#3A3A3A"/>
      <path d="M20 22 Q22 23.5 24 22" stroke="#E07838" strokeWidth="1.5" fill="none"/>
      <rect x="17" y="15" width="10" height="3" rx="1" fill="#3A3A3A"/>
      <rect x="16" y="14" width="12" height="2" rx="1" fill="#3A3A3A"/>
      <circle cx="22" cy="30" r="1" fill="#3A3A3A"/>
      <circle cx="22" cy="33" r="1" fill="#3A3A3A"/>
    </svg>,
  ];
  return props[v];
}
```

**Step 2: Update the isRight spacer div to render the prop**

Find (in the Shelf return):
```jsx
        {isRight && <div style={{ flex: 1 }} />}
        {isRight && <div aria-hidden="true" style={bookendStyle} />}
```

Replace with:
```jsx
        {isRight && (
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", paddingLeft: 16 }}>
            {getSeasonalProp(shelfIndex)}
          </div>
        )}
        {isRight && <div aria-hidden="true" style={bookendStyle} />}
```

**Step 3: Update the !isRight spacer div to render the prop**

Find (in the Shelf return):
```jsx
        {!isRight && <div aria-hidden="true" style={bookendStyle} />}
        {!isRight && <div style={{ flex: 1 }} />}
```

Replace with:
```jsx
        {!isRight && <div aria-hidden="true" style={bookendStyle} />}
        {!isRight && (
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", paddingRight: 16 }}>
            {getSeasonalProp(shelfIndex)}
          </div>
        )}
```

**Step 4: Build to verify**

Run: `npm run build`
Expected: build succeeds with no errors.

**Step 5: Commit**

```
git add src/App.jsx
git commit -m "Add seasonal shelf props and push"
git push
```
