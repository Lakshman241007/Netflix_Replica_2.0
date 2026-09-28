import React from 'react';
import useMovies from '../../hooks/useMovies.js';
import useContinueWatching from '../../hooks/useContinueWatching.js';
import useRecommendations from '../../hooks/useRecommendations.js';
import HeroBanner from '../../components/HeroBanner/HeroBanner.jsx';
import MovieRow from '../../components/MovieRow/MovieRow.jsx';

export const HomePage = () => {
  const {
    continueWatchingList,
    loading: loadingContinueWatching,
    error: errorContinueWatching,
    refresh: fetchContinueWatching
  } = useContinueWatching();

  const {
    recommendations,
    loading: loadingRecommendations,
    error: errorRecommendations,
    refresh: fetchRecommendations
  } = useRecommendations();

  const {
    featured,
    loadingFeatured,
    trending,
    loadingTrending,
    errorTrending,
    fetchTrending,
    popular,
    loadingPopular,
    errorPopular,
    fetchPopular,
    action,
    loadingAction,
    errorAction,
    fetchAction,
    drama,
    loadingDrama,
    errorDrama,
    fetchDrama,
    comedy,
    loadingComedy,
    errorComedy,
    fetchComedy,
    sciFi,
    loadingSciFi,
    errorSciFi,
    fetchSciFi
  } = useMovies();

  return (
    <div className="min-h-screen bg-[#141414] text-white pb-16 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <HeroBanner movie={featured} loading={loadingFeatured} />

      {/* 2. MOVIE ROWS CONTAINER */}
      <div className="flex flex-col gap-2 -mt-6 sm:-mt-10 md:-mt-14 relative z-20">
        {/* Continue Watching for Active Profile */}
        {continueWatchingList && continueWatchingList.length > 0 && (
          <MovieRow
            title="Continue Watching"
            movies={continueWatchingList}
            loading={loadingContinueWatching}
            error={errorContinueWatching}
            onRetry={fetchContinueWatching}
          />
        )}

        {/* Recommended For You / Top Picks */}
        {recommendations && recommendations.length > 0 && (
          <MovieRow
            title="Recommended For You"
            movies={recommendations}
            loading={loadingRecommendations}
            error={errorRecommendations}
            onRetry={fetchRecommendations}
          />
        )}

        {/* Trending Now */}
        <MovieRow
          title="Trending Now"
          movies={trending}
          loading={loadingTrending}
          error={errorTrending}
          onRetry={fetchTrending}
        />

        {/* Popular on Netflix */}
        <MovieRow
          title="Popular"
          movies={popular}
          loading={loadingPopular}
          error={errorPopular}
          onRetry={fetchPopular}
        />

        {/* Action Blockbusters */}
        <MovieRow
          title="Action"
          movies={action}
          loading={loadingAction}
          error={errorAction}
          onRetry={fetchAction}
        />

        {/* Drama */}
        <MovieRow
          title="Drama"
          movies={drama}
          loading={loadingDrama}
          error={errorDrama}
          onRetry={fetchDrama}
        />

        {/* Comedy */}
        <MovieRow
          title="Comedy"
          movies={comedy}
          loading={loadingComedy}
          error={errorComedy}
          onRetry={fetchComedy}
        />

        {/* Sci-Fi & Fantasy */}
        <MovieRow
          title="Sci-Fi & Fantasy"
          movies={sciFi}
          loading={loadingSciFi}
          error={errorSciFi}
          onRetry={fetchSciFi}
        />
      </div>
    </div>
  );
};

export default HomePage;
