# Over Time Grouping & Range Filter Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Group early reading years into "Childhood" (2010–2012) and "Uni" (2013–2018) bars on the Over Time stats page, and add a "From" dropdown so the user can choose the starting period.

**Architecture:** All changes are confined to `src/pages/StatsTimeline.jsx`. The existing `chartData` useMemo is replaced by two useMemos: one that builds all groups unconditionally, and one that filters based on the selected "From" value. A dropdown replaces the need to show individual years for early reading history.

**Tech Stack:** React 18, Recharts, Vite. No test suite — verify with `npm run build`.

---

### Task 1: Replace chartData with grouped computation

**Files:**
- Modify: `src/pages/StatsTimeline.jsx`

**Step 1: Add `fromSelection` state and replace the chartData useMemo**

Replace lines 10–30 (the existing state and useMemo) with the following:

```jsx
const [metric, setMetric] = useState('books');
const [fromSelection, setFromSelection] = useState('Childhood');

// Build all groups unconditionally: Childhood, Uni, then individual years 2019+
const allGroupedData = useMemo(() => {
  const readBooks = books.filter(b => b.s === 'read' && b.dr);

  const childhood = { label: 'Childhood', books: 0, pages: 0, ratings: [] };
  const uni = { label: 'Uni', books: 0, pages: 0, ratings: [] };
  const byYear = {};

  readBooks.forEach(b => {
    const year = parseInt(b.dr.substring(0, 4), 10);
    if (year >= 2010 && year <= 2012) {
      childhood.books++;
      childhood.pages += b.p || 0;
      if (b.r > 0) childhood.ratings.push(b.r);
    } else if (year >= 2013 && year <= 2018) {
      uni.books++;
      uni.pages += b.p || 0;
      if (b.r > 0) uni.ratings.push(b.r);
    } else if (year >= 2019) {
      const y = String(year);
      if (!byYear[y]) byYear[y] = { label: y, books: 0, pages: 0, ratings: [] };
      byYear[y].books++;
      byYear[y].pages += b.p || 0;
      if (b.r > 0) byYear[y].ratings.push(b.r);
    }
  });

  const finalize = g => ({
    ...g,
    avgRating: g.ratings.length > 0
      ? (g.ratings.reduce((s, r) => s + r, 0) / g.ratings.length).toFixed(1)
      : '—',
  });

  const individualYears = Object.values(byYear)
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(finalize);

  return [finalize(childhood), finalize(uni), ...individualYears];
}, [books]);

// Dropdown options: Childhood, Uni, 2019, 2020, …, current year
const dropdownOptions = useMemo(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = 2019; y <= currentYear; y++) years.push(String(y));
  return ['Childhood', 'Uni', ...years];
}, []);

// Slice allGroupedData from the selected label onwards
const chartData = useMemo(() => {
  const idx = allGroupedData.findIndex(g => g.label === fromSelection);
  return idx === -1 ? allGroupedData : allGroupedData.slice(idx);
}, [allGroupedData, fromSelection]);
```

**Step 2: Run the build to verify no errors**

Run: `npm run build`
Expected: Build succeeds (may warn about unused variables if tooltip still references old `year` field — that gets fixed in Task 3).

---

### Task 2: Add the "From" dropdown above the metric toggles

**Files:**
- Modify: `src/pages/StatsTimeline.jsx`

**Step 1: Insert the dropdown**

Find the `<div>` that contains the metric toggle buttons (currently around line 73). Insert the dropdown **above** that div:

```jsx
{/* From selector */}
<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
  <span style={{
    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    color: '#6B3520', fontWeight: 600,
  }}>From</span>
  <select
    value={fromSelection}
    onChange={e => setFromSelection(e.target.value)}
    style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 13,
      color: '#3A2010', background: 'rgba(255,255,255,0.8)',
      border: '1px solid rgba(120,50,60,0.3)', borderRadius: 8,
      padding: '5px 10px', cursor: 'pointer',
      outline: 'none',
    }}
  >
    {dropdownOptions.map(opt => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
</div>
```

**Step 2: Run the build**

Run: `npm run build`
Expected: Build succeeds.

---

### Task 3: Update the chart — XAxis dataKey and Tooltip

**Files:**
- Modify: `src/pages/StatsTimeline.jsx`

**Step 1: Update XAxis dataKey**

Find `dataKey="year"` on the XAxis and change it to:
```jsx
dataKey="label"
```

**Step 2: Update CustomTooltip to look up by label**

The tooltip currently does:
```jsx
const d = chartData.find(r => r.year === label);
```

Change it to:
```jsx
const d = chartData.find(r => r.label === label);
```

**Step 3: Update Cell key from `entry.year` to `entry.label`**

Find:
```jsx
key={entry.year}
```
Change to:
```jsx
key={entry.label}
```

**Step 4: Run the build**

Run: `npm run build`
Expected: Build succeeds with no errors.

---

### Task 4: Update the table

**Files:**
- Modify: `src/pages/StatsTimeline.jsx`

**Step 1: Update subtitle text**

Find:
```jsx
{chartData.length} year{chartData.length !== 1 ? 's' : ''}
```
Change to:
```jsx
{chartData.length} period{chartData.length !== 1 ? 's' : ''}
```

**Step 2: Update the table header "Year" → "Period"**

Find the `['Year', 'Books', 'Pages', 'Avg Rating']` array in the table header and change `'Year'` to `'Period'`.

**Step 3: Update the table row first-column from `row.year` to `row.label`**

Find:
```jsx
<td style={{ padding: '12px 20px', fontFamily: "'Playfair Display', serif", color: '#3A2010', fontWeight: 700 }}>{row.year}</td>
```
Change to:
```jsx
<td style={{ padding: '12px 20px', fontFamily: "'Playfair Display', serif", color: '#3A2010', fontWeight: 700 }}>{row.label}</td>
```

**Step 4: Run build and verify**

Run: `npm run build`
Expected: Clean build, no errors or warnings about `row.year`.

---

### Task 5: Commit

**Step 1: Stage and commit**

```bash
git add src/pages/StatsTimeline.jsx
git commit -m "feat: group early years into Childhood/Uni with From dropdown"
```
