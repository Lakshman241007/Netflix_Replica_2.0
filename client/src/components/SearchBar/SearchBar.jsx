import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search titles, genres, keywords...',
  autoFocus = false
}) => {
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClear();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <label htmlFor="search-input" className="sr-only">
        Search for movies, TV shows, and genres
      </label>

      {/* Leading Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
        <Search className="w-5 h-5" aria-hidden="true" />
      </div>

      {/* Search Input */}
      <input
        ref={inputRef}
        id="search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        className="w-full pl-12 pr-12 py-3.5 bg-zinc-900/90 hover:bg-zinc-900 focus:bg-zinc-950 text-white placeholder-zinc-500 rounded-full border border-zinc-700/80 focus:border-red-600 outline-none text-sm md:text-base transition-all duration-200 shadow-xl"
      />

      {/* Trailing Clear Button */}
      {value && (
        <button
          type="button"
          onClick={() => {
            onClear();
            inputRef.current?.focus();
          }}
          aria-label="Clear search input"
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-white transition focus:outline-none"
        >
          <X className="w-5 h-5 bg-zinc-800 hover:bg-zinc-700 rounded-full p-0.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
