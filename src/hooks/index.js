import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Debounced value hook.
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Generic data fetching hook.
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const isMounted = useRef(true);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      if (isMounted.current) setData(result);
    } catch (err) {
      if (isMounted.current) setError(err.message || 'Something went wrong');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    isMounted.current = true;
    execute();
    return () => { isMounted.current = false; };
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

/**
 * Local storage state hook.
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(newValue => {
    const toStore = typeof newValue === 'function' ? newValue(value) : newValue;
    setValue(toStore);
    localStorage.setItem(key, JSON.stringify(toStore));
  }, [key, value]);

  return [value, setStoredValue];
}

/**
 * Detect click outside of a ref.
 */
export function useClickOutside(ref, callback) {
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) callback();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
}

/**
 * Page title setter.
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ShopSphere` : 'ShopSphere | Discover. Compare. Shop Smarter.';
    return () => { document.title = 'ShopSphere | Discover. Compare. Shop Smarter.'; };
  }, [title]);
}
