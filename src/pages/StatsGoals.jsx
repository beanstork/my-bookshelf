import { useState, useEffect, useMemo } from 'react';
import { PAPER_BG } from '../paperBackground.js';

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
      const yr = parseInt(b.dr.substring(0, 4), 10);
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
      .catch((err) => { console.warn('[StatsGoals] /api/reading-goal fetch failed:', err); })
      .finally(() => setFetching(false));
  }, [currentYear]);

  const startEdit = (year) => {
    setEditingYear(year);
    setEditValue(String(goals[year] || ''));
  };

  const saveEdit = (year) => {
    const val = parseInt(editValue, 10);
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
    <div style={{ minHeight: '100vh', ...PAPER_BG, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: '48px 40px 60px', maxWidth: 900, margin: '0 auto' }}>
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
              {allYears.filter(y => y !== currentYear).map((year) => {
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
