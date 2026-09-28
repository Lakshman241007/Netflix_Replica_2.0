import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Calendar, Clock, Play } from 'lucide-react';
import { FALLBACK_BACKDROP } from '../../utils/imageUtils.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ProfileContext } from '../../context/ProfileContext.jsx';
import { PlayerContext } from '../../context/PlayerContext.jsx';

export const HeroBanner = ({ movie, loading = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { activeProfile } = useContext(ProfileContext);
  const { startPlaying } = useContext(PlayerContext);

  if (loading) {
    return (
      <div className="relative h-[48vh] sm:h-[60vh] md:h-[75vh] w-full bg-zinc-900 animate-pulse flex items-end px-4 sm:px-8 md:px-16 pb-12 md:pb-20">
        <div className="max-w-2xl space-y-4 w-full">
          <div className="h-10 sm:h-14 bg-zinc-800 rounded w-3/4"></div>
          <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
          <div className="h-16 bg-zinc-800 rounded w-full"></div>
          <div className="h-10 bg-zinc-800 rounded w-36"></div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const movieId = movie._id || movie.id;

  const handlePlay = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!activeProfile) {
      navigate('/profiles');
      return;
    }
    if (startPlaying) {
      startPlaying(movie, 'movie');
    }
    navigate(`/watch/${movieId}`);
  };

  const handleInfo = () => {
    navigate(`/movies/${movieId}`);
  };

  const backdropSrc = movie.backdrop || movie.poster || movie.thumbnailUrl || FALLBACK_BACKDROP;
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : movie.year;

  return (
    <div
      className="relative min-h-[400px] sm:min-h-[450px] h-[56vh] sm:h-[65vh] md:h-[78vh] w-full flex items-end justify-start bg-cover bg-center px-4 sm:px-8 md:px-16 pb-8 sm:pb-14 md:pb-20 select-none overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(20,20,20,0.15) 0%, rgba(20,20,20,0.65) 65%, rgba(20,20,20,1) 100%), linear-gradient(90deg, rgba(20,20,20,0.9) 0%, rgba(20,20,20,0.5) 50%, rgba(20,20,20,0.2) 100%), url('${backdropSrc}')`
      }}
    >
      <div className="max-w-2xl z-10 animate-fade-in flex flex-col items-start w-full">
        {/* Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2 sm:mb-3 leading-tight text-white drop-shadow-lg break-words">
          {movie.title}
        </h1>

        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs md:text-sm text-zinc-300 mb-2.5 sm:mb-4">
          {movie.rating && (
            <span className="border border-zinc-500 bg-black/60 text-zinc-200 font-bold px-1.5 py-0.5 rounded text-[10px] sm:text-xs uppercase">
              {movie.rating}
            </span>
          )}
          {year && (
            <span className="flex items-center gap-1 font-medium text-xs sm:text-sm">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              {year}
            </span>
          )}
          {movie.duration && (
            <span className="flex items-center gap-1 font-medium text-xs sm:text-sm">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {movie.duration}
            </span>
          )}
          {movie.genres && movie.genres.length > 0 && (
            <span className="text-zinc-300 font-medium text-xs sm:text-sm">
              • {movie.genres.join(', ')}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-zinc-200 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 md:line-clamp-4 leading-relaxed mb-4 sm:mb-6 max-w-xl drop-shadow">
          {movie.description}
        </p>

        {/* Actions: Play and More Info */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handlePlay}
            className="bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-white min-h-[42px] flex-1 sm:flex-initial"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> Play
          </button>

          <button
            onClick={handleInfo}
            className="bg-zinc-700/80 hover:bg-zinc-700 text-white font-semibold text-xs sm:text-sm px-5 sm:px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 border border-zinc-500/30 hover:border-zinc-400 shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-zinc-400 min-h-[42px] flex-1 sm:flex-initial"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" /> More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
