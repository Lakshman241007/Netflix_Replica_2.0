import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as movieService from '../../services/movieService.js';
import { ArrowLeft, Calendar, Clock, Star, Tag, Info, ShieldAlert, Plus, Check, Play, RotateCcw } from 'lucide-react';
import { FALLBACK_BACKDROP, FALLBACK_POSTER, handleImageError } from '../../utils/imageUtils.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ProfileContext } from '../../context/ProfileContext.jsx';
import { PlayerContext } from '../../context/PlayerContext.jsx';
import useWatchlist from '../../hooks/useWatchlist.js';
import usePlayback from '../../hooks/usePlayback.js';

export const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useContext(AuthContext);
  const { activeProfile } = useContext(ProfileContext);
  const { startPlaying } = useContext(PlayerContext);
  const { isInMyList, addToMyList, removeFromMyList } = useWatchlist();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listActionLoading, setListActionLoading] = useState(false);
  const [promptMessage, setPromptMessage] = useState('');

  const movieId = movie?._id || movie?.id || id;
  const isSaved = isInMyList(movieId);
  const { playbackState, resetPlayback } = usePlayback(movieId);

  const hasProgress = playbackState && Number(playbackState.position) > 10 && !playbackState.completed;

  useEffect(() => {
    let active = true;
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await movieService.getMovieById(id);
        if (active) {
          if (res.success && res.data) {
            setMovie(res.data);
          } else {
            setError(res.message || 'Movie not found.');
          }
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load movie details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchMovie();
    }

    return () => {
      active = false;
    };
  }, [id]);

  const handlePlay = (startFromBeginning = false) => {
    setPromptMessage('');

    if (!isAuthenticated) {
      setPromptMessage('Sign in to watch this movie.');
      return;
    }

    if (!activeProfile) {
      setPromptMessage('Please select an active profile to start watching.');
      return;
    }

    if (startFromBeginning) {
      resetPlayback();
      if (startPlaying) startPlaying(movie, 'movie', 0);
    } else if (startPlaying) {
      startPlaying(movie, 'movie', playbackState?.position || 0);
    }

    navigate(`/watch/${movieId}`);
  };

  const handleWatchlistToggle = async () => {
    setPromptMessage('');

    if (!isAuthenticated) {
      setPromptMessage('Sign in to add movies to your personal My List.');
      return;
    }

    if (!activeProfile) {
      setPromptMessage('Please select an active profile to use My List.');
      return;
    }

    setListActionLoading(true);
    try {
      if (isSaved) {
        await removeFromMyList(movieId);
      } else {
        await addToMyList(movieId);
      }
    } catch (err) {
      console.error('Watchlist toggle error:', err);
      setPromptMessage(err.message || 'Unable to update My List.');
    } finally {
      setListActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] text-white pt-24 px-4 sm:px-8 md:px-12 animate-pulse">
        <div className="h-6 w-32 bg-zinc-800 rounded mb-8"></div>
        <div className="h-[45vh] w-full bg-zinc-800 rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-80 bg-zinc-800 rounded"></div>
          <div className="md:col-span-2 space-y-4">
            <div className="h-8 bg-zinc-800 rounded w-2/3"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/4"></div>
            <div className="h-24 bg-zinc-800 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4 select-none">
        <ShieldAlert className="w-12 h-12 text-red-600 mb-2" />
        <h2 className="text-xl font-bold text-zinc-100">Unable to load movie</h2>
        <p className="text-zinc-400 text-sm max-w-md">{error || 'The requested movie could not be found.'}</p>
        <button
          onClick={() => navigate('/movies')}
          className="mt-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold py-2.5 px-5 rounded transition"
        >
          Back to Movies
        </button>
      </div>
    );
  }

  const backdropSrc = movie.backdrop || movie.poster || movie.thumbnailUrl || FALLBACK_BACKDROP;
  const posterSrc = movie.poster || movie.thumbnailUrl || movie.backdrop || FALLBACK_POSTER;
  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : movie.year;

  return (
    <div className="min-h-screen bg-[#141414] text-white pb-20 animate-fade-in select-none">
      {/* Top Back Navigation Bar */}
      <div className="pt-20 px-4 sm:px-8 md:px-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-xs sm:text-sm transition font-medium focus:outline-none focus:ring-2 focus:ring-red-600 rounded px-1 py-0.5"
          aria-label="Back to previous page"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Hero Cinematic Backdrop Banner */}
      <div
        className="relative h-[40vh] sm:h-[50vh] md:h-[65vh] w-full bg-cover bg-center flex items-end px-4 sm:px-8 md:px-12 pb-8 sm:pb-12"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(20,20,20,0.1) 0%, rgba(20,20,20,0.65) 65%, rgba(20,20,20,1) 100%), linear-gradient(90deg, rgba(20,20,20,0.8) 0%, rgba(20,20,20,0.3) 100%), url('${backdropSrc}')`
        }}
      >
        <div className="z-10 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 text-white drop-shadow-md">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-zinc-300 mb-6">
            {movie.rating && (
              <span className="border border-zinc-500 bg-black/60 text-zinc-200 font-bold px-1.5 py-0.5 rounded text-[11px] sm:text-xs uppercase">
                {movie.rating}
              </span>
            )}
            {releaseYear && (
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                {releaseYear}
              </span>
            )}
            {movie.duration && (
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                {movie.duration}
              </span>
            )}
            {movie.popularity !== undefined && (
              <span className="flex items-center gap-1 text-zinc-300 font-medium">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                Popularity: {movie.popularity}/100
              </span>
            )}
          </div>

          {/* Action Buttons: Play/Resume & My List */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Play or Resume Button */}
            <button
              onClick={() => handlePlay(false)}
              className="flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded text-xs sm:text-sm font-bold transition shadow-lg hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{hasProgress ? 'Resume' : 'Play'}</span>
            </button>

            {/* Restart from beginning option if partially watched */}
            {hasProgress && (
              <button
                onClick={() => handlePlay(true)}
                title="Start from beginning"
                className="flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-600 px-3.5 py-2.5 rounded text-xs font-semibold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start Over</span>
              </button>
            )}

            {/* My List Button */}
            <button
              onClick={handleWatchlistToggle}
              disabled={listActionLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded text-xs sm:text-sm font-bold transition shadow-lg border ${
                isSaved
                  ? 'bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700'
                  : 'bg-red-600 border-red-600 text-white hover:bg-red-700'
              } disabled:opacity-60`}
            >
              {listActionLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isSaved ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{isSaved ? 'In My List' : 'Add to My List'}</span>
            </button>
          </div>

          {/* Progress bar indicator if in-progress */}
          {hasProgress && (
            <div className="mt-3 max-w-xs">
              <div className="w-full bg-zinc-700/80 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, playbackState.progress))}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                {Math.round(playbackState.progress)}% watched
              </p>
            </div>
          )}

          {/* Inline Prompt Message for Auth / Profile requirements */}
          {promptMessage && (
            <div className="mt-3 flex items-center gap-2 bg-black/80 border border-zinc-700 px-3.5 py-2 rounded text-xs text-zinc-200 animate-fade-in max-w-md">
              <span className="flex-grow">{promptMessage}</span>
              {!isAuthenticated ? (
                <button
                  onClick={() => navigate('/login', { state: { from: location } })}
                  className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded font-semibold text-[11px]"
                >
                  Sign In
                </button>
              ) : !activeProfile ? (
                <button
                  onClick={() => navigate('/profiles')}
                  className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded font-semibold text-[11px]"
                >
                  Choose Profile
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Main Details Body */}
      <div className="px-4 sm:px-8 md:px-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Portrait Poster */}
        <div className="md:col-span-1 flex justify-center md:justify-start">
          <div className="w-48 sm:w-56 md:w-full aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900">
            <img
              src={posterSrc}
              alt={movie.title}
              onError={(e) => handleImageError(e, FALLBACK_POSTER)}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column: Detailed Overview & Metadata */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Overview */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-2 text-zinc-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-red-600" /> Overview
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {movie.description}
            </p>
          </div>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase text-zinc-400 mb-2.5 tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-zinc-500" /> Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-zinc-800/90 text-zinc-200 border border-zinc-700/80 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
