import { useState, useEffect } from 'react';
import { getSwatches } from 'colorthief';

const CACHE_KEY = 'bookshelf_cover_colors_v4';
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

const SWATCH_PRIORITY = ['Vibrant', 'LightVibrant', 'DarkVibrant', 'Muted', 'LightMuted', 'DarkMuted'];

async function extractColor(isbn) {
  return new Promise((resolve) => {
    const url = getCoverUrl(isbn);
    if (!url) return resolve(null);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = async () => {
      try {
        const swatches = await getSwatches(img);
        for (const role of SWATCH_PRIORITY) {
          if (swatches[role]?.color) {
            resolve(swatches[role].color.hex());
            return;
          }
        }
        resolve(null);
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
