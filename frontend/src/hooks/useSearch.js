import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function useFilterOptions() {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    axios.get(`${API}/filter-options`)
      .then(res => setOptions(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { options, loading };
}

export function useSearch(filters) {
  const [hotels, setHotels] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const pageRef = useRef(1);
  const abortRef = useRef(null);
  const searchTokenRef = useRef('');

  const buildPayload = useCallback((pageNum) => {
    const p = { page: pageNum, page_size: 20 };
    if (filters.q) p.q = filters.q;
    if (filters.destinations?.length) p.destinations = filters.destinations.join(',');
    if (filters.holiday_types?.length) p.holiday_types = filters.holiday_types.join(',');
    if (filters.rating?.length) p.rating = filters.rating.join(',');
    if (filters.price_min != null) p.price_min = filters.price_min;
    if (filters.price_max != null) p.price_max = filters.price_max;
    if (filters.sort) p.sort = filters.sort;
    return p;
  }, [filters]);

  useEffect(() => {
    if (abortRef.current) abortRef.current.cancel('New search');
    const source = axios.CancelToken.source();
    abortRef.current = source;

    setLoading(true);
    pageRef.current = 1;
    searchTokenRef.current = '';

    axios.post(`${API}/search`, buildPayload(1), { cancelToken: source.token })
      .then(res => {
        setHotels(res.data.hotels);
        setTotal(res.data.total);
        setHasMore(res.data.has_more);
        searchTokenRef.current = res.data.search_token || '';
        pageRef.current = 1;
      })
      .catch(err => {
        if (!axios.isCancel(err)) {
          logger.warn('Search failed:', err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => source.cancel('Cleanup');
  }, [buildPayload]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = pageRef.current + 1;
    setLoadingMore(true);

    const payload = searchTokenRef.current
      ? { search_token: searchTokenRef.current, page: nextPage, page_size: 20 }
      : buildPayload(nextPage);

    axios.post(`${API}/search`, payload)
      .then(res => {
        setHotels(prev => [...prev, ...res.data.hotels]);
        setHasMore(res.data.has_more);
        searchTokenRef.current = res.data.search_token || searchTokenRef.current;
        pageRef.current = nextPage;
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [hasMore, loadingMore, buildPayload]);

  return { hotels, total, loading, loadingMore, hasMore, loadMore };
}

// Simple logger replacement for console
const logger = {
  warn: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },
};
