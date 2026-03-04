import { useState, useEffect } from 'react';
import { getPalette } from 'colorthief';

const CACHE_KEY = 'bookshelf_cover_colors_v3';
const BATCH_SIZE = 5;

function getCoverUrl(isbn) {
  if (!isbn) return null;
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
}

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

function hexLuminance(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const toLinear = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function hexSaturation(hex) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 0;
  const l = (max + min) / 2;
  return l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
}

async function extractColor(isbn) {
  return new Promise((resolve) => {
    const url = getCoverUrl(isbn);
    if (!url) return resolve(null);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = async () => {
      try {
        const palette = await getPalette(img, 8);
        if (!palette || palette.length === 0) return resolve(null);

        const hexColors = palette.map(c => c.hex());
        // Filter out near-black only — near-whites/grays have near-zero saturation
        // and will lose the saturation contest naturally (avoids filtering bright yellows)
        const filtered = hexColors.filter(hex => hexLuminance(hex) > 0.04);

        const candidates = filtered.length > 0 ? filtered : hexColors;
        // Pick the most saturated (most visually distinctive) color
        const best = candidates.reduce((a, b) => hexSaturation(a) >= hexSaturation(b) ? a : b);
        resolve(best);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export default function useCoverColors(books) {
  const [colors, setColors] = useState(() => loadCache());

  useEffect(() => {
    if (!books || books.length === 0) return;

    const cache = loadCache();
    const toProcess = books.filter(b => b.isbn && !cache[b.id]);

    if (toProcess.length === 0) return;

    let cancelled = false;

    async function processBatch(batch) {
      const results = await Promise.all(
        batch.map(async b => {
          const color = await extractColor(b.isbn);
          return { id: b.id, color };
        })
      );
      return results;
    }

    async function run() {
      const currentCache = loadCache();
      for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
        if (cancelled) break;
        const batch = toProcess.slice(i, i + BATCH_SIZE);
        const results = await processBatch(batch);
        results.forEach(({ id, color }) => {
          if (color) currentCache[id] = color;
        });
        saveCache(currentCache);
        if (!cancelled) setColors({ ...currentCache });
      }
    }

    run();
    return () => { cancelled = true; };
  }, [books]);

  return colors;
}
