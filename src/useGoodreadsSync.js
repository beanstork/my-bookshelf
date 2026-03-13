import { useState, useEffect } from 'react';
import SERIES_OVERRIDES from './seriesOverrides.js';

function mergeSeriesOverrides(books) {
  return books.map(b => {
    const override = SERIES_OVERRIDES[b.id];
    return override ? { ...b, sn: override.sn, si: override.si } : b;
  });
}

export default function useGoodreadsSync(fallbackBooks) {
  const [books, setBooks] = useState(fallbackBooks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let timeoutId;

    async function fetchBooks() {
      timeoutId = setTimeout(() => controller.abort(), 10000);
      try {
        const rssUrl = (() => {
          try { return JSON.parse(localStorage.getItem('bookshelf_settings_v1') || '{}').goodreadsRssUrl || ''; }
          catch { return ''; }
        })();
        const apiUrl = rssUrl ? `/api/goodreads?rssUrl=${encodeURIComponent(rssUrl)}` : '/api/goodreads';
        const res = await fetch(apiUrl, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setBooks(mergeSeriesOverrides(data));
        setError(null);
      } catch (err) {
        if (controller.signal.aborted) {
          setError('Sync timed out — showing saved data');
        } else {
          console.warn('Goodreads sync failed, using local data:', err.message);
          setError(err.message);
        }
        setBooks(mergeSeriesOverrides(fallbackBooks));
      } finally {
        clearTimeout(timeoutId);
        if (!controller.signal.aborted) setLoading(false);
        else setLoading(false);
      }
    }

    fetchBooks();
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);  // run once on mount

  return { books, loading, error };
}
