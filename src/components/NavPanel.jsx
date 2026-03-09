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
        .nav-sidebar {
          width: 72px;
          min-height: 100vh;
          background: linear-gradient(180deg, #C4A472 0%, #AD8848 40%, #B8924E 70%, #C4A472 100%);
          border-right: 2px solid #8A6830;
          box-shadow: 3px 0 18px rgba(60,35,10,0.22);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 28px 0 20px;
          gap: 2px;
          position: sticky;
          top: 0;
          height: 100vh;
          flex-shrink: 0;
          z-index: 100;
          overflow-y: auto;
        }
        .nav-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 12px 6px;
          border: none;
          border-left: 3px solid transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
          background: transparent;
          color: rgba(40,18,4,0.6);
          position: relative;
        }
        .nav-tab:hover:not(.nav-tab-active) {
          background: rgba(255,245,225,0.18);
          color: rgba(40,18,4,0.88);
          border-left-color: rgba(139,40,64,0.35);
        }
        .nav-tab-active {
          background: #F2E8D9;
          color: #8B2840;
          border-left: 3px solid #8B2840;
          border-radius: 8px 0 0 8px;
          margin-right: -2px;
          box-shadow: inset 0 1px 0 rgba(255,220,180,0.4), 2px 0 0 #F2E8D9;
        }
        .nav-tab-active:hover {
          background: #F2E8D9;
        }
        .nav-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          line-height: 1;
        }
        .nav-divider {
          height: 1px;
          background: rgba(80,45,10,0.2);
          margin: 8px 10px;
        }
      `}</style>
      <div className="nav-sidebar">
        {NAV_ITEMS.map(({ key, Icon, label }, i) => (
          <button
            key={key}
            className={`nav-tab${currentView === key ? ' nav-tab-active' : ''}`}
            onClick={() => onNavigate(key)}
            title={label}
          >
            <Icon />
            <span className="nav-label">{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
