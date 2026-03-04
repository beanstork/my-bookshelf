import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PAPER_BG } from '../paperBackground.js';

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
    <div style={{ minHeight: '100vh', ...PAPER_BG, fontFamily: "'DM Sans', sans-serif" }}>
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
