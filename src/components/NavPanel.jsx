function IconShelf() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Bottom book (wide) */}
      <rect x="3" y="13" width="14" height="4" rx="1" />
      {/* Top-left book */}
      <rect x="3" y="7" width="5" height="5" rx="1" />
      {/* Top-right book */}
      <rect x="10" y="7" width="7" height="5" rx="1" />
    </svg>
  );
}

function IconTimeline() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="5" rx="0.5" />
      <rect x="8" y="8" width="4" height="9" rx="0.5" />
      <rect x="13" y="4" width="4" height="13" rx="0.5" />
    </svg>
  );
}

function IconGenres() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 10 L10 3 A7 7 0 0 1 16.06 13.5 Z" fill="currentColor" stroke="none" opacity="0.35" />
      <line x1="10" y1="10" x2="10" y2="3" />
      <line x1="10" y1="10" x2="16.06" y2="13.5" />
    </svg>
  );
}

function IconAuthors() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Pen nib */}
      <path d="M14 3 L17 6 L9 14 L5 15 L6 11 Z" />
      <line x1="12" y1="5" x2="15" y2="8" />
      {/* Underline */}
      <line x1="4" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function IconGoals() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="4" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const NAV_ITEMS = [
  { key: 'bookshelf', Icon: IconShelf, label: 'Shelf' },
  { key: 'timeline', Icon: IconTimeline, label: 'Over Time' },
  { key: 'genres', Icon: IconGenres, label: 'Genres' },
  { key: 'authors', Icon: IconAuthors, label: 'Authors' },
  { key: 'goals', Icon: IconGoals, label: 'Goals' },
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
      {NAV_ITEMS.map(({ key, Icon, label }) => {
        const active = currentView === key;
        return (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            title={label}
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
            <Icon />
            <span style={{
              fontSize: 9, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, letterSpacing: 0.6,
              textTransform: 'uppercase', lineHeight: 1,
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
