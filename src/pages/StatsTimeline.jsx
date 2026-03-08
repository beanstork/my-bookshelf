import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { PAPER_BG } from '../paperBackground.js';


function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: '#2C1D12', border: '1px solid #4A3728',
      borderRadius: 8, padding: '10px 14px',
      fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    }}>
      <div style={{ color: '#D4A843', fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#E8D5B7' }}>{d.books} books · {d.pages?.toLocaleString()} pages</div>
      <div style={{ color: '#BFA88A' }}>Avg rating: {d.avgRating}</div>
    </div>
  );
}

export default function StatsTimeline({ books, onBack }) {
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

  // Dropdown options: only groups that actually have books
  const dropdownOptions = useMemo(
    () => allGroupedData.filter(g => g.books > 0).map(g => g.label),
    [allGroupedData]
  );

  // Slice allGroupedData from the selected label onwards
  const chartData = useMemo(() => {
    const idx = allGroupedData.findIndex(g => g.label === fromSelection);
    return idx === -1 ? allGroupedData : allGroupedData.slice(idx);
  }, [allGroupedData, fromSelection]);

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

  return (
    <div style={{ minHeight: '100vh', ...PAPER_BG, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: '48px 40px 60px', maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: '#5C0F1E', fontSize: 36, fontWeight: 900,
          margin: '0 0 8px', letterSpacing: '-0.5px',
        }}>
          Reading Over Time
        </h1>
        <p style={{ color: '#8B5E3C', fontSize: 14, margin: '0 0 32px' }}>
          {books.filter(b => b.s === 'read' && b.dr).length} books read across {chartData.length} period{chartData.length !== 1 ? 's' : ''}
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button style={toggleStyle(metric === 'books')} onClick={() => setMetric('books')}>Books</button>
          <button style={toggleStyle(metric === 'pages')} onClick={() => setMetric('pages')}>Pages</button>
        </div>

        {/* From selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
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
                dataKey="label"
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
                    key={entry.label}
                    fill={i === chartData.length - 1 ? '#8B2840' : '#D4A843'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.7)', borderRadius: 12,
          border: '1px solid rgba(200,160,120,0.2)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(212,168,67,0.1)', borderBottom: '1px solid rgba(200,160,120,0.25)' }}>
                {['Period', 'Books', 'Pages', 'Avg Rating'].map(h => (
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
                  key={row.label}
                  style={{ borderBottom: i < chartData.length - 1 ? '1px solid rgba(200,160,120,0.12)' : 'none' }}
                >
                  <td style={{ padding: '12px 20px', fontFamily: "'Playfair Display', serif", color: '#3A2010', fontWeight: 700 }}>
                    {row.label}
                    {row.label === 'Childhood' && <div style={{ fontSize: 10, color: '#8B7355', fontWeight: 400, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>2010–2012</div>}
                    {row.label === 'Uni' && <div style={{ fontSize: 10, color: '#8B7355', fontWeight: 400, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>2013–2018</div>}
                  </td>
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
