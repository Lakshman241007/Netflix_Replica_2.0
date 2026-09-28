import React, { useState, useEffect } from 'react';
import { Tv, Clock, Sparkles } from 'lucide-react';
import * as movieService from '../services/movieService.js';

export const TVShowsPlaceholder = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    movieService.getShows().then((res) => {
      if (res.success && res.data) {
        setShows(res.data);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center select-none pt-20">
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-8 max-w-lg shadow-2xl flex flex-col items-center">
        <div className="p-4 rounded-full bg-red-600/10 border border-red-600/30 text-red-600 mb-4">
          <Tv className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-black text-white mb-2">TV Shows Experience</h1>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          TV Shows are coming in Phase 10. Multi-season organization, episodic catalogs, and show bingeing will be established in that phase.
        </p>

        {shows.length > 0 && (
          <div className="w-full bg-black/40 border border-zinc-800/80 rounded-lg p-4 text-left mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Seeded Series Foundation
            </span>
            <p className="text-sm font-semibold text-white">{shows[0].title}</p>
            <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{shows[0].description}</p>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Scheduled for Phase 10 (TV Shows & Episodes)</span>
        </div>
      </div>
    </div>
  );
};

export default TVShowsPlaceholder;
