import React, { useState, useEffect, useCallback } from 'react';
import * as movieService from '../services/movieService.js';
import MovieRow from '../components/MovieRow/MovieRow.jsx';
import HeroBanner from '../components/HeroBanner/HeroBanner.jsx';

export const MoviesPage = () => {
  const [featured, setFeatured] = useState(null);
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [action, setAction] = useState([]);
  const [drama, setDrama] = useState([]);
  const [comedy, setComedy] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMoviesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        featuredRes,
        popularRes,
        trendingRes,
        actionRes,
        dramaRes,
        comedyRes
      ] = await Promise.all([
        movieService.getFeaturedMovies(),
        movieService.getPopularMovies(10),
        movieService.getTrendingMovies(10),
        movieService.getMoviesByGenre('action'),
        movieService.getMoviesByGenre('drama'),
        movieService.getMoviesByGenre('comedy')
      ]);

      const featList = featuredRes.data || [];
      setFeatured(featList[0] || (popularRes.data && popularRes.data[0]) || null);
      setPopular(popularRes.data || []);
      setTrending(trendingRes.data || []);
      setAction(actionRes.data || []);
      setDrama(dramaRes.data || []);
      setComedy(comedyRes.data || []);
    } catch (err) {
      console.error('Failed to load movies catalog:', err);
      setError('Unable to load movies browse data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMoviesData();
  }, [loadMoviesData]);

  return (
    <div className="min-h-screen bg-[#141414] text-white pb-16 overflow-x-hidden animate-fade-in select-none">
      {/* Page Header */}
      <div className="pt-20 px-4 sm:px-8 md:px-12 pb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-100 tracking-tight">
          Movies
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
          Explore top blockbuster movies, award-winning dramas, comedies, and action hits.
        </p>
      </div>

      {/* Featured Spotlight Banner */}
      {featured && <HeroBanner movie={featured} loading={loading} />}

      {/* Categorized Rows */}
      <div className="flex flex-col gap-2 mt-4 relative z-20">
        <MovieRow
          title="Popular Movies"
          movies={popular}
          loading={loading}
          error={error}
          onRetry={loadMoviesData}
        />

        <MovieRow
          title="Trending Movies"
          movies={trending}
          loading={loading}
          error={error}
          onRetry={loadMoviesData}
        />

        <MovieRow
          title="Action Blockbusters"
          movies={action}
          loading={loading}
          error={error}
          onRetry={loadMoviesData}
        />

        <MovieRow
          title="Compelling Dramas"
          movies={drama}
          loading={loading}
          error={error}
          onRetry={loadMoviesData}
        />

        <MovieRow
          title="Comedy Hits"
          movies={comedy}
          loading={loading}
          error={error}
          onRetry={loadMoviesData}
        />
      </div>
    </div>
  );
};

export default MoviesPage;
