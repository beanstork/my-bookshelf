function IconShelf() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="13" width="14" height="4" rx="1" />
      <rect x="3" y="7" width="5" height="5" rx="1" />
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
      <path d="M14 3 L17 6 L9 14 L5 15 L6 11 Z" />
      <line x1="12" y1="5" x2="15" y2="8" />
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
    <>
      <style>{`
        .nav-panel {
          position: fixed;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 200;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: rgba(255,251,245,0.6);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          padding: 10px 6px;
          box-shadow: 0 4px 24px rgba(80,40,20,0.18), 0 1px 4px rgba(80,40,20,0.08);
          border: 1px solid rgba(200,160,120,0.35);
        }
        .nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 9px 10px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.18s;
          min-width: 54px;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          line-height: 1;
        }
        @media (max-width: 768px) {
          .nav-panel {
            left: 0;
            right: 0;
            top: 0;
            transform: none;
            flex-direction: row;
            justify-content: center;
            border-radius: 0 0 16px 16px;
            padding: 6px 8px;
            gap: 2px;
          }
          .nav-btn {
            padding: 7px 10px;
            min-width: 48px;
          }
        }
      `}</style>
      <div className="nav-panel">
        {NAV_ITEMS.map(({ key, Icon, label }) => {
          const active = currentView === key;
          return (
            <button
              key={key}
              className="nav-btn"
              onClick={() => onNavigate(key)}
              title={label}
              style={{
                background: active ? '#8B2840' : 'transparent',
                color: active ? '#FDF0F3' : '#6B3520',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(139,40,64,0.10)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon />
              <span className="nav-label">{label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
