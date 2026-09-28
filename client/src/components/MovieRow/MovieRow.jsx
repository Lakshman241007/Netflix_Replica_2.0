import React, { useRef } from 'react';
import MovieCard from '../MovieCard/MovieCard.jsx';
import { ChevronLeft, ChevronRight, AlertCircle, RotateCcw } from 'lucide-react';

export const MovieRow = ({
  title,
  movies = [],
  loading = false,
  error = null,
  onRetry = null,
  onSelectMovie = null
}) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="mb-8 md:mb-10 relative group/row" aria-label={title}>
      {/* Row Header */}
      <div className="flex items-center justify-between mb-3 px-4 sm:px-8 md:px-12">
        <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-zinc-100">
          {title}
        </h2>
      </div>

      {/* Row Body */}
      <div className="relative">
        {/* Left Arrow Button (Desktop hover only) */}
        {!loading && !error && movies.length > 0 && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 cursor-pointer hidden md:flex"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={rowRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-8 md:px-12 pb-3 scroll-smooth no-scrollbar"
        >
          {loading ? (
            /* Loading Skeleton Cards: [ ░░░ ] [ ░░░ ] [ ░░░ ] [ ░░░ ] */
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-36 sm:w-44 md:w-48 aspect-[2/3] rounded-md bg-zinc-800/80 animate-pulse border border-zinc-700/40 flex flex-col justify-end p-3"
              >
                <div className="h-3 bg-zinc-700 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-zinc-700 rounded w-1/2"></div>
              </div>
            ))
          ) : error ? (
            /* Row-level Error State */
            <div className="w-full py-8 px-4 bg-zinc-900/60 border border-zinc-800 rounded flex flex-col items-center justify-center text-center gap-2">
              <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>Unable to load this section.</span>
              </div>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-1 flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 font-semibold px-3 py-1 bg-red-950/40 border border-red-900/50 rounded transition"
                >
                  <RotateCcw className="w-3 h-3" /> Retry
                </button>
              )}
            </div>
          ) : movies.length === 0 ? (
            /* Empty State */
            <div className="w-full py-6 text-zinc-500 text-xs sm:text-sm">
              No movies available.
            </div>
          ) : (
            /* Movie Cards */
            movies.map((movie) => (
              <MovieCard
                key={movie._id || movie.id}
                movie={movie}
                onClick={onSelectMovie}
              />
            ))
          )}
        </div>

        {/* Right Arrow Button (Desktop hover only) */}
        {!loading && !error && movies.length > 0 && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 cursor-pointer hidden md:flex"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </section>
  );
};

export default MovieRow;
