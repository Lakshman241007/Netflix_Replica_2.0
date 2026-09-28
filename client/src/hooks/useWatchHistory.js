import { useState, useEffect, useCallback, useContext } from 'react';
import * as historyService from '../services/historyService.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { ProfileContext } from '../context/ProfileContext.jsx';

export const useWatchHistory = ({ page = 1, limit = 20 } = {}) => {
  const { isAuthenticated } = useContext(AuthContext);
  const { activeProfile } = useContext(ProfileContext);

  const [historyItems, setHistoryItems] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const profileId = activeProfile?._id || activeProfile?.id;

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated || !profileId) {
      setHistoryItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await historyService.getWatchHistory({ page, limit }, profileId);
      if (res && res.success && Array.isArray(res.data)) {
        setHistoryItems(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else {
        setHistoryItems([]);
      }
    } catch (err) {
      console.warn('Watch history load notice:', err.message);
      setError(err.message || 'Unable to load watch history.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, profileId, page, limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const removeHistoryItem = useCallback(
    async (movieId) => {
      if (!isAuthenticated || !profileId || !movieId) return;
      try {
        await historyService.deleteWatchHistoryItem(movieId, profileId);
        setHistoryItems((prev) => prev.filter((item) => String(item.movieId || item.id || item._id) !== String(movieId)));
        return true;
      } catch (err) {
        console.error('Delete history item failed:', err);
        throw err;
      }
    },
    [isAuthenticated, profileId]
  );

  const clearAllHistory = useCallback(async () => {
    if (!isAuthenticated || !profileId) return;
    try {
      await historyService.clearWatchHistory(profileId);
      setHistoryItems([]);
      return true;
    } catch (err) {
      console.error('Clear watch history failed:', err);
      throw err;
    }
  }, [isAuthenticated, profileId]);

  return {
    historyItems,
    pagination,
    loading,
    error,
    removeHistoryItem,
    clearAllHistory,
    refresh: fetchHistory
  };
};

export default useWatchHistory;
