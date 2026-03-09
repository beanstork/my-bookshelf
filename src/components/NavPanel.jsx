function IconShelf() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="13" width="14" height="4" rx="1" />
      <rect x="3" y="7" width="5" height="5" rx="1" />
      <rect x="10" y="7" width="7" height="5" rx="1" />
    </svg>
  );
}

function IconTimeline() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="5" rx="0.5" />
      <rect x="8" y="8" width="4" height="9" rx="0.5" />
      <rect x="13" y="4" width="4" height="13" rx="0.5" />
    </svg>
  );
}

function IconGenres() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 10 L10 3 A7 7 0 0 1 16.06 13.5 Z" fill="currentColor" stroke="none" opacity="0.35" />
      <line x1="10" y1="10" x2="10" y2="3" />
      <line x1="10" y1="10" x2="16.06" y2="13.5" />
    </svg>
  );
}

function IconAuthors() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3 L17 6 L9 14 L5 15 L6 11 Z" />
      <line x1="12" y1="5" x2="15" y2="8" />
      <line x1="4" y1="17" x2="16" y2="17" />
    </svg>
  );
}

function IconGoals() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
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
        .nav-strip {
          background: rgba(180,130,75,0.13);
          border-bottom: 1px solid rgba(150,95,45,0.2);
        }
        .nav-strip-inner {
          display: flex;
          align-items: center;
          gap: 4px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 8px 20px;
          flex-wrap: wrap;
        }
        .nav-strip-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 20px;
          border: 1px solid transparent;
          background: transparent;
          color: #6B3520;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .nav-strip-btn:hover:not(.nav-strip-active) {
          background: rgba(139,40,64,0.08);
          color: #5C1830;
          border-color: rgba(139,40,64,0.15);
        }
        .nav-strip-active {
          background: #8B2840;
          color: #FDF0F3;
          border-color: #8B2840;
          font-weight: 600;
        }
      `}</style>
      <div className="nav-strip">
        <div className="nav-strip-inner">
          {NAV_ITEMS.map(({ key, Icon, label }) => (
            <button
              key={key}
              className={`nav-strip-btn${currentView === key ? ' nav-strip-active' : ''}`}
              onClick={() => onNavigate(key)}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
