import { useState, useEffect, useCallback, useContext } from 'react';
import * as historyService from '../services/historyService.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { ProfileContext } from '../context/ProfileContext.jsx';

export const useContinueWatching = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { activeProfile } = useContext(ProfileContext);

  const [continueWatchingList, setContinueWatchingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const profileId = activeProfile?._id || activeProfile?.id;

  const fetchContinueWatching = useCallback(async () => {
    if (!isAuthenticated || !profileId) {
      setContinueWatchingList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await historyService.getContinueWatching({ limit: 20 }, profileId);
      if (res && res.success && Array.isArray(res.data)) {
        setContinueWatchingList(res.data);
      } else {
        setContinueWatchingList([]);
      }
    } catch (err) {
      console.warn('Continue watching load notice:', err.message);
      setError(err.message || 'Unable to load continue watching list.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, profileId]);

  useEffect(() => {
    fetchContinueWatching();
  }, [fetchContinueWatching]);

  return {
    continueWatchingList,
    loading,
    error,
    refresh: fetchContinueWatching
  };
};

export default useContinueWatching;
