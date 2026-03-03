# Stats Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add four analytics pages (Reading Over Time, Genre Breakdown, Top Authors, Reading Goals) behind a fixed left-side floating nav panel.

**Architecture:** A `currentView` state in `App.jsx` drives which page is shown. A `NavPanel` component sits fixed on the left edge always. Four page components in `src/pages/` each receive the `books` array and compute their own stats. A new serverless function scrapes the Goodreads reading challenge goal.

**Tech Stack:** React 19, Recharts (new dependency), Vite, Vercel serverless functions, localStorage for goal persistence.

---

## Task 1: Install Recharts

**Files:**
- Modify: `package.json` (via npm)

**Step 1: Install**
```bash
cd C:\Users\Nour\my-bookshelf
npm install recharts
```

**Step 2: Verify build still passes**
```bash
npm run build
```
Expected: `✓ built in ~Xs` — no errors.

**Step 3: Commit**
```bash
git add package.json package-lock.json
git commit -m "feat: install recharts for stats charts"
```

---

## Task 2: Add `currentView` state and page routing to App.jsx

**Files:**
- Modify: `src/App.jsx`

**Step 1: Add state and imports**

Near the top of the `App()` function, after existing state declarations, add:
```jsx
const [currentView, setCurrentView] = useState('bookshelf');
```

No import changes needed yet — page components will be added in later tasks.

**Step 2: Wrap the existing return content**

The existing `return (...)` in `App()` renders the full bookshelf. Wrap the entire content in a conditional so it only renders when `currentView === 'bookshelf'`:

Find the opening of the return div (the big wrapper with `minHeight: "100vh"`) and the closing `</div>` just before the modals. The bookshelf content should render only when `currentView === 'bookshelf'`.

Replace the structure from `return (` to the end of `</div>` (before the modals block) as:

```jsx
return (
  <>
    {currentView === 'bookshelf' && (
      <div style={{ /* existing wrapper styles unchanged */ }}>
        {/* all existing bookshelf content unchanged */}
      </div>
    )}

    {/* Modals stay outside the view conditional so they always work */}
    {selectedBook && (
      <BookModal ... />
    )}
    {showAddForm && <AddBookForm ... />}
  </>
);
```

**Note:** The modals (`BookModal`, `AddBookForm`) must remain outside the `currentView` conditional — they are overlays that appear on top of whichever view is active.

**Step 3: Verify build**
```bash
npm run build
```
Expected: clean build, no errors.

**Step 4: Commit**
```bash
git add src/App.jsx
git commit -m "feat: add currentView state to App for stats page routing"
```

---

## Task 3: Create the NavPanel component

**Files:**
- Create: `src/components/NavPanel.jsx`

**Step 1: Create the file**

```jsx
const NAV_ITEMS = [
  { key: 'bookshelf', icon: '📚', label: 'Shelf' },
  { key: 'timeline', icon: '📈', label: 'Over Time' },
  { key: 'genres', icon: '🎭', label: 'Genres' },
  { key: 'authors', icon: '✍️', label: 'Authors' },
  { key: 'goals', icon: '🎯', label: 'Goals' },
];

export default function NavPanel({ currentView, onNavigate }) {
  return (
    <div style={{
      position: 'fixed',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      background: 'rgba(255,251,245,0.92)',
      backdropFilter: 'blur(10px)',
      borderRadius: 18,
      padding: '10px 6px',
      boxShadow: '0 4px 24px rgba(80,40,20,0.18), 0 1px 4px rgba(80,40,20,0.08)',
      border: '1px solid rgba(200,160,120,0.35)',
    }}>
      {NAV_ITEMS.map(item => {
        const active = currentView === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            title={item.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '9px 10px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              background: active ? '#8B2840' : 'transparent',
              color: active ? '#FDF0F3' : '#6B3520',
              transition: 'all 0.18s',
              minWidth: 54,
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(139,40,64,0.10)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
            <span style={{
              fontSize: 9, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, letterSpacing: 0.6,
              textTransform: 'uppercase', lineHeight: 1,
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

**Step 2: Import and render NavPanel in App.jsx**

Add import at top of App.jsx:
```jsx
import NavPanel from './components/NavPanel.jsx';
```

Inside the `return (...)`, render `<NavPanel>` just before the bookshelf conditional, so it appears in all views:
```jsx
return (
  <>
    <NavPanel currentView={currentView} onNavigate={setCurrentView} />

    {currentView === 'bookshelf' && (
      /* existing bookshelf content */
    )}

    {/* modals */}
  </>
);
```

**Step 3: Verify build and manual test**
```bash
npm run build
npm run dev
```
Visit http://localhost:5173 — the nav panel should appear fixed on the left. Clicking buttons changes nothing yet (no page components exist) but should not error.

**Step 4: Commit**
```bash
git add src/components/NavPanel.jsx src/App.jsx
git commit -m "feat: add fixed left NavPanel with view navigation"
```

---

## Task 4: Create StatsTimeline page

**Files:**
- Create: `src/pages/StatsTimeline.jsx`

**Step 1: Create the file**

```jsx
import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

