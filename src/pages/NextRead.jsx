import { useState, useMemo } from 'react';

const MOOD_MAP = {
  Comforting:        ['contemporary', 'romance', 'humor', 'fiction', 'feel-good'],
  Challenging:       ['philosophy', 'classics', 'literary fiction', 'literary-fiction', 'non-fiction', 'nonfiction'],
  Adventurous:       ['fantasy', 'science fiction', 'science-fiction', 'sci-fi', 'adventure', 'thriller', 'action'],
  Emotional:         ['romance', 'literary fiction', 'literary-fiction', 'drama', 'contemporary', 'grief'],
  'Thought-provoking': ['science fiction', 'science-fiction', 'sci-fi', 'philosophy', 'non-fiction', 'nonfiction', 'historical fiction', 'historical-fiction'],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function NextRead({ books }) {
  const toReadBooks = useMemo(() => (books || []).filter(b => b.s === 'to-read'), [books]);

  const availableGenres = useMemo(() => {
    const set = new Set();
    toReadBooks.forEach(b => (b.g || []).forEach(g => set.add(g.toLowerCase())));
    return Array.from(set).sort();
  }, [toReadBooks]);

  const availableMoods = useMemo(() => {
    return Object.keys(MOOD_MAP).filter(mood =>
      toReadBooks.some(b => (b.g || []).some(g => MOOD_MAP[mood].includes(g.toLowerCase())))
    );
  }, [toReadBooks]);

  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [selectedLength, setSelectedLength] = useState('any');
  const [selectedMoods, setSelectedMoods] = useState(new Set());
  const [pickedBook, setPickedBook] = useState(null);
  const [seenIds, setSeenIds] = useState(new Set());
  const [celebrated, setCelebrated] = useState(false);

  const toggleGenre = (g) => setSelectedGenres(prev => {
    const next = new Set(prev);
    next.has(g) ? next.delete(g) : next.add(g);
    return next;
  });

  const toggleMood = (m) => setSelectedMoods(prev => {
    const next = new Set(prev);
    next.has(m) ? next.delete(m) : next.add(m);
    return next;
  });

  const eligible = useMemo(() => {
    return toReadBooks.filter(b => {
      const genres = (b.g || []).map(g => g.toLowerCase());
      const hasGenres = genres.length > 0;

      if (selectedGenres.size > 0) {
        if (!genres.some(g => selectedGenres.has(g))) return false;
      }

      if (selectedLength === 'short' && (b.p <= 0 || b.p >= 300)) return false;
      if (selectedLength === 'long' && (b.p <= 0 || b.p < 500)) return false;

      if (selectedMoods.size > 0) {
        if (!hasGenres) return false;
        const moodGenres = Array.from(selectedMoods).flatMap(m => MOOD_MAP[m] || []);
        if (!genres.some(g => moodGenres.includes(g))) return false;
      }

      return true;
    });
  }, [toReadBooks, selectedGenres, selectedLength, selectedMoods]);

  const pick = () => {
    let pool = eligible.filter(b => !seenIds.has(b.id));
    if (pool.length === 0) {
      const resetSeen = new Set(pickedBook ? [pickedBook.id] : []);
      setSeenIds(resetSeen);
      pool = eligible.filter(b => !resetSeen.has(b.id));
    }
    if (pool.length === 0) return;
    const chosen = pickRandom(pool);
    setSeenIds(prev => new Set([...prev, chosen.id]));
    setPickedBook(chosen);
    setCelebrated(false);
  };

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#F2E8D9',
    fontFamily: "'DM Sans', sans-serif",
    padding: '32px 20px 60px',
  };
  const innerStyle = {
    maxWidth: 680,
    margin: '0 auto',
  };
  const headingStyle = {
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#3A1A0A',
    fontSize: 28,
    fontWeight: 700,
    margin: '0 0 4px',
  };
  const subheadingStyle = {
    color: '#8B5E3C',
    fontSize: 14,
    margin: '0 0 32px',
  };
  const sectionLabelStyle = {
    color: '#D4A843',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: 600,
    marginBottom: 10,
    display: 'block',
  };
  const chipBase = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 14px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: '1px solid',
    fontFamily: "'DM Sans', sans-serif",
  };
  const chipInactive = {
    ...chipBase,
    background: 'rgba(255,250,245,0.7)',
    borderColor: 'rgba(180,130,80,0.3)',
    color: '#6B3520',
  };
  const chipActive = {
    ...chipBase,
    background: '#8B2840',
    borderColor: '#8B2840',
    color: '#FDF0F3',
  };
  const lengthBtnBase = {
    padding: '7px 20px',
    borderRadius: 20,
    border: '1px solid',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  };

  if (toReadBooks.length === 0) {
    return (
      <div style={pageStyle}>
        <div style={innerStyle}>
          <h1 style={headingStyle}>Next Read</h1>
          <p style={{ color: '#8B5E3C', fontSize: 15, marginTop: 40, textAlign: 'center' }}>
            Your To Read shelf is empty — add some books first!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={innerStyle}>
        <h1 style={headingStyle}>Next Read</h1>
        <p style={subheadingStyle}>Tell me what you're in the mood for and I'll pick a book from your shelf.</p>

        {availableGenres.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <span style={sectionLabelStyle}>Genre</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {availableGenres.map(g => (
                <button
                  key={g}
                  style={selectedGenres.has(g) ? chipActive : chipInactive}
                  onClick={() => toggleGenre(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 28 }}>
          <span style={sectionLabelStyle}>Length</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { key: 'short', label: 'Short  (< 300p)' },
              { key: 'any',   label: 'Any length' },
              { key: 'long',  label: 'Long  (> 500p)' },
            ].map(({ key, label }) => (
              <button
                key={key}
                style={{
                  ...lengthBtnBase,
                  background: selectedLength === key ? '#8B2840' : 'rgba(255,250,245,0.7)',
                  borderColor: selectedLength === key ? '#8B2840' : 'rgba(180,130,80,0.3)',
                  color: selectedLength === key ? '#FDF0F3' : '#6B3520',
                }}
                onClick={() => setSelectedLength(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {availableMoods.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <span style={sectionLabelStyle}>Mood</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {availableMoods.map(m => (
                <button
                  key={m}
                  style={selectedMoods.has(m) ? chipActive : chipInactive}
                  onClick={() => toggleMood(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {eligible.length === 0 ? (
          <p style={{ color: '#8B5E3C', fontSize: 13, marginBottom: 32, fontStyle: 'italic' }}>
            No books match those filters — try loosening your criteria.
          </p>
        ) : (
          <button
            onClick={pick}
            style={{
              padding: '12px 32px',
              borderRadius: 24,
              border: 'none',
              background: '#8B2840',
              color: '#FDF0F3',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 40,
              boxShadow: '0 2px 12px rgba(139,40,64,0.25)',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            {pickedBook ? 'Try another' : `Pick from ${eligible.length} book${eligible.length !== 1 ? 's' : ''}`}
          </button>
        )}

        {pickedBook && !celebrated && (
          <div style={{
            background: 'rgba(255,250,245,0.8)',
            border: '1px solid rgba(180,130,80,0.25)',
            borderRadius: 16,
            padding: 28,
            display: 'flex',
            gap: 24,
            alignItems: 'flex-start',
            boxShadow: '0 4px 20px rgba(100,60,20,0.1)',
          }}>
            <div style={{ flexShrink: 0 }}>
              {pickedBook.cover ? (
                <img
                  src={pickedBook.cover}
                  alt={pickedBook.t}
                  style={{ width: 90, height: 135, objectFit: 'cover', borderRadius: 6, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                />
              ) : (
                <div style={{
                  width: 90, height: 135, borderRadius: 6,
                  background: 'linear-gradient(135deg, #8B2840, #5C1830)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 28 }}>📖</span>
                </div>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: '#3A1A0A', fontSize: 22, fontWeight: 700,
                margin: '0 0 4px', lineHeight: 1.3,
              }}>
                {pickedBook.t}
              </h2>
              <p style={{ color: '#6B3520', fontSize: 14, margin: '0 0 10px', fontWeight: 500 }}>
                {pickedBook.a}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {pickedBook.p > 0 && (
                  <span style={{ fontSize: 12, color: '#8B5E3C' }}>{pickedBook.p} pages</span>
                )}
                {pickedBook.y && (
                  <span style={{ fontSize: 12, color: '#8B5E3C' }}>· {pickedBook.y}</span>
                )}
                {pickedBook.ar > 0 && (
                  <span style={{ fontSize: 12, color: '#8B5E3C' }}>· ★ {pickedBook.ar.toFixed(1)} on Goodreads</span>
                )}
                {pickedBook.sn && (
                  <span style={{ fontSize: 12, color: '#8B5E3C' }}>· {pickedBook.sn}{pickedBook.si > 0 ? ` #${pickedBook.si}` : ''}</span>
                )}
              </div>
              {(pickedBook.g || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {pickedBook.g.map(g => (
                    <span key={g} style={{
                      background: 'rgba(212,168,67,0.12)',
                      border: '1px solid rgba(212,168,67,0.25)',
                      borderRadius: 20, padding: '3px 10px',
                      fontSize: 11, color: '#6B4A10',
                    }}>{g}</span>
                  ))}
                </div>
              )}
              <button
                onClick={() => setCelebrated(true)}
                style={{
                  padding: '9px 24px',
                  borderRadius: 20,
                  border: 'none',
                  background: '#D4A843',
                  color: '#3A1A0A',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}
              >
                That's the one! 🎉
              </button>
            </div>
          </div>
        )}

        {celebrated && pickedBook && (
          <div style={{
            background: 'rgba(255,250,245,0.8)',
            border: '1px solid rgba(212,168,67,0.3)',
            borderRadius: 16,
            padding: 36,
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(100,60,20,0.1)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: '#3A1A0A', fontSize: 22, margin: '0 0 8px',
            }}>
              Happy reading!
            </h2>
            <p style={{ color: '#6B3520', fontSize: 15, margin: '0 0 4px', fontWeight: 600 }}>
              {pickedBook.t}
            </p>
            <p style={{ color: '#8B5E3C', fontSize: 13, margin: 0 }}>by {pickedBook.a}</p>
          </div>
        )}
      </div>
    </div>
  );
}
