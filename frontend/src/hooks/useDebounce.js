import { useState, useEffect, useCallback, useRef } from 'react';

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export function useInfiniteScroll(callback, hasMore) {
  const observerRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const lastElementRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!hasMore) return;
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) callbackRef.current();
    }, { threshold: 0.1 });
    if (node) observerRef.current.observe(node);
  }, [hasMore]);

  return lastElementRef;
}
