import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Sparkles } from 'lucide-react';
import { FALLBACK_POSTER, handleImageError } from '../../utils/imageUtils.js';

export const MovieCard = ({ movie, onClick }) => {
  const navigate = useNavigate();

  if (!movie) return null;

  const data = movie.movie || movie;
  const reason = movie.reason || data.reason;

  const handleClick = () => {
    if (onClick) {
      onClick(data);
    } else {
      const id = data._id || data.id;
      navigate(`/movies/${id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const posterSrc = data.poster || data.thumbnailUrl || data.backdrop || FALLBACK_POSTER;
  const year = data.releaseDate ? new Date(data.releaseDate).getFullYear() : data.year;
  const hasProgress = data.progress !== undefined && Number(data.progress) > 0 && Number(data.progress) < 100;
  const progressPercent = Math.min(100, Math.max(0, Number(data.progress) || 0));

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${data.title}`}
      className="group relative flex-shrink-0 w-32 sm:w-40 md:w-48 rounded-md overflow-hidden bg-zinc-900 border border-zinc-800/70 hover:border-zinc-500 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-red-600 flex flex-col"
    >
      {/* Poster Image with Portrait 2:3 aspect ratio */}
      <div className="relative aspect-[2/3] w-full bg-zinc-800 overflow-hidden">
        {/* Recommendation Reason Pill */}
        {reason && (
          <div className="absolute top-2 left-2 right-2 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 bg-black/80 backdrop-blur-md text-red-400 border border-red-500/30 text-[9px] font-semibold px-2 py-0.5 rounded-full shadow max-w-full truncate">
              <Sparkles className="w-2.5 h-2.5 flex-shrink-0 text-red-400" />
              <span className="truncate">{reason}</span>
            </span>
          </div>
        )}

        <img
          src={posterSrc}
          alt={data.title || 'Movie Poster'}
          onError={(e) => handleImageError(e, FALLBACK_POSTER)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Readability gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

        {/* Hover overlay content */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 flex flex-col justify-end">
          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 mb-1 drop-shadow">
            {data.title}
          </h4>

          <div className="flex items-center justify-between text-[10px] sm:text-xs text-zinc-300">
            <div className="flex items-center gap-1.5">
              {data.rating && (
                <span className="border border-zinc-600 bg-black/60 px-1 py-0.5 rounded font-bold uppercase text-[9px] sm:text-[10px]">
                  {data.rating}
                </span>
              )}
              {year && <span>{year}</span>}
            </div>

            {/* Quick action button indicator */}
            <span
              className="p-1 rounded-full bg-zinc-800/90 group-hover:bg-red-600 text-zinc-300 group-hover:text-white transition-colors"
              title="More Info"
            >
              <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </span>
          </div>

          {data.genres && data.genres.length > 0 && (
            <p className="text-[10px] text-zinc-400 truncate mt-1 hidden sm:block">
              {data.genres.slice(0, 2).join(' • ')}
            </p>
          )}
        </div>
      </div>

      {/* Continue Watching progress bar at bottom */}
      {hasProgress && (
        <div className="w-full bg-zinc-800 h-1.5 overflow-hidden">
          <div
            className="bg-red-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default MovieCard;
