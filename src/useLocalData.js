import { useState, useCallback } from 'react';

const MANUAL_KEY = 'bookshelf_manual_v2';
const OVERRIDES_KEY = 'bookshelf_overrides_v1';
const DELETED_KEY = 'bookshelf_deleted_v1';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function useLocalData() {
  const [manualBooks, setManualBooks] = useState(() => load(MANUAL_KEY, []));
  const [overrides, setOverrides] = useState(() => load(OVERRIDES_KEY, {}));
  const [deletedIds, setDeletedIds] = useState(() => new Set(load(DELETED_KEY, [])));

  const addBook = useCallback((book) => {
    setManualBooks(prev => {
      const next = [...prev, book];
      save(MANUAL_KEY, next);
      return next;
    });
  }, []);

  // isManual: if true, update the stored manual book object directly;
  // if false (Goodreads book), store changes as overrides so sync won't clobber them.
  const editBook = useCallback((id, changes, isManual) => {
    if (isManual) {
      setManualBooks(prev => {
        const next = prev.map(b => b.id === id ? { ...b, ...changes } : b);
        save(MANUAL_KEY, next);
        return next;
      });
    } else {
      setOverrides(prev => {
        const next = { ...prev, [id]: { ...(prev[id] || {}), ...changes } };
        save(OVERRIDES_KEY, next);
        return next;
      });
    }
  }, []);

  const deleteBook = useCallback((id) => {
    setDeletedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      save(DELETED_KEY, [...next]);
      return next;
    });
  }, []);

  return { manualBooks, overrides, deletedIds, addBook, editBook, deleteBook };
}
