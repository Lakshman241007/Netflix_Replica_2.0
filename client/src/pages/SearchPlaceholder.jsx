import React from 'react';
import { Search, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SearchPlaceholder = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center select-none pt-20">
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-8 max-w-md shadow-2xl flex flex-col items-center">
        <div className="p-4 rounded-full bg-red-600/10 border border-red-600/30 text-red-600 mb-4">
          <Search className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-black text-white mb-2">Search Catalog</h1>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          Real-time catalog search with full-text indexing, multi-category filters, and actor lookups will be established in the dedicated Search Phase.
        </p>

        <Link
          to="/movies"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2.5 px-6 rounded transition"
        >
          Explore Movies
        </Link>

        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-6 pt-4 border-t border-zinc-800/80 w-full justify-center">
          <Clock className="w-3.5 h-3.5" />
          <span>Coming in Search Phase</span>
        </div>
      </div>
    </div>
  );
};

export default SearchPlaceholder;
