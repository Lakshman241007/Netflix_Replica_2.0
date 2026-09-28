import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext.jsx';
import { ProfileContext } from '../context/ProfileContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import * as movieService from '../services/movieService.js';
import usePlayback from '../hooks/usePlayback.js';
import VideoPlayer from '../components/player/VideoPlayer.jsx';
import { AlertCircle, Film, ArrowLeft } from 'lucide-react';

export const Player = () => {
  const { id, movieId: paramMovieId } = useParams();
  const movieId = id || paramMovieId;
  const navigate = useNavigate();

  const { isAuthenticated } = useContext(AuthContext);
  const { activeProfile } = useContext(ProfileContext);
  const { playingVideo, stopPlaying } = useContext(PlayerContext);

  const [movie, setMovie] = useState(playingVideo?._id === movieId ? playingVideo : null);
  const [movieLoading, setMovieLoading] = useState(!movie);
  const [movieError, setMovieError] = useState(null);

  const { playbackState, loading: playbackLoading, saveProgress, markComplete } = usePlayback(movieId);

  // Authentication & Profile Guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!activeProfile) {
      navigate('/profiles', { replace: true });
    }
  }, [isAuthenticated, activeProfile, navigate]);

  // Load movie if not already provided via PlayerContext
  useEffect(() => {
    if (movie) return;

    let active = true;
    const loadMovie = async () => {
      setMovieLoading(true);
      setMovieError(null);
      try {
        const res = await movieService.getMovieById(movieId);
        if (active) {
          if (res.success && res.data) {
            setMovie(res.data);
          } else {
            setMovieError(res.message || 'Movie not found');
          }
        }
      } catch (err) {
        if (active) {
          setMovieError(err.message || 'Unable to load movie details');
        }
      } finally {
        if (active) {
          setMovieLoading(false);
        }
      }
    };

    if (movieId) {
      loadMovie();
    }

    return () => {
      active = false;
    };
  }, [movieId, movie]);

  const handleBack = () => {
    stopPlaying();
    navigate(-1);
  };

  if (movieLoading || (playbackLoading && !playbackState)) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white select-none">
        <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-400 text-sm">Preparing stream...</p>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white p-6 text-center select-none">
        <AlertCircle className="w-14 h-14 text-red-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">Unable to Play Title</h2>
        <p className="text-zinc-400 text-sm max-w-sm mb-6">{movieError || 'Movie could not be loaded.'}</p>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-2.5 px-6 rounded transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Netflix
        </button>
      </div>
    );
  }

  const initialPosition = playbackState?.position || 0;
  const videoUrl = movie.video || movie.videoUrl || movie.trailer;

  return (
    <VideoPlayer
      videoUrl={videoUrl}
      title={movie.title}
      initialPosition={initialPosition}
      onProgressUpdate={(pos, dur, isPlaying) => saveProgress(pos, dur, isPlaying)}
      onComplete={markComplete}
      onBack={handleBack}
    />
  );
};

export default Player;
