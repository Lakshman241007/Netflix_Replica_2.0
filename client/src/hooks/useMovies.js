import { useState, useEffect, useCallback } from 'react';
import * as movieService from '../services/movieService.js';

export const useMovies = () => {
  const [featured, setFeatured] = useState(null);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [action, setAction] = useState([]);
  const [drama, setDrama] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [sciFi, setSciFi] = useState([]);

  // Loading states
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingAction, setLoadingAction] = useState(true);
  const [loadingDrama, setLoadingDrama] = useState(true);
  const [loadingComedy, setLoadingComedy] = useState(true);
  const [loadingSciFi, setLoadingSciFi] = useState(true);

  // Error states
  const [errorTrending, setErrorTrending] = useState(null);
  const [errorPopular, setErrorPopular] = useState(null);
  const [errorAction, setErrorAction] = useState(null);
  const [errorDrama, setErrorDrama] = useState(null);
  const [errorComedy, setErrorComedy] = useState(null);
  const [errorSciFi, setErrorSciFi] = useState(null);

  const fetchFeatured = useCallback(async () => {
    setLoadingFeatured(true);
    try {
      const res = await movieService.getFeaturedMovies();
      const list = res.data || [];
      setFeatured(list[0] || null);
    } catch (err) {
      console.error('Failed to load featured movie:', err);
    } finally {
      setLoadingFeatured(false);
    }
  }, []);

  const fetchTrending = useCallback(async () => {
    setLoadingTrending(true);
    setErrorTrending(null);
    try {
      const res = await movieService.getTrendingMovies(10);
      setTrending(res.data || []);
    } catch (err) {
      console.error('Failed to load trending movies:', err);
      setErrorTrending('Unable to load trending movies.');
    } finally {
      setLoadingTrending(false);
    }
  }, []);

  const fetchPopular = useCallback(async () => {
    setLoadingPopular(true);
    setErrorPopular(null);
    try {
      const res = await movieService.getPopularMovies(10);
      setPopular(res.data || []);
    } catch (err) {
      console.error('Failed to load popular movies:', err);
      setErrorPopular('Unable to load popular movies.');
    } finally {
      setLoadingPopular(false);
    }
  }, []);

  const fetchAction = useCallback(async () => {
    setLoadingAction(true);
    setErrorAction(null);
    try {
      const res = await movieService.getMoviesByGenre('action');
      setAction(res.data || []);
    } catch (err) {
      console.error('Failed to load action movies:', err);
      setErrorAction('Unable to load action movies.');
    } finally {
      setLoadingAction(false);
    }
  }, []);

  const fetchDrama = useCallback(async () => {
    setLoadingDrama(true);
    setErrorDrama(null);
    try {
      const res = await movieService.getMoviesByGenre('drama');
      setDrama(res.data || []);
    } catch (err) {
      console.error('Failed to load drama movies:', err);
      setErrorDrama('Unable to load drama movies.');
    } finally {
      setLoadingDrama(false);
    }
  }, []);

  const fetchComedy = useCallback(async () => {
    setLoadingComedy(true);
    setErrorComedy(null);
    try {
      const res = await movieService.getMoviesByGenre('comedy');
      setComedy(res.data || []);
    } catch (err) {
      console.error('Failed to load comedy movies:', err);
      setErrorComedy('Unable to load comedy movies.');
    } finally {
      setLoadingComedy(false);
    }
  }, []);

  const fetchSciFi = useCallback(async () => {
    setLoadingSciFi(true);
    setErrorSciFi(null);
    try {
      const res = await movieService.getMoviesByGenre('sci-fi');
      setSciFi(res.data || []);
    } catch (err) {
      console.error('Failed to load sci-fi movies:', err);
      setErrorSciFi('Unable to load sci-fi movies.');
    } finally {
      setLoadingSciFi(false);
    }
  }, []);

  const fetchAll = useCallback(() => {
    fetchFeatured();
    fetchTrending();
    fetchPopular();
    fetchAction();
    fetchDrama();
    fetchComedy();
    fetchSciFi();
  }, [fetchFeatured, fetchTrending, fetchPopular, fetchAction, fetchDrama, fetchComedy, fetchSciFi]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    featured,
    loadingFeatured,
    trending,
    loadingTrending,
    errorTrending,
    fetchTrending,
    popular,
    loadingPopular,
    errorPopular,
    fetchPopular,
    action,
    loadingAction,
    errorAction,
    fetchAction,
    drama,
    loadingDrama,
    errorDrama,
    fetchDrama,
    comedy,
    loadingComedy,
    errorComedy,
    fetchComedy,
    sciFi,
    loadingSciFi,
    errorSciFi,
    fetchSciFi,
    refetchAll: fetchAll
  };
};

export default useMovies;
