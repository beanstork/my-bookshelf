import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { PAPER_BG } from '../paperBackground.js';

// Defined at module scope so it is not recreated on every render.
// authorData is passed as a prop so the tooltip can look up author details.
function CustomTooltip({ active, payload, authorData }) {
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
}

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

  const chartData = useMemo(() => authorData.slice(0, 15).map(a => ({
    name: a.name.split(' ').pop(),
    fullName: a.name,
    count: a.count,
    pages: a.pages,
  })), [authorData]);

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
              <Tooltip
                content={(props) => <CustomTooltip {...props} authorData={authorData} />}
                cursor={{ fill: 'rgba(139,40,64,0.06)' }}
              />
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
          {authorData.map((author) => (
            <div key={author.name}>
              <div
                onClick={() => setExpanded(expanded === author.name ? null : author.name)}
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
                <span style={{ color: '#BFA88A', fontSize: 13 }}>{expanded === author.name ? '▲' : '▼'}</span>
              </div>
              {expanded === author.name && (
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
