import { useMemo } from 'react';

// Determine season from current month
const MONTH = new Date().getMonth(); // 0=Jan, 11=Dec
const SEASON =
  MONTH >= 2 && MONTH <= 4 ? 'spring'
  : MONTH >= 5 && MONTH <= 7 ? 'summer'
  : MONTH >= 8 && MONTH <= 10 ? 'autumn'
  : 'winter';

// Simple seeded RNG for stable, consistent layouts across renders
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

// SVG elements per season
const ELEMENTS = {
  spring: [
    // Cherry blossom full flower
    () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="3.5" r="3.5" fill="#FFB7C5" />
        <circle cx="14.2" cy="6.5" r="3.5" fill="#FF9EBA" />
        <circle cx="12.5" cy="12.5" r="3.5" fill="#FFB7C5" />
        <circle cx="5.5" cy="12.5" r="3.5" fill="#FF9EBA" />
        <circle cx="3.8" cy="6.5" r="3.5" fill="#FFB7C5" />
        <circle cx="9" cy="9" r="3" fill="#FFF5E1" />
        <circle cx="9" cy="9" r="1.2" fill="#F5A623" opacity="0.7" />
      </svg>
    ),
    // Single petal
    () => (
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
        <ellipse cx="5" cy="8" rx="4" ry="7" fill="#FFB7C5" opacity="0.85" />
        <line x1="5" y1="2" x2="5" y2="14" stroke="#FF8FAB" strokeWidth="0.5" opacity="0.4" />
      </svg>
    ),
    // Tiny blossom cluster
    () => (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="3.5" r="3" fill="#FFCDD9" />
        <circle cx="10.5" cy="7" r="3" fill="#FFB7C5" />
        <circle cx="3.5" cy="7" r="3" fill="#FFB7C5" />
        <circle cx="7" cy="10.5" r="3" fill="#FFCDD9" />
        <circle cx="7" cy="7" r="2.5" fill="#FFF5E8" />
      </svg>
    ),
  ],

  summer: [
    // Teal fish
    () => (
      <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
        <polygon points="22,0 22,14 16,7" fill="#26B5A8" />
        <ellipse cx="9" cy="7" rx="8" ry="5" fill="#2EC4B6" />
        <circle cx="5" cy="5.5" r="1.2" fill="#0D2626" />
        <ellipse cx="8" cy="6.5" rx="3" ry="2.5" fill="white" opacity="0.12" />
      </svg>
    ),
    // Coral fish
    () => (
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
        <polygon points="18,0 18,12 13,6" fill="#E8705A" />
        <ellipse cx="7.5" cy="6" rx="7" ry="4.5" fill="#FF8E8E" />
        <circle cx="4" cy="4.5" r="1" fill="#2A0A0A" />
        <ellipse cx="7" cy="5.5" rx="2.5" ry="2" fill="white" opacity="0.14" />
      </svg>
    ),
    // Starfish
    () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <polygon
          points="9,1 10.8,6.8 17,5.5 12.5,9.5 15,16 9,12.5 3,16 5.5,9.5 1,5.5 7.2,6.8"
          fill="#FF7043"
        />
      </svg>
    ),
    // Bubble
    () => (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" fill="rgba(135,206,235,0.25)" stroke="#87CEEB" strokeWidth="1" opacity="0.8" />
        <circle cx="4.5" cy="4.5" r="1.2" fill="white" opacity="0.5" />
      </svg>
    ),
  ],

  autumn: [
    // Orange leaf
    () => (
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M8,1 C11,4 14,7 14,11 C14,15.5 11.5,19 8,19 C4.5,19 2,15.5 2,11 C2,7 5,4 8,1Z" fill="#D4622A" />
        <line x1="8" y1="1" x2="8" y2="19" stroke="#8B2500" strokeWidth="0.8" opacity="0.35" />
        <line x1="8" y1="8" x2="12.5" y2="5.5" stroke="#8B2500" strokeWidth="0.6" opacity="0.3" />
        <line x1="8" y1="8" x2="3.5" y2="5.5" stroke="#8B2500" strokeWidth="0.6" opacity="0.3" />
        <line x1="8" y1="12" x2="13" y2="9.5" stroke="#8B2500" strokeWidth="0.6" opacity="0.3" />
        <line x1="8" y1="12" x2="3" y2="9.5" stroke="#8B2500" strokeWidth="0.6" opacity="0.3" />
      </svg>
    ),
    // Red leaf
    () => (
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
        <path d="M7,1 C10,4 13,7 12,11 C11,15 9,17 7,17 C5,17 3,15 2,11 C1,7 4,4 7,1Z" fill="#C0392B" />
        <line x1="7" y1="1" x2="7" y2="17" stroke="#7B241C" strokeWidth="0.8" opacity="0.35" />
        <line x1="7" y1="8" x2="11" y2="6" stroke="#7B241C" strokeWidth="0.6" opacity="0.3" />
        <line x1="7" y1="8" x2="3" y2="6" stroke="#7B241C" strokeWidth="0.6" opacity="0.3" />
        <line x1="7" y1="12" x2="11.5" y2="9.5" stroke="#7B241C" strokeWidth="0.6" opacity="0.3" />
        <line x1="7" y1="12" x2="2.5" y2="9.5" stroke="#7B241C" strokeWidth="0.6" opacity="0.3" />
      </svg>
    ),
    // Golden leaf
    () => (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5,1 C10.5,3.5 14,6 13,9.5 C12,13 10,14 7.5,14 C5,14 3,13 2,9.5 C1,6 4.5,3.5 7.5,1Z" fill="#E8873A" />
        <line x1="7.5" y1="1" x2="7.5" y2="14" stroke="#A05020" strokeWidth="0.7" opacity="0.3" />
        <line x1="7.5" y1="7" x2="12" y2="5" stroke="#A05020" strokeWidth="0.5" opacity="0.25" />
        <line x1="7.5" y1="7" x2="3" y2="5" stroke="#A05020" strokeWidth="0.5" opacity="0.25" />
      </svg>
    ),
    // Acorn
    () => (
      <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
        <rect x="2" y="4" width="8" height="6" rx="2" fill="#5C3A10" />
        <ellipse cx="6" cy="13" rx="4.5" ry="5" fill="#8B6320" />
        <line x1="6" y1="1.5" x2="6" y2="4" stroke="#3A2810" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  ],

  winter: [
    // Holly sprig
    () => (
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
        <ellipse cx="7" cy="13" rx="5" ry="8" fill="#2E7D32" transform="rotate(-30 7 13)" />
        <ellipse cx="17" cy="13" rx="5" ry="8" fill="#1B5E20" transform="rotate(30 17 13)" />
        <circle cx="10" cy="5" r="2.8" fill="#C0392B" />
        <circle cx="14" cy="4" r="2.8" fill="#E74C3C" />
        <circle cx="12" cy="6.5" r="2.8" fill="#C0392B" />
        <circle cx="10" cy="5" r="1" fill="#FF8A80" opacity="0.5" />
        <circle cx="14" cy="4" r="1" fill="#FF8A80" opacity="0.5" />
        <circle cx="12" cy="6.5" r="1" fill="#FF8A80" opacity="0.5" />
      </svg>
    ),
    // Snowflake (large)
    () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <g transform="translate(9,9)" stroke="#C8E6F5" strokeWidth="1.3" opacity="0.9">
          <line x1="0" y1="-8" x2="0" y2="8" />
          <line x1="-8" y1="0" x2="8" y2="0" />
          <line x1="-5.7" y1="-5.7" x2="5.7" y2="5.7" />
          <line x1="5.7" y1="-5.7" x2="-5.7" y2="5.7" />
          <line x1="-2" y1="-6" x2="2" y2="-6" />
          <line x1="-2" y1="6" x2="2" y2="6" />
          <line x1="-6" y1="-2" x2="-6" y2="2" />
          <line x1="6" y1="-2" x2="6" y2="2" />
        </g>
      </svg>
    ),
    // Pine sprig
    () => (
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <line x1="8" y1="2" x2="8" y2="19" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8,3 L2,10 L5,10 L1,15 L5.5,15 L3,19 L13,19 L10.5,15 L15,15 L11,10 L14,10 Z" fill="#2E7D32" />
      </svg>
    ),
    // Snowflake (small)
    () => (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <g transform="translate(6,6)" stroke="#B3D9F0" strokeWidth="1.1" opacity="0.85">
          <line x1="0" y1="-5" x2="0" y2="5" />
          <line x1="-5" y1="0" x2="5" y2="0" />
          <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" />
          <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" />
        </g>
      </svg>
    ),
  ],
};

