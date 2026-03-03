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
  const [metric, setMetric] = useState('books');

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

        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          <button style={toggleStyle(metric === 'books')} onClick={() => setMetric('books')}>Books</button>
          <button style={toggleStyle(metric === 'pages')} onClick={() => setMetric('pages')}>Pages</button>
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
