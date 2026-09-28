import { useState, useEffect, useContext, useCallback } from 'react';
import { ProfileContext } from '../context/ProfileContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { getRecommendations } from '../services/recommendationService.js';

export const useRecommendations = (limit = 10) => {
  const { activeProfile } = useContext(ProfileContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecs = useCallback(async () => {
    if (!isAuthenticated || !activeProfile) {
      setRecommendations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const profileId = activeProfile._id || activeProfile.id;
      const data = await getRecommendations(profileId, limit);
      setRecommendations(data);
    } catch (err) {
      console.warn('Failed to load recommendations:', err.message);
      setError(err.message || 'Could not fetch recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, activeProfile, limit]);

  useEffect(() => {
    fetchRecs();
  }, [fetchRecs]);

  return {
    recommendations,
    loading,
    error,
    refresh: fetchRecs
  };
};

export default useRecommendations;
