import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Film, AlertCircle, RotateCcw, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ProfileContext } from '../../context/ProfileContext.jsx';
import useWatchlist from '../../hooks/useWatchlist.js';
import MovieCard from '../../components/MovieCard/MovieCard.jsx';

export const MyListPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { activeProfile } = useContext(ProfileContext);
  const { items, loading, error, refreshWatchlist } = useWatchlist();
  const navigate = useNavigate();

  // State 1: Unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center select-none pt-24 pb-16">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-8 max-w-md shadow-2xl flex flex-col items-center">
          <div className="p-4 rounded-full bg-red-600/10 border border-red-600/30 text-red-600 mb-4">
            <Bookmark className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">My List</h1>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Sign in to your account and select a profile to save movies to your personal watchlist.
          </p>
          <Link
            to="/login"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2.5 px-6 rounded transition shadow"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  // State 2: Authenticated but No Active Profile
  if (!activeProfile) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center select-none pt-24 pb-16">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-8 max-w-md shadow-2xl flex flex-col items-center">
          <div className="p-4 rounded-full bg-red-600/10 border border-red-600/30 text-red-600 mb-4">
            <User className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Who&apos;s Watching?</h1>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Select an active viewing profile to access and manage your personal My List.
          </p>
          <Link
            to="/profiles"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2.5 px-6 rounded transition shadow"
          >
            Choose Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 pb-20 px-4 md:px-12 select-none animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-4 border-b border-zinc-800/80">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              My List
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Personalized watchlist for{' '}
              <span className="text-white font-semibold">{activeProfile.name}</span>
            </p>
          </div>
          {items.length > 0 && (
            <span className="text-xs text-zinc-500 mt-2 sm:mt-0 font-medium">
              {items.length} {items.length === 1 ? 'title' : 'titles'} saved
            </span>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-zinc-800/80 rounded-md animate-pulse border border-zinc-800"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <h2 className="text-xl font-bold mb-2">Unable to load My List</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-sm">{error}</p>
            <button
              onClick={refreshWatchlist}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs py-2 px-5 rounded transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Empty Watchlist State */}
        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
              <Film className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Your My List is empty.
            </h2>
            <p className="text-zinc-400 text-sm max-w-sm mb-6 leading-relaxed">
              Save movies here to watch them later. Click the &ldquo;+ My List&rdquo; button on any movie details page.
            </p>
            <button
              onClick={() => navigate('/movies')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2.5 px-6 rounded transition shadow"
            >
              Browse Movies
            </button>
          </div>
        )}

        {/* Populated Watchlist Grid */}
        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {items.map((movie) => (
              <MovieCard key={movie._id || movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
