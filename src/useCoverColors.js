import { useState, useEffect } from 'react';
import { getColor, getSwatches } from 'colorthief';

const CACHE_KEY = 'bookshelf_cover_colors_v7';
const BATCH_SIZE = 5;

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

const SWATCH_ROLES = ['Vibrant', 'LightVibrant', 'DarkVibrant', 'Muted', 'LightMuted', 'DarkMuted'];

async function extractColor(coverUrl) {
  return new Promise((resolve) => {
    if (!coverUrl) return resolve(null);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = async () => {
      try {
        // If dominant color is very dark or very light, the cover is dominated
        // by that tone — use it directly rather than hunting for a vibrant accent
        const dominant = await getColor(img);
        const dominantHex = dominant?.hex() ?? null;
        if (dominantHex) {
          const lum = hexLuminance(dominantHex);
          if (lum < 0.08 || lum > 0.85) {
            resolve(dominantHex);
            return;
          }
        }

        // Otherwise pick the most saturated swatch across all roles
        // (avoids fixed priority mis-classifying e.g. bright yellow as LightVibrant)
        const swatches = await getSwatches(img);
        const swatchColors = SWATCH_ROLES
          .map(role => swatches[role]?.color?.hex())
          .filter(Boolean);

        if (swatchColors.length > 0) {
          const best = swatchColors.reduce((a, b) => hexSaturation(a) >= hexSaturation(b) ? a : b);
          resolve(best);
          return;
        }

        resolve(dominantHex);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = coverUrl;
  });
}

export default function useCoverColors(books) {
  const [colors, setColors] = useState(() => loadCache());

  useEffect(() => {
    if (!books || books.length === 0) return;

    const cache = loadCache();
    const toProcess = books.filter(b => b.cover && !cache[b.id]);

    if (toProcess.length === 0) return;

    let cancelled = false;

    async function processBatch(batch) {
      const results = await Promise.all(
        batch.map(async b => {
          const color = await extractColor(b.cover);
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
