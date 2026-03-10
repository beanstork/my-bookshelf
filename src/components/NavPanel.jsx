function IconShelf() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="13" width="14" height="4" rx="1" />
      <rect x="3" y="7" width="5" height="5" rx="1" />
      <rect x="10" y="7" width="7" height="5" rx="1" />
    </svg>
  );
}

function IconStats() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="10" width="3" height="7" rx="0.5" />
      <rect x="8.5" y="6" width="3" height="11" rx="0.5" />
      <rect x="14" y="3" width="3" height="14" rx="0.5" />
      <line x1="1" y1="17.5" x2="19" y2="17.5" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function IconNextRead() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4 C4 4 7 3 10 5 C13 3 16 4 16 4 L16 15 C16 15 13 14 10 16 C7 14 4 15 4 15 Z" />
      <line x1="10" y1="5" x2="10" y2="16" />
      <path d="M13 8.5 L15 10.5 L13 12.5" strokeWidth="1.3" />
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

const MAIN_NAV = [
  { key: 'bookshelf', Icon: IconShelf, label: 'Shelf' },
  { key: 'stats', Icon: IconStats, label: 'Stats' },
  { key: 'next-read', Icon: IconNextRead, label: 'Next Read' },
];

const STATS_SUB_NAV = [
  { key: 'timeline', Icon: IconTimeline, label: 'Over Time' },
  { key: 'genres', Icon: IconGenres, label: 'Genres' },
  { key: 'authors', Icon: IconAuthors, label: 'Authors' },
  { key: 'goals', Icon: IconGoals, label: 'Goals' },
];

const STATS_KEYS = new Set(['timeline', 'genres', 'authors', 'goals']);

export default function NavPanel({ currentView, onNavigate }) {
  const isStatsActive = STATS_KEYS.has(currentView);

  return (
    <>
      <style>{`
        .nav-strip-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 20px 0;
        }
        .nav-strip-inner {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255,250,245,0.65);
          border: 1px solid rgba(180,130,80,0.22);
          border-radius: 28px;
          padding: 6px 8px;
          box-shadow: 0 2px 10px rgba(100,60,20,0.1);
        }
        .nav-strip-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          border-radius: 22px;
          border: 1px solid transparent;
          background: transparent;
          color: #6B3520;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          line-height: 1;
        }
        .nav-strip-btn:hover:not(.nav-strip-active) {
          background: rgba(139,40,64,0.07);
          color: #5C1830;
        }
        .nav-strip-active {
          background: #8B2840;
          color: #FDF0F3 !important;
          border-color: #8B2840;
          font-weight: 600;
        }
        .nav-sub-strip {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-top: 6px;
          background: rgba(255,250,245,0.5);
          border: 1px solid rgba(180,130,80,0.18);
          border-radius: 20px;
          padding: 4px 6px;
          margin-bottom: 4px;
        }
        .nav-sub-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 16px;
          border: 1px solid transparent;
          background: transparent;
          color: #6B3520;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          line-height: 1;
        }
        .nav-sub-btn:hover:not(.nav-sub-active) {
          background: rgba(139,40,64,0.07);
          color: #5C1830;
        }
        .nav-sub-active {
          background: rgba(139,40,64,0.12);
          color: #8B2840 !important;
          border-color: rgba(139,40,64,0.2);
          font-weight: 600;
        }
      `}</style>
      <div className="nav-strip-wrap">
        <div className="nav-strip-inner">
          {MAIN_NAV.map(({ key, Icon, label }) => (
            <button
              key={key}
              className={`nav-strip-btn${(key === 'stats' ? isStatsActive : currentView === key) ? ' nav-strip-active' : ''}`}
              onClick={() => {
                if (key === 'stats') {
                  if (!isStatsActive) onNavigate('timeline');
                } else {
                  onNavigate(key);
                }
              }}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
        {isStatsActive && (
          <div className="nav-sub-strip">
            {STATS_SUB_NAV.map(({ key, Icon, label }) => (
              <button
                key={key}
                className={`nav-sub-btn${currentView === key ? ' nav-sub-active' : ''}`}
                onClick={() => onNavigate(key)}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