// Animation names per season
const ANIMATION_NAMES = {
  spring: ['garlandSway', 'garlandFloat', 'garlandSpin'],
  summer: ['garlandFloat', 'garlandSway', 'garlandFishBob'],
  autumn: ['garlandLeafDrift', 'garlandSway', 'garlandFloat'],
  winter: ['garlandSway', 'garlandSnowDrift', 'garlandSpin'],
};

const KEYFRAMES = `
  @keyframes garlandSway {
    0%, 100% { transform: rotate(-10deg); }
    50% { transform: rotate(10deg); }
  }
  @keyframes garlandFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
  @keyframes garlandSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes garlandLeafDrift {
    0%, 100% { transform: rotate(-20deg) translateY(0px); }
    33% { transform: rotate(15deg) translateY(-4px); }
    66% { transform: rotate(-8deg) translateY(3px); }
  }
  @keyframes garlandFishBob {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
  }
  @keyframes garlandSnowDrift {
    0%, 100% { transform: translateX(0px) rotate(0deg); }
    50% { transform: translateX(5px) rotate(180deg); }
  }
`;

// ─── To remove this feature: delete this file and revert the 3 lines in App.jsx ───
export default function SeasonalGarland() {
  const particles = useMemo(() => {
    const rng = makeRng(12345);
    const anims = ANIMATION_NAMES[SEASON];
    const elemCount = ELEMENTS[SEASON].length;
    const result = [];

    // Top strip — decorations along the top wooden border
    const topCount = 14;
    for (let i = 0; i < topCount; i++) {
      const basePct = 2 + (i / (topCount - 1)) * 96;
      const leftPct = Math.max(1, Math.min(98, basePct + (rng() - 0.5) * 4));
      result.push({
        outer: {
          left: `${leftPct.toFixed(1)}%`,
          top: `${(2 + rng() * 11).toFixed(1)}px`,
        },
        inner: {
          transform: `rotate(${((rng() - 0.5) * 70).toFixed(1)}deg) scale(${(0.7 + rng() * 0.55).toFixed(2)})`,
          animation: `${anims[Math.floor(rng() * anims.length)]} ${(4 + rng() * 5).toFixed(1)}s ${(-(rng() * 9)).toFixed(1)}s ease-in-out infinite`,
        },
        opacity: 0.7 + rng() * 0.3,
        elemIdx: Math.floor(rng() * elemCount),
      });
    }

    // Left strip — decorations along the left wooden border
    const sideCount = 7;
    for (let i = 0; i < sideCount; i++) {
      const basePct = 4 + (i / (sideCount - 1)) * 87;
      const topPct = Math.max(3, Math.min(95, basePct + (rng() - 0.5) * 3));
      result.push({
        outer: {
          left: `${(2 + rng() * 10).toFixed(1)}px`,
          top: `${topPct.toFixed(1)}%`,
        },
        inner: {
          transform: `rotate(${((rng() - 0.5) * 80).toFixed(1)}deg) scale(${(0.65 + rng() * 0.5).toFixed(2)})`,
          animation: `${anims[Math.floor(rng() * anims.length)]} ${(4 + rng() * 5).toFixed(1)}s ${(-(rng() * 9)).toFixed(1)}s ease-in-out infinite`,
        },
        opacity: 0.65 + rng() * 0.35,
        elemIdx: Math.floor(rng() * elemCount),
      });
    }

    // Right strip — decorations along the right wooden border
    for (let i = 0; i < sideCount; i++) {
      const basePct = 4 + (i / (sideCount - 1)) * 87;
      const topPct = Math.max(3, Math.min(95, basePct + (rng() - 0.5) * 3));
      result.push({
        outer: {
          right: `${(2 + rng() * 10).toFixed(1)}px`,
          top: `${topPct.toFixed(1)}%`,
        },
        inner: {
          transform: `rotate(${((rng() - 0.5) * 80).toFixed(1)}deg) scale(${(0.65 + rng() * 0.5).toFixed(2)})`,
          animation: `${anims[Math.floor(rng() * anims.length)]} ${(4 + rng() * 5).toFixed(1)}s ${(-(rng() * 9)).toFixed(1)}s ease-in-out infinite`,
        },
        opacity: 0.65 + rng() * 0.35,
        elemIdx: Math.floor(rng() * elemCount),
      });
    }

    return result;
  }, []);

  const elements = ELEMENTS[SEASON];

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          borderRadius: 14,
          zIndex: 10,
        }}
      >
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              opacity: p.opacity,
              ...p.outer,
            }}
          >
            <div style={p.inner}>
              {elements[p.elemIdx]()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
