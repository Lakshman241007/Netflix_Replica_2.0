import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import * as playbackService from '../services/playbackService.js';
import { AuthContext } from '../context/AuthContext.jsx';
import { ProfileContext } from '../context/ProfileContext.jsx';

export const usePlayback = (movieId) => {
  const { isAuthenticated } = useContext(AuthContext);
  const { activeProfile } = useContext(ProfileContext);

  const [playbackState, setPlaybackState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const profileId = activeProfile?._id || activeProfile?.id;
  const lastSavedPosRef = useRef(-1);
  const isSavingRef = useRef(false);

  const loadPlayback = useCallback(async () => {
    if (!isAuthenticated || !profileId || !movieId) {
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await playbackService.getPlayback(movieId, profileId);
      if (res.success && res.data) {
        setPlaybackState(res.data);
        lastSavedPosRef.current = res.data.position || 0;
        return res.data;
      }
    } catch (err) {
      console.warn('Playback fetch notice:', err.message);
      setError('Unable to load playback state.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, profileId, movieId]);

  useEffect(() => {
    loadPlayback();
  }, [loadPlayback]);

  const saveProgress = useCallback(
    async (position, duration, isPlaying = false) => {
      if (!isAuthenticated || !profileId || !movieId) return;

      const pos = Math.max(0, Math.floor(position));
      const dur = Math.max(0, Math.floor(duration));

      // Avoid redundant saves if position hasn't changed meaningfully
      if (Math.abs(pos - lastSavedPosRef.current) < 2 && !isPlaying) {
        return;
      }

      if (isSavingRef.current) return;
      isSavingRef.current = true;

      try {
        const res = await playbackService.updatePlayback(
          movieId,
          { position: pos, duration: dur, isPlaying },
          profileId
        );
        if (res.success && res.data) {
          lastSavedPosRef.current = pos;
          setPlaybackState(res.data);
        }
      } catch (err) {
        console.warn('Playback progress sync error:', err.message);
      } finally {
        isSavingRef.current = false;
      }
    },
    [isAuthenticated, profileId, movieId]
  );

  const markComplete = useCallback(async () => {
    if (!isAuthenticated || !profileId || !movieId) return;
    try {
      const res = await playbackService.completePlayback(movieId, profileId);
      if (res.success && res.data) {
        setPlaybackState(res.data);
      }
    } catch (err) {
      console.warn('Playback complete error:', err.message);
    }
  }, [isAuthenticated, profileId, movieId]);

  const resetPlayback = useCallback(async () => {
    if (!isAuthenticated || !profileId || !movieId) return;
    try {
      await playbackService.deletePlayback(movieId, profileId);
      setPlaybackState({
        movieId,
        position: 0,
        duration: 0,
        progress: 0,
        isPlaying: false,
        completed: false
      });
      lastSavedPosRef.current = 0;
    } catch (err) {
      console.warn('Playback reset error:', err.message);
    }
  }, [isAuthenticated, profileId, movieId]);

  return {
    playbackState,
    loading,
    error,
    saveProgress,
    markComplete,
    resetPlayback,
    reloadPlayback: loadPlayback
  };
};

export default usePlayback;