function BackButton({ onBack }) {
  return (
    <button
      onClick={onBack}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#8B2840', fontFamily: "'DM Sans', sans-serif",
        fontSize: 14, fontWeight: 600, padding: '0 0 24px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}
    >
      ← Back to Bookshelf
    </button>
  );
}

export default function StatsTimeline({ books, onBack }) {
  const [metric, setMetric] = useState('books'); // 'books' | 'pages'

  const chartData = useMemo(() => {
    const readBooks = books.filter(b => b.s === 'read' && b.dr);
    const byYear = {};
    readBooks.forEach(b => {
      const year = b.dr.substring(0, 4);
      if (!byYear[year]) byYear[year] = { year, books: 0, pages: 0, ratings: [] };
      byYear[year].books++;
      byYear[year].pages += b.p || 0;
      if (b.r > 0) byYear[year].ratings.push(b.r);
    });
    return Object.values(byYear)
      .sort((a, b) => a.year.localeCompare(b.year))
      .map(y => ({
        ...y,
        avgRating: y.ratings.length > 0
          ? (y.ratings.reduce((s, r) => s + r, 0) / y.ratings.length).toFixed(1)
          : '—',
      }));
  }, [books]);

  const toggleStyle = (active) => ({
    padding: '6px 16px', borderRadius: 20,
    border: '1px solid',
    borderColor: active ? '#8B2840' : 'rgba(120,50,60,0.25)',
    background: active ? '#8B2840' : 'rgba(255,255,255,0.55)',
    color: active ? '#FDF0F3' : '#7A3040',
    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    cursor: 'pointer', fontWeight: active ? 600 : 400,
    transition: 'all 0.18s',
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const d = chartData.find(r => r.year === label);
    return (
      <div style={{
        background: '#2C1D12', border: '1px solid #4A3728',
        borderRadius: 8, padding: '10px 14px',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
      }}>
        <div style={{ color: '#D4A843', fontWeight: 700, marginBottom: 4 }}>{label}</div>
        <div style={{ color: '#E8D5B7' }}>{d?.books} books · {d?.pages?.toLocaleString()} pages</div>
        <div style={{ color: '#BFA88A' }}>Avg rating: {d?.avgRating}</div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2E8D9', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: '48px 40px 60px', maxWidth: 1000, margin: '0 auto' }}>
        <BackButton onBack={onBack} />

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: '#5C0F1E', fontSize: 36, fontWeight: 900,
          margin: '0 0 8px', letterSpacing: '-0.5px',
        }}>
          Reading Over Time
        </h1>
        <p style={{ color: '#8B5E3C', fontSize: 14, margin: '0 0 32px' }}>
          {books.filter(b => b.s === 'read').length} books read across {chartData.length} year{chartData.length !== 1 ? 's' : ''}
        </p>

        {/* Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          <button style={toggleStyle(metric === 'books')} onClick={() => setMetric('books')}>Books</button>
          <button style={toggleStyle(metric === 'pages')} onClick={() => setMetric('pages')}>Pages</button>
        </div>

        {/* Bar chart */}
        <div style={{
          background: 'rgba(255,255,255,0.7)', borderRadius: 12,
          padding: '24px 16px 16px',
          boxShadow: '0 2px 12px rgba(120,70,40,0.08)',
          border: '1px solid rgba(200,160,120,0.2)',
          marginBottom: 32,
        }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(160,120,70,0.15)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fill: '#6B3520' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fill: '#8B7355' }}
                axisLine={false} tickLine={false}
                width={36}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,40,64,0.06)' }} />
              <Bar dataKey={metric} radius={[4, 4, 0, 0]} maxBarSize={64}>
                {chartData.map((entry, i) => (
                  <Cell
                    key={entry.year}
                    fill={i === chartData.length - 1 ? '#8B2840' : '#D4A843'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary table */}
        <div style={{
          background: 'rgba(255,255,255,0.7)', borderRadius: 12,
          border: '1px solid rgba(200,160,120,0.2)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(212,168,67,0.1)', borderBottom: '1px solid rgba(200,160,120,0.25)' }}>
                {['Year', 'Books', 'Pages', 'Avg Rating'].map(h => (
                  <th key={h} style={{
                    padding: '12px 20px', textAlign: 'left',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                    textTransform: 'uppercase', letterSpacing: 1.2,
                    color: '#6B3520', fontWeight: 600,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...chartData].reverse().map((row, i) => (
                <tr
                  key={row.year}
                  style={{ borderBottom: i < chartData.length - 1 ? '1px solid rgba(200,160,120,0.12)' : 'none' }}
                >
                  <td style={{ padding: '12px 20px', fontFamily: "'Playfair Display', serif", color: '#3A2010', fontWeight: 700 }}>{row.year}</td>
                  <td style={{ padding: '12px 20px', color: '#3A2010', fontSize: 14 }}>{row.books}</td>
                  <td style={{ padding: '12px 20px', color: '#3A2010', fontSize: 14 }}>{row.pages.toLocaleString()}</td>
                  <td style={{ padding: '12px 20px', color: '#3A2010', fontSize: 14 }}>{row.avgRating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Wire into App.jsx**

Add import:
```jsx
import StatsTimeline from './pages/StatsTimeline.jsx';
```

Inside the return, after the bookshelf conditional:
```jsx
{currentView === 'timeline' && (
  <StatsTimeline books={books} onBack={() => setCurrentView('bookshelf')} />
)}
```

**Step 3: Build and manually verify**
```bash
npm run build
npm run dev
```
Click "Over Time" in the nav — should show the timeline page. Click "← Back to Bookshelf" — should return to shelf.

**Step 4: Commit**
```bash
git add src/pages/StatsTimeline.jsx src/App.jsx
git commit -m "feat: add Reading Over Time stats page"
```

---

## Task 5: Create StatsGenres page

**Files:**
- Create: `src/pages/StatsGenres.jsx`

**Step 1: Create the file**

```jsx
import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLOURS = [
  '#D4A843', '#8B2840', '#5C6B2E', '#2E5C6B', '#6B2E5C',
  '#A84343', '#435CA8', '#43A87A', '#A8437A', '#7AA843',
  '#8B6E2E', '#2E8B6E',
];

export default function StatsGenres({ books, onBack }) {
  const [selected, setSelected] = useState(null);

  const genreData = useMemo(() => {
    const readBooks = books.filter(b => b.s === 'read');
    const genreMap = {};
    readBooks.forEach(b => {
      const genres = b.g && b.g.length > 0 ? b.g : ['Untagged'];
      genres.forEach(g => {
        if (!genreMap[g]) genreMap[g] = { name: g, count: 0, ratings: [], books: [] };
        genreMap[g].count++;
        if (b.r > 0) genreMap[g].ratings.push(b.r);
        genreMap[g].books.push(b);
      });
    });
    const total = readBooks.length;
    return Object.values(genreMap)
      .sort((a, b) => b.count - a.count)
      .map((g, i) => ({
        ...g,
        pct: total > 0 ? Math.round(g.count / total * 100) : 0,
        avgRating: g.ratings.length > 0
          ? (g.ratings.reduce((s, r) => s + r, 0) / g.ratings.length).toFixed(1)
          : '—',
        topBooks: [...g.books].sort((a, b) => b.r - a.r).slice(0, 3),
        colour: COLOURS[i % COLOURS.length],
      }));
  }, [books]);

  const selectedData = selected !== null ? genreData[selected] : null;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div style={{
        background: '#2C1D12', border: '1px solid #4A3728',
        borderRadius: 8, padding: '10px 14px',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
      }}>
        <div style={{ color: '#D4A843', fontWeight: 700 }}>{d.name}</div>
        <div style={{ color: '#E8D5B7' }}>{d.count} books ({d.pct}%)</div>
        <div style={{ color: '#BFA88A' }}>Avg rating: {d.avgRating}</div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2E8D9', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: '48px 40px 60px', maxWidth: 1000, margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#8B2840', fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, fontWeight: 600, padding: '0 0 24px',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Back to Bookshelf
        </button>

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: '#5C0F1E', fontSize: 36, fontWeight: 900,
          margin: '0 0 8px', letterSpacing: '-0.5px',
        }}>
          Genre Breakdown
        </h1>
        <p style={{ color: '#8B5E3C', fontSize: 14, margin: '0 0 32px' }}>
          {genreData.length} genre{genreData.length !== 1 ? 's' : ''} across your read books
        </p>

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Donut */}
          <div style={{
            background: 'rgba(255,255,255,0.7)', borderRadius: 12,
            padding: 24, flex: '0 0 340px',
            boxShadow: '0 2px 12px rgba(120,70,40,0.08)',
            border: '1px solid rgba(200,160,120,0.2)',
          }}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={120}
                  paddingAngle={2}
                  dataKey="count"
                  onClick={(_, index) => setSelected(selected === index ? null : index)}
                >
                  {genreData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={entry.colour}
                      opacity={selected === null || selected === index ? 1 : 0.35}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Detail or genre list */}
          <div style={{ flex: 1, minWidth: 260 }}>
            {selectedData ? (
              <div style={{
                background: 'rgba(255,255,255,0.7)', borderRadius: 12,
                padding: 24,
                boxShadow: '0 2px 12px rgba(120,70,40,0.08)',
                border: `2px solid ${selectedData.colour}44`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    color: '#3A2010', fontSize: 22, margin: 0,
                  }}>{selectedData.name}</h2>
                  <button
                    onClick={() => setSelected(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B7355', fontSize: 18 }}
                  >×</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                  {[
                    { label: 'Books', value: selectedData.count },
                    { label: 'Share', value: `${selectedData.pct}%` },
                    { label: 'Avg Rating', value: selectedData.avgRating },
                  ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center', background: 'rgba(212,168,67,0.08)', borderRadius: 8, padding: '10px 8px' }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", color: '#5C2010', fontSize: 20, fontWeight: 700 }}>{s.value}</div>
                      <div style={{ color: '#8B7355', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ color: '#6B3520', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>Top Books</div>
                {selectedData.topBooks.map(b => (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(200,160,120,0.15)' }}>
                    <span style={{ color: '#3A2010', fontSize: 14 }}>{b.t}</span>
                    <span style={{ color: '#D4A843', fontSize: 13 }}>{b.r > 0 ? '★'.repeat(b.r) : '—'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.7)', borderRadius: 12,
                border: '1px solid rgba(200,160,120,0.2)',
                overflow: 'hidden',
              }}>
                {genreData.map((g, i) => (
                  <div
                    key={g.name}
                    onClick={() => setSelected(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 16px', cursor: 'pointer',
                      borderBottom: i < genreData.length - 1 ? '1px solid rgba(200,160,120,0.12)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,67,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: g.colour, flexShrink: 0 }} />
                    <span style={{ flex: 1, color: '#3A2010', fontSize: 14 }}>{g.name}</span>
                    <span style={{ color: '#8B7355', fontSize: 13 }}>{g.count}</span>
                    <span style={{ color: '#BFA88A', fontSize: 12, minWidth: 36, textAlign: 'right' }}>{g.pct}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Wire into App.jsx**

Add import:
```jsx
import StatsGenres from './pages/StatsGenres.jsx';
```

Add render:
```jsx
{currentView === 'genres' && (
  <StatsGenres books={books} onBack={() => setCurrentView('bookshelf')} />
)}
```

**Step 3: Build and manually verify**
```bash
npm run build
npm run dev
```
Click "Genres" in nav — donut chart appears. Click a slice — detail panel shows. Click × — returns to list.

**Step 4: Commit**
```bash
git add src/pages/StatsGenres.jsx src/App.jsx
git commit -m "feat: add Genre Breakdown stats page"
```

---

## Task 6: Create StatsAuthors page

**Files:**
- Create: `src/pages/StatsAuthors.jsx`

**Step 1: Create the file**

```jsx
import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

export default function StatsAuthors({ books, onBack }) {
  const [metric, setMetric] = useState('count'); // 'count' | 'pages'
  const [expanded, setExpanded] = useState(null);

  const authorData = useMemo(() => {
    const readBooks = books.filter(b => b.s === 'read');
    const authorMap = {};
    readBooks.forEach(b => {
      if (!authorMap[b.a]) authorMap[b.a] = { name: b.a, count: 0, pages: 0, ratings: [], books: [] };
      authorMap[b.a].count++;
      authorMap[b.a].pages += b.p || 0;
      if (b.r > 0) authorMap[b.a].ratings.push(b.r);
      authorMap[b.a].books.push(b);
    });
    return Object.values(authorMap)
      .sort((a, b) => b.count - a.count)
      .map(a => ({
        ...a,
        avgRating: a.ratings.length > 0
          ? (a.ratings.reduce((s, r) => s + r, 0) / a.ratings.length).toFixed(1)
          : '—',
      }));
  }, [books]);

  const chartData = authorData.slice(0, 15).map(a => ({
    name: a.name.split(' ').pop(), // last name for chart label
    fullName: a.name,
    count: a.count,
    pages: a.pages,
  }));

  const toggleStyle = (active) => ({
    padding: '6px 16px', borderRadius: 20,
    border: '1px solid',
    borderColor: active ? '#8B2840' : 'rgba(120,50,60,0.25)',
    background: active ? '#8B2840' : 'rgba(255,255,255,0.55)',
    color: active ? '#FDF0F3' : '#7A3040',
    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    cursor: 'pointer', fontWeight: active ? 600 : 400,
    transition: 'all 0.18s',
  });

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const author = authorData.find(a => a.name === d.fullName);
    return (
      <div style={{
        background: '#2C1D12', border: '1px solid #4A3728',
        borderRadius: 8, padding: '10px 14px',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
      }}>
        <div style={{ color: '#D4A843', fontWeight: 700, marginBottom: 4 }}>{d.fullName}</div>
        <div style={{ color: '#E8D5B7' }}>{author?.count} book{author?.count !== 1 ? 's' : ''}</div>
        <div style={{ color: '#BFA88A' }}>{author?.pages.toLocaleString()} pages · Avg {author?.avgRating}★</div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2E8D9', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: '48px 40px 60px', maxWidth: 1000, margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#8B2840', fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, fontWeight: 600, padding: '0 0 24px',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Back to Bookshelf
        </button>

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: '#5C0F1E', fontSize: 36, fontWeight: 900,
          margin: '0 0 8px', letterSpacing: '-0.5px',
        }}>
          Top Authors
        </h1>
        <p style={{ color: '#8B5E3C', fontSize: 14, margin: '0 0 32px' }}>
          {authorData.length} author{authorData.length !== 1 ? 's' : ''} on your read shelf
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          <button style={toggleStyle(metric === 'count')} onClick={() => setMetric('count')}>By Books</button>
          <button style={toggleStyle(metric === 'pages')} onClick={() => setMetric('pages')}>By Pages</button>
        </div>

        {/* Bar chart — top 15 */}
        <div style={{
          background: 'rgba(255,255,255,0.7)', borderRadius: 12,
          padding: '24px 16px 16px',
          boxShadow: '0 2px 12px rgba(120,70,40,0.08)',
          border: '1px solid rgba(200,160,120,0.2)',
          marginBottom: 32,
        }}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(160,120,70,0.15)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fill: '#8B7355' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                type="category" dataKey="name" width={90}
                tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fill: '#6B3520' }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,40,64,0.06)' }} />
              <Bar dataKey={metric} radius={[0, 4, 4, 0]} maxBarSize={28}>
                {chartData.map((entry, i) => (
                  <Cell key={entry.fullName} fill={i === 0 ? '#8B2840' : '#D4A843'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Full list */}
        <div style={{
          background: 'rgba(255,255,255,0.7)', borderRadius: 12,
          border: '1px solid rgba(200,160,120,0.2)',
          overflow: 'hidden',
        }}>
          {authorData.map((author, i) => (
            <div key={author.name}>
              <div
                onClick={() => setExpanded(expanded === i ? null : i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '13px 20px', cursor: 'pointer',
                  borderBottom: '1px solid rgba(200,160,120,0.12)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,67,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  color: '#3A2010', fontSize: 15, flex: 1,
                }}>{author.name}</span>
                <span style={{ color: '#8B7355', fontSize: 13 }}>{author.count} book{author.count !== 1 ? 's' : ''}</span>
                <span style={{ color: '#D4A843', fontSize: 13, minWidth: 40, textAlign: 'right' }}>{author.avgRating !== '—' ? `${author.avgRating}★` : '—'}</span>
                <span style={{ color: '#BFA88A', fontSize: 13 }}>{expanded === i ? '▲' : '▼'}</span>
              </div>
              {expanded === i && (
                <div style={{ padding: '8px 20px 16px', background: 'rgba(212,168,67,0.04)' }}>
                  {author.books.map(b => (
                    <div key={b.id} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '6px 0', borderBottom: '1px solid rgba(200,160,120,0.1)',
                      fontSize: 13,
                    }}>
                      <span style={{ color: '#3A2010' }}>{b.t}</span>
                      <span style={{ color: '#D4A843' }}>{b.r > 0 ? '★'.repeat(b.r) : '—'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Wire into App.jsx**

```jsx
import StatsAuthors from './pages/StatsAuthors.jsx';
```

```jsx
{currentView === 'authors' && (
  <StatsAuthors books={books} onBack={() => setCurrentView('bookshelf')} />
)}
```

**Step 3: Build and manually verify**
```bash
npm run build
npm run dev
```
Click "Authors" — horizontal bars appear, top author highlighted. Toggle to pages. Click an author row — books expand inline.

**Step 4: Commit**
```bash
git add src/pages/StatsAuthors.jsx src/App.jsx
git commit -m "feat: add Top Authors stats page"
```

---

## Task 7: Create the reading-goal serverless function

**Files:**
- Create: `api/reading-goal.js`

**Step 1: Create the file**

```js
const GOODREADS_USER_ID = '174446438';
const PROFILE_URL = `https://www.goodreads.com/user/show/${GOODREADS_USER_ID}`;

export default async function handler(req, res) {
  try {
    const response = await fetch(PROFILE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Goodreads returned ${response.status}` });
    }

    const html = await response.text();
    const year = new Date().getFullYear();

    // Try multiple HTML patterns Goodreads has used for reading challenge goal
    const patterns = [
      /(\d+)\s*book reading challenge/i,
      /reading challenge.*?(\d+)\s*book/i,
      /goal.*?(\d+)\s*book/i,
      /"readingChallengeGoal"[^>]*>(\d+)/i,
      /challenge-goal[^>]*>(\d+)/i,
      /(\d+)\s*of\s*\d+\s*books/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        const goal = parseInt(match[1]);
        if (goal > 0 && goal < 10000) { // sanity check
          res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
          return res.status(200).json({ year, goal });
        }
      }
    }

    // No challenge found — return null goal so UI falls back to manual entry
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({ year, goal: null });

  } catch (err) {
    console.error('Reading goal fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch reading goal' });
  }
}
```

**Step 2: Note on local testing**

This function only runs on Vercel (like `api/goodreads.js`). Locally it returns 404, which is expected. The StatsGoals component (Task 8) handles this gracefully by falling back to manual entry.

**Step 3: Commit**
```bash
git add api/reading-goal.js
git commit -m "feat: add reading-goal serverless function scraping Goodreads profile"
```

---

## Task 8: Create StatsGoals page

**Files:**
- Create: `src/pages/StatsGoals.jsx`

**Step 1: Create the file**

```jsx
import { useState, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'bookshelf_goals_v1';

function loadGoals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveGoals(goals) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch {}
}

// SVG progress ring
function ProgressRing({ value, max, size = 200 }) {
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const dash = pct * circ;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(200,160,120,0.2)" strokeWidth={14} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={pct >= 1 ? '#5C6B2E' : '#8B2840'}
        strokeWidth={14}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  );
}

export default function StatsGoals({ books, onBack }) {
  const currentYear = new Date().getFullYear();
  const [goals, setGoals] = useState(loadGoals);
  const [fetchedGoal, setFetchedGoal] = useState(null);
  const [editingYear, setEditingYear] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [fetching, setFetching] = useState(true);

  // Compute books read per year from book data
  const booksByYear = useMemo(() => {
    const map = {};
    books.filter(b => b.s === 'read' && b.dr).forEach(b => {
      const yr = parseInt(b.dr.substring(0, 4));
      if (!map[yr]) map[yr] = 0;
      map[yr]++;
    });
    return map;
  }, [books]);

  const allYears = useMemo(() => {
    const yearsWithBooks = Object.keys(booksByYear).map(Number);
    const yearsWithGoals = Object.keys(goals).map(Number);
    const all = new Set([...yearsWithBooks, ...yearsWithGoals, currentYear]);
    return Array.from(all).sort((a, b) => b - a); // newest first
  }, [booksByYear, goals, currentYear]);

  // Fetch current year goal from API
  useEffect(() => {
    fetch('/api/reading-goal')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.goal) {
          setFetchedGoal(data.goal);
          // Pre-populate if not manually set
          setGoals(prev => {
            if (!prev[currentYear]) {
              const updated = { ...prev, [currentYear]: data.goal };
              saveGoals(updated);
              return updated;
            }
            return prev;
          });
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [currentYear]);

  const startEdit = (year) => {
    setEditingYear(year);
    setEditValue(String(goals[year] || ''));
  };

  const saveEdit = (year) => {
    const val = parseInt(editValue);
    if (val > 0) {
      const updated = { ...goals, [year]: val };
      saveGoals(updated);
      setGoals(updated);
    } else if (editValue === '') {
      const updated = { ...goals };
      delete updated[year];
      saveGoals(updated);
      setGoals(updated);
    }
    setEditingYear(null);
  };

  const currentGoal = goals[currentYear] || null;
  const currentRead = booksByYear[currentYear] || 0;
  const toGo = currentGoal ? Math.max(0, currentGoal - currentRead) : null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2E8D9', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: '48px 40px 60px', maxWidth: 900, margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#8B2840', fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, fontWeight: 600, padding: '0 0 24px',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← Back to Bookshelf
        </button>

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: '#5C0F1E', fontSize: 36, fontWeight: 900,
          margin: '0 0 32px', letterSpacing: '-0.5px',
        }}>
          Reading Goals
        </h1>

        {/* Current year card */}
        <div style={{
          background: 'rgba(255,255,255,0.8)', borderRadius: 16,
          padding: '32px', marginBottom: 32,
          boxShadow: '0 4px 20px rgba(120,70,40,0.1)',
          border: '1px solid rgba(200,160,120,0.25)',
          display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap',
        }}>
          {/* Ring */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <ProgressRing value={currentRead} max={currentGoal || currentRead || 1} size={180} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: '#5C0F1E', lineHeight: 1 }}>
                {currentRead}
              </div>
              {currentGoal && (
                <div style={{ color: '#8B7355', fontSize: 13, marginTop: 2 }}>of {currentGoal}</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", color: '#3A2010', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              {currentYear} Challenge
            </div>

            {currentGoal ? (
              <>
                <div style={{ color: '#5C6B2E', fontSize: 15, marginBottom: 4 }}>
                  {currentRead >= currentGoal
                    ? '🎉 Goal completed!'
                    : `${toGo} book${toGo !== 1 ? 's' : ''} to go`}
                </div>
                {fetchedGoal && goals[currentYear] === fetchedGoal && (
                  <div style={{ color: '#8B7355', fontSize: 12, marginBottom: 12 }}>
                    ✓ Goal synced from Goodreads
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: '#8B7355', fontSize: 14, marginBottom: 12 }}>
                {fetching ? 'Checking Goodreads for your challenge…' : 'No goal set for this year'}
              </div>
            )}

            {editingYear === currentYear ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                <input
                  type="number"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(currentYear); if (e.key === 'Escape') setEditingYear(null); }}
                  autoFocus
                  style={{
                    width: 80, padding: '6px 10px', borderRadius: 8,
                    border: '1px solid #4A3728', background: '#F5ECD7',
                    color: '#3A2010', fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                    outline: 'none',
                  }}
                />
                <button onClick={() => saveEdit(currentYear)} style={{ padding: '6px 14px', borderRadius: 8, background: '#8B2840', border: 'none', color: '#FDF0F3', fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: 'pointer' }}>Save</button>
                <button onClick={() => setEditingYear(null)} style={{ padding: '6px 14px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(139,40,64,0.3)', color: '#8B2840', fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => startEdit(currentYear)}
                style={{
                  marginTop: 8, padding: '6px 14px', borderRadius: 8,
                  background: 'transparent', border: '1px solid rgba(139,40,64,0.35)',
                  color: '#8B2840', fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, cursor: 'pointer',
                }}
              >
                {currentGoal ? 'Edit goal' : 'Set goal'}
              </button>
            )}
          </div>
        </div>

        {/* Past years table */}
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#3A2010', fontSize: 22, marginBottom: 16 }}>
          Past Years
        </h2>
        <div style={{
          background: 'rgba(255,255,255,0.7)', borderRadius: 12,
          border: '1px solid rgba(200,160,120,0.2)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(212,168,67,0.1)', borderBottom: '1px solid rgba(200,160,120,0.25)' }}>
                {['Year', 'Goal', 'Books Read', 'Result'].map(h => (
                  <th key={h} style={{
                    padding: '12px 20px', textAlign: 'left',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                    textTransform: 'uppercase', letterSpacing: 1.2,
                    color: '#6B3520', fontWeight: 600,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allYears.filter(y => y !== currentYear).map((year, i) => {
                const read = booksByYear[year] || 0;
                const goal = goals[year] || null;
                const hit = goal ? read >= goal : null;
                return (
                  <tr key={year} style={{ borderBottom: '1px solid rgba(200,160,120,0.12)' }}>
                    <td style={{ padding: '12px 20px', fontFamily: "'Playfair Display', serif", color: '#3A2010', fontWeight: 700 }}>{year}</td>
                    <td style={{ padding: '12px 20px', color: '#3A2010', fontSize: 14 }}>
                      {editingYear === year ? (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <input
                            type="number"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') saveEdit(year); if (e.key === 'Escape') setEditingYear(null); }}
                            autoFocus
                            style={{
                              width: 64, padding: '4px 8px', borderRadius: 6,
                              border: '1px solid #4A3728', background: '#F5ECD7',
                              color: '#3A2010', fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                              outline: 'none',
                            }}
                          />
                          <button onClick={() => saveEdit(year)} style={{ padding: '4px 10px', borderRadius: 6, background: '#8B2840', border: 'none', color: '#FDF0F3', fontSize: 12, cursor: 'pointer' }}>✓</button>
                          <button onClick={() => setEditingYear(null)} style={{ padding: '4px 8px', borderRadius: 6, background: 'transparent', border: 'none', color: '#8B7355', fontSize: 12, cursor: 'pointer' }}>✗</button>
                        </div>
                      ) : (
                        <span
                          onClick={() => startEdit(year)}
                          style={{ cursor: 'pointer', borderBottom: '1px dashed rgba(139,40,64,0.3)', color: goal ? '#3A2010' : '#8B7355' }}
                        >
                          {goal || 'Set goal'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 20px', color: '#3A2010', fontSize: 14 }}>{read}</td>
                    <td style={{ padding: '12px 20px', fontSize: 13 }}>
                      {hit === true && <span style={{ color: '#5C6B2E', fontWeight: 600 }}>✓ Completed</span>}
                      {hit === false && <span style={{ color: '#8B2840' }}>✗ {read}/{goal}</span>}
                      {hit === null && <span style={{ color: '#8B7355' }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Wire into App.jsx**

```jsx
import StatsGoals from './pages/StatsGoals.jsx';
```

```jsx
{currentView === 'goals' && (
  <StatsGoals books={books} onBack={() => setCurrentView('bookshelf')} />
)}
```

**Step 3: Build and manually verify**
```bash
npm run build
npm run dev
```
Click "Goals" in nav — progress ring and past years table appear. Click "Set goal" or a past year target — inline edit appears. Enter a number and press Enter — value saves. Refresh page — goals persist from localStorage.

**Step 4: Commit**
```bash
git add src/pages/StatsGoals.jsx src/App.jsx
git commit -m "feat: add Reading Goals page with progress ring and localStorage persistence"
```

---

## Task 9: Final build check and memory update

**Step 1: Full build**
```bash
cd C:\Users\Nour\my-bookshelf
npm run build
```
Expected: clean build, no warnings or errors.

**Step 2: Run dev and smoke-test all pages**
```bash
npm run dev
```
Check each nav button navigates correctly. Check back button returns to bookshelf. Check modals still open from bookshelf. Check Escape key still closes modals.

**Step 3: Commit if any loose ends**
```bash
git add -A
git status
```
Only commit if there are actual unstaged changes.
