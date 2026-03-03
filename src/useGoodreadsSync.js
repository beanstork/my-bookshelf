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
    let cancelled = false;

    async function fetchBooks() {
      try {
        const res = await fetch('/api/goodreads');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setBooks(mergeSeriesOverrides(data));
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('Goodreads sync failed, using local data:', err.message);
          setError(err.message);
          setBooks(mergeSeriesOverrides(fallbackBooks));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBooks();
    return () => { cancelled = true; };
  }, []);  // run once on mount

  return { books, loading, error };
}
