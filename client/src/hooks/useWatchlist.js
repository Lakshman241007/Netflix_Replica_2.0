import { useState, useEffect, useContext, useCallback } from 'react';
import * as watchlistService from '../services/watchlistService.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { ProfileContext } from '../context/ProfileContext.jsx';

export const useWatchlist = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { activeProfile } = useContext(ProfileContext);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const profileId = activeProfile?._id || activeProfile?.id;

  const fetchWatchlist = useCallback(async () => {
    if (!isAuthenticated || !profileId) {
      setItems([]);
      setLoading(false);
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      const res = await watchlistService.getMyList(profileId);
      const list = res.data || [];
      setItems(list);
      return list;
    } catch (err) {
      console.warn('Watchlist fetch notice:', err.message);
      setError('Unable to load My List.');
      setItems([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, profileId]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const addToMyList = async (movieId) => {
    if (!isAuthenticated || !profileId) {
      throw new Error('Please select a profile to add to My List.');
    }

    try {
      await watchlistService.addToMyList(movieId, profileId);
      await fetchWatchlist();
      return true;
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      throw err;
    }
  };

  const removeFromMyList = async (movieId) => {
    if (!isAuthenticated || !profileId) {
      throw new Error('Please select a profile to manage My List.');
    }

    try {
      await watchlistService.removeFromMyList(movieId, profileId);
      setItems((prev) => prev.filter((m) => (m._id || m.id) !== movieId));
      return true;
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      throw err;
    }
  };

  const isInMyList = (movieId) => {
    if (!movieId || !items || items.length === 0) return false;
    return items.some((m) => (m._id || m.id) === movieId);
  };

  return {
    items,
    loading,
    error,
    addToMyList,
    removeFromMyList,
    isInMyList,
    refreshWatchlist: fetchWatchlist
  };
};

export default useWatchlist;
