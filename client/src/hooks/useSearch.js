import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useDebounce from './useDebounce.js';
import * as searchService from '../services/searchService.js';

export const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 350);

  const [genre, setGenre] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, hasNextPage: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeRequestRef = useRef(0);

  // Sync state if URL search query changes externally (e.g. browser back/forward)
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    if (urlQ !== query) {
      setQuery(urlQ);
    }
  }, [searchParams]);

  const executeSearch = useCallback(async (searchTarget, pageNum = 1, currentGenre = '', currentType = '') => {
    if (!searchTarget || !searchTarget.trim()) {
      setResults([]);
      setPagination({ page: 1, limit: 20, total: 0, hasNextPage: false });
      setLoading(false);
      setError(null);
      return;
    }

    const requestId = ++activeRequestRef.current;
    setLoading(true);
    setError(null);

    try {
      const res = await searchService.searchContent(searchTarget.trim(), {
        page: pageNum,
        limit: 20,
        genre: currentGenre || undefined,
        type: currentType || undefined
      });

      // Ignore stale response if a newer request was dispatched
      if (requestId === activeRequestRef.current) {
        setResults(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      if (requestId === activeRequestRef.current) {
        console.error('Search request error:', err);
        setError('Something went wrong while searching.');
        setResults([]);
      }
    } finally {
      if (requestId === activeRequestRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Trigger search whenever debouncedQuery, genre, type, or page changes
  useEffect(() => {
    // Sync URL parameter
    if (debouncedQuery.trim()) {
      setSearchParams({ q: debouncedQuery.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }

    executeSearch(debouncedQuery, page, genre, type);
  }, [debouncedQuery, genre, type, page, executeSearch, setSearchParams]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setGenre('');
    setType('');
    setPage(1);
    setResults([]);
    setError(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const retry = useCallback(() => {
    executeSearch(debouncedQuery, page, genre, type);
  }, [debouncedQuery, page, genre, type, executeSearch]);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    pagination,
    loading,
    error,
    clearSearch,
    retry,
    genre,
    setGenre,
    type,
    setType,
    page,
    setPage
  };
};

export default useSearch;
