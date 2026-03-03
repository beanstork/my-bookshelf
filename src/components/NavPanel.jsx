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
