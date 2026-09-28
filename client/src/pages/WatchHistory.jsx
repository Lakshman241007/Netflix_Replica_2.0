import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { ProfileContext } from '../context/ProfileContext.jsx';
import useWatchHistory from '../hooks/useWatchHistory.js';
import { Play, Trash2, Clock, History, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { FALLBACK_POSTER, handleImageError } from '../utils/imageUtils.js';

export const WatchHistory = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { activeProfile } = useContext(ProfileContext);

  const {
    historyItems,
    loading,
    error,
    removeHistoryItem,
    clearAllHistory,
    refresh
  } = useWatchHistory();

  const [deletingId, setDeletingId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePlay = (movieId) => {
    if (movieId) {
      navigate(`/watch/${movieId}`);
    }
  };

  const handleRemove = async (e, movieId) => {
    e.stopPropagation();
    setDeletingId(movieId);
    try {
      await removeHistoryItem(movieId);
      triggerToast('Removed from watch history');
    } catch {
      triggerToast('Failed to remove history item');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await clearAllHistory();
      setShowClearConfirm(false);
      triggerToast('Watch history cleared');
    } catch {
      triggerToast('Failed to clear watch history');
    } finally {
      setClearing(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isAuthenticated || !activeProfile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white px-4 text-center">
        <History className="w-16 h-16 text-zinc-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">Watch History</h2>
        <p className="text-zinc-400 text-sm max-w-sm mb-6">
          Sign in and select an active profile to view your personalized viewing activity.
        </p>
        <button
          onClick={() => navigate(isAuthenticated ? '/profiles' : '/login')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-6 rounded transition"
        >
          {isAuthenticated ? 'Choose Profile' : 'Sign In'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 pb-20 px-4 sm:px-8 md:px-12 max-w-6xl mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
            <History className="w-7 h-7 text-red-600" />
            Watch History
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Viewing activity for <span className="text-white font-semibold">{activeProfile.name}</span>
          </p>
        </div>

        {historyItems.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-red-400 text-xs font-semibold py-2 px-4 rounded border border-zinc-700 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-zinc-700 text-white px-4 py-2.5 rounded shadow-2xl flex items-center gap-2 text-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal for Clearing History */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2">Clear Watch History?</h3>
            <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
              This will remove all viewing records for <strong className="text-white">{activeProfile.name}</strong>. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={clearing}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold py-2 px-4 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded transition flex items-center gap-2"
              >
                {clearing ? 'Clearing...' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-44 bg-zinc-800/60 rounded-md"></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-600 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Unable to Load History</h3>
          <p className="text-zinc-400 text-xs mb-4">{error}</p>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold py-2 px-4 rounded transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && historyItems.length === 0 && (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 bg-zinc-900/40 rounded-lg border border-zinc-800/60">
          <History className="w-16 h-16 text-zinc-700 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No Watch History Yet</h3>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mb-6">
            Titles you watch on Netflix will show up here so you can easily track or resume them.
          </p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-6 rounded transition"
          >
            Explore Movies
          </button>
        </div>
      )}

      {/* History Items Grid */}
      {!loading && !error && historyItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {historyItems.map((item) => {
            const movie = item.movie || {};
            const movieId = item.movieId || movie.id || movie._id;
            const posterSrc = movie.poster || movie.posterUrl || movie.thumbnailUrl || FALLBACK_POSTER;
            const progress = Number(item.progress || 0);
            const isDeleting = deletingId === movieId;

            return (
              <div
                key={item.id || item._id || movieId}
                onClick={() => handlePlay(movieId)}
                className="group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-md overflow-hidden flex flex-col cursor-pointer transition-all duration-300 shadow hover:shadow-xl"
              >
                {/* Poster & Overlay */}
                <div className="relative aspect-[16/9] w-full bg-zinc-800 overflow-hidden">
                  <img
                    src={posterSrc}
                    alt={movie.title || 'Movie'}
                    onError={(e) => handleImageError(e, FALLBACK_POSTER)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 flex items-center justify-center text-white shadow-lg transition-all duration-200">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Remove Item Button */}
                  <button
                    onClick={(e) => handleRemove(e, movieId)}
                    disabled={isDeleting}
                    title="Remove from history"
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/80 hover:bg-red-600 text-zinc-300 hover:text-white transition-colors opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-800 h-1.5 overflow-hidden">
                  <div
                    className="bg-red-600 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>

                {/* Info Block */}
                <div className="p-3 flex flex-col justify-between flex-grow">
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                      {movie.title || 'Untitled Title'}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {item.completed ? (
                        <span className="text-green-400 font-semibold">Watched</span>
                      ) : progress > 0 ? (
                        <span>{Math.round(progress)}% completed</span>
                      ) : (
                        <span>Started</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-3 pt-2 border-t border-zinc-800/60 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.watchedAt)}
                    </span>
                    <span className="text-zinc-400 hover:text-white transition-colors font-sans font-semibold">
                      {item.completed ? 'Watch Again' : 'Resume'} →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
