import Movie from '../models/Movie.js';
import TVShow from '../models/TVShow.js';
import WatchHistory from '../models/WatchHistory.js';
import Watchlist from '../models/Watchlist.js';
import Profile from '../models/Profile.js';

/**
 * Validate that the profile exists and belongs to the authenticated user
 */
export const validateProfileOwnership = async (userId, profileId) => {
  if (!profileId) {
    const error = new Error('Profile ID is required');
    error.status = 400;
    throw error;
  }

  const profile = await Profile.findOne({
    _id: String(profileId),
    userId: String(userId)
  });

  if (!profile) {
    const error = new Error('Active profile not found or does not belong to your account');
    error.status = 403;
    throw error;
  }

  return profile;
};

/**
 * Generate transparent, explainable recommendations for the active profile
 */
export const getPersonalizedRecommendations = async (userId, profileId, { limit = 10 } = {}) => {
  // 1. Validate ownership
  await validateProfileOwnership(userId, profileId);

  // 2. Fetch all content catalog
  const allMovies = await Movie.find({});
  let allShows = [];
  try {
    allShows = await TVShow.find({});
  } catch {
    // Optional
  }
  const allContent = [...allMovies, ...allShows];

  if (!allContent || allContent.length === 0) {
    return [];
  }

  // 3. Fetch active profile watch history & watchlist
  const history = await WatchHistory.find({ profileId: String(profileId) });
  const watchlist = await Watchlist.find({ profileId: String(profileId) });

  const watchedMovieIds = new Set(
    history.map((h) => String(h.movieId || h.videoId || h._id))
  );
  const watchlistMovieIds = new Set(
    watchlist.map((w) => String(w.movieId || w.videoId || w._id))
  );

  // 4. Calculate genre frequencies from Watch History
  const genreFrequency = {};
  for (const h of history) {
    const matchingItem = allContent.find((c) => String(c._id || c.id) === String(h.movieId || h.videoId));
    const itemGenres = matchingItem?.genres || matchingItem?.genre || h.genres || [];
    const gList = Array.isArray(itemGenres) ? itemGenres : [itemGenres];
    for (const g of gList) {
      if (g) {
        const key = String(g).trim();
        genreFrequency[key] = (genreFrequency[key] || 0) + 1;
      }
    }
  }

  // 5. Calculate genres from Watchlist
  const watchlistGenres = new Set();
  for (const w of watchlist) {
    const matchingItem = allContent.find((c) => String(c._id || c.id) === String(w.movieId || w.videoId));
    const itemGenres = matchingItem?.genres || matchingItem?.genre || w.genres || [];
    const gList = Array.isArray(itemGenres) ? itemGenres : [itemGenres];
    for (const g of gList) {
      if (g) {
        watchlistGenres.add(String(g).trim());
      }
    }
  }

  // Sorted list of top watched genres
  const sortedWatchedGenres = Object.keys(genreFrequency).sort(
    (a, b) => genreFrequency[b] - genreFrequency[a]
  );
  const topGenre = sortedWatchedGenres[0] || null;

  // 6. Score candidate content
  const scoredItems = [];

  for (const item of allContent) {
    const itemId = String(item._id || item.id);
    const isWatched = watchedMovieIds.has(itemId);
    const isWatchlisted = watchlistMovieIds.has(itemId);

    // Genres for this item
    const itemGenres = item.genres || item.genre || [];
    const gList = Array.isArray(itemGenres) ? itemGenres : [itemGenres];

    let score = 0;
    let reason = 'Popular on Netflix';

    // Check watch history genre matches
    const matchedWatchedGenre = gList.find((g) => genreFrequency[String(g).trim()] > 0);
    if (matchedWatchedGenre) {
      const gName = String(matchedWatchedGenre).trim();
      if (gName === topGenre) {
        score += 5;
        reason = `Because you watched ${gName} movies`;
      } else {
        score += 3;
        reason = `Because you watched ${gName} movies`;
      }
    }

    // Check watchlist genre match
    const matchedWatchlistGenre = gList.find((g) => watchlistGenres.has(String(g).trim()));
    if (matchedWatchlistGenre) {
      score += 3;
      if (!matchedWatchedGenre) {
        reason = `Because you added ${matchedWatchlistGenre} to My List`;
      }
    }

    // Popularity / Trending bonus
    const pop = Number(item.popularity) || 0;
    const ratingNum = parseFloat(item.rating) || 0;
    if (item.featured || pop >= 80) {
      score += 2;
      if (!matchedWatchedGenre && !matchedWatchlistGenre) {
        reason = 'Popular right now';
      }
    } else if (pop >= 60 || ratingNum >= 8.0) {
      score += 1;
      if (!matchedWatchedGenre && !matchedWatchlistGenre) {
        reason = 'Trending on Netflix';
      }
    }

    // Penalize already watched items so fresh recommendations are preferred
    if (isWatched) {
      score -= 100;
    }

    // Slightly deprioritize already watchlisted items (user already knows them)
    if (isWatchlisted) {
      score -= 2;
    }

    scoredItems.push({
      item,
      score,
      reason,
      isWatched
    });
  }

  // 7. Sort by score descending
  scoredItems.sort((a, b) => b.score - a.score);

  // Take unwatched candidates first
  let candidates = scoredItems.filter((s) => !s.isWatched);

  // If not enough unwatched candidates, include fallback items
  if (candidates.length < limit) {
    const remaining = scoredItems.filter((s) => s.isWatched);
    candidates = [...candidates, ...remaining];
  }

  const finalItems = candidates.slice(0, Number(limit) || 10).map(({ item, reason, score }) => {
    const raw = item.toObject ? item.toObject() : { ...item };
    return {
      ...raw,
      _id: raw._id || raw.id,
      id: raw._id || raw.id,
      movie: { ...raw, _id: raw._id || raw.id, id: raw._id || raw.id },
      reason,
      score
    };
  });

  return finalItems;
};
