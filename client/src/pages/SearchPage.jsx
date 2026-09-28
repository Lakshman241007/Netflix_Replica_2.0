import React from 'react';
import useSearch from '../hooks/useSearch.js';
import SearchBar from '../components/SearchBar/SearchBar.jsx';
import MovieCard from '../components/MovieCard/MovieCard.jsx';
import { Search, Film, AlertCircle, RotateCcw } from 'lucide-react';

const POPULAR_GENRES = ['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Animation'];

export const SearchPage = () => {
  const {
    query,
    setQuery,
    debouncedQuery,
    results,
    pagination,
    loading,
    error,
    clearSearch,
    retry,
    genre,
    setGenre
  } = useSearch();

  const hasSearch = debouncedQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 pb-16 px-4 md:px-12 select-none animate-fade-in">
      {/* Search Header & SearchBar */}
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-4">
          Search
        </h1>
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={clearSearch}
          placeholder="Search by title, genre, actor, or keyword..."
          autoFocus={true}
        />

        {/* Quick Genre Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <button
            type="button"
            onClick={() => setGenre('')}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition font-medium ${
              genre === ''
                ? 'bg-red-600 border-red-600 text-white shadow-md'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
            }`}
          >
            All
          </button>
          {POPULAR_GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(genre === g.toLowerCase() ? '' : g.toLowerCase())}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition font-medium ${
                genre === g.toLowerCase()
                  ? 'bg-red-600 border-red-600 text-white shadow-md'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {/* State 1: Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <h2 className="text-xl font-bold mb-2 text-white">Something went wrong</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-md">{error}</p>
            <button
              onClick={retry}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2 px-5 rounded transition shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* State 2: Loading State (Pulsing Skeletons) */}
        {!error && loading && (
          <div>
            <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse mb-6"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] bg-zinc-800/80 rounded-md animate-pulse border border-zinc-800"
                />
              ))}
            </div>
          </div>
        )}

        {/* State 3: Results State */}
        {!error && !loading && hasSearch && results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm md:text-base font-semibold text-zinc-300">
                Found <span className="text-white font-bold">{pagination.total}</span>{' '}
                result{pagination.total === 1 ? '' : 's'} for &ldquo;
                <span className="text-red-500">{debouncedQuery}</span>&rdquo;
                {genre && <span className="text-zinc-400 text-xs ml-2">in {genre}</span>}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {results.map((movie) => (
                <MovieCard key={movie._id || movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* State 4: Empty Results (No matches found) */}
        {!error && !loading && hasSearch && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white mb-2">
              No results found for &ldquo;{debouncedQuery}&rdquo;
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm max-w-sm mb-6 leading-relaxed">
              Try searching with a different movie title, genre keyword, or check for typos.
            </p>
            <button
              onClick={clearSearch}
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold py-2 px-5 rounded transition"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* State 5: Initial Empty State (Before searching) */}
        {!error && !loading && !hasSearch && (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 mb-4">
              <Film className="w-10 h-10" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Search the Catalog
            </h2>
            <p className="text-zinc-400 text-xs md:text-sm max-w-md leading-relaxed mb-6">
              Enter any title, genre, actor name, or storyline keyword in the search bar above to discover movies and shows.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
