import { useState, useCallback, useMemo, useEffect } from 'react';

const EMPTY_FILTERS = { q: '', destinations: [], holiday_types: [], rating: [], price_min: null, price_max: null, sort: 'best' };
export const SEARCH_PREFILL_KEY = 'search_prefill_filters';

export function useSearchFilters() {
  const [filters, setFilters] = useState(() => ({ ...EMPTY_FILTERS }));

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SEARCH_PREFILL_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      sessionStorage.removeItem(SEARCH_PREFILL_KEY);

      if (parsed && typeof parsed === 'object') {
        setFilters(prev => ({
          ...prev,
          ...parsed,
          destinations: Array.isArray(parsed.destinations) ? parsed.destinations : prev.destinations,
          holiday_types: Array.isArray(parsed.holiday_types) ? parsed.holiday_types : prev.holiday_types,
          rating: Array.isArray(parsed.rating) ? parsed.rating : prev.rating,
        }));
      }
    } catch {
      sessionStorage.removeItem(SEARCH_PREFILL_KEY);
    }
  }, []);

  const clearAll = useCallback(() => {
    updateFilters({ ...EMPTY_FILTERS });
  }, [updateFilters]);

  const removeFilter = useCallback((key, value) => {
    if (key === 'price') {
      updateFilters({ ...filters, price_min: null, price_max: null });
    } else if (key === 'q') {
      updateFilters({ ...filters, q: '' });
    } else {
      const arr = filters[key] || [];
      updateFilters({ ...filters, [key]: arr.filter(v => v !== value) });
    }
  }, [filters, updateFilters]);

  const activeFilterCount = useMemo(() => (
    (filters.destinations?.length || 0) +
    (filters.holiday_types?.length || 0) +
    (filters.rating?.length || 0)
  ), [filters.destinations, filters.holiday_types, filters.rating]);

  return { filters, updateFilters, clearAll, removeFilter, activeFilterCount };
}
