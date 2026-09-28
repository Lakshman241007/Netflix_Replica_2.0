import Movie from '../models/Movie.js';
import TVShow from '../models/TVShow.js';

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const searchCatalog = async ({
  query,
  page = 1,
  limit = 20,
  genre = null,
  type = null
}) => {
  if (!query || !query.trim()) {
    throw new Error('Search query is required');
  }

  const cleanQuery = query.trim();
  const escaped = escapeRegex(cleanQuery);
  const regex = new RegExp(escaped, 'i');

  // Clamp pagination parameters
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

  const shouldIncludeMovies = !type || type === 'movie' || type === 'all';
  const shouldIncludeShows = !type || type === 'show' || type === 'tv' || type === 'all';

  let allMovies = [];
  if (shouldIncludeMovies) {
    allMovies = await Movie.find({});
  }

  let allShows = [];
  if (shouldIncludeShows) {
    try {
      allShows = await TVShow.find({});
    } catch {
      allShows = [];
    }
  }

  const filterFn = (item) => {
    const titleMatch = item.title && regex.test(item.title);
    const descMatch = item.description && regex.test(item.description);
    const genres = Array.isArray(item.genres)
      ? item.genres
      : (Array.isArray(item.genre) ? item.genre : []);
    const genreMatch = genres.some((g) => g && regex.test(g));

    if (!titleMatch && !descMatch && !genreMatch) {
      return false;
    }

    if (genre) {
      const gRegex = new RegExp(escapeRegex(genre.trim()), 'i');
      const matchesGenre = genres.some((g) => g && gRegex.test(g));
      if (!matchesGenre) return false;
    }

    return true;
  };

  const matchedMovies = allMovies.filter(filterFn).map((m) => ({
    id: m._id || m.id,
    _id: m._id || m.id,
    title: m.title,
    description: m.description,
    poster: m.poster || m.thumbnailUrl,
    backdrop: m.backdrop || m.thumbnailUrl || m.poster,
    releaseDate: m.releaseDate,
    rating: m.rating,
    duration: m.duration,
    genres: m.genres || m.genre || [],
    type: 'movie',
    popularity: m.popularity || 50
  }));

  const matchedShows = allShows.filter(filterFn).map((s) => ({
    id: s._id || s.id,
    _id: s._id || s.id,
    title: s.title,
    description: s.description,
    poster: s.thumbnailUrl,
    backdrop: s.thumbnailUrl,
    releaseDate: s.year ? `${s.year}-01-01` : null,
    rating: s.rating,
    duration: s.seasonsCount ? `${s.seasonsCount} Season${s.seasonsCount > 1 ? 's' : ''}` : '1 Season',
    genres: s.genres || s.genre || [],
    type: 'show',
    popularity: 50
  }));

  const matchedItems = [...matchedMovies, ...matchedShows];

  // Relevance sorting: Exact title match > title starts with > popularity
  const lowerCleanQuery = cleanQuery.toLowerCase();
  matchedItems.sort((a, b) => {
    const aTitle = (a.title || '').toLowerCase();
    const bTitle = (b.title || '').toLowerCase();

    const aExact = aTitle === lowerCleanQuery ? 1 : 0;
    const bExact = bTitle === lowerCleanQuery ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;

    const aStarts = aTitle.startsWith(lowerCleanQuery) ? 1 : 0;
    const bStarts = bTitle.startsWith(lowerCleanQuery) ? 1 : 0;
    if (aStarts !== bStarts) return bStarts - aStarts;

    return (b.popularity || 0) - (a.popularity || 0);
  });

  const total = matchedItems.length;
  const startIndex = (parsedPage - 1) * parsedLimit;
  const paginatedData = matchedItems.slice(startIndex, startIndex + parsedLimit);
  const hasNextPage = startIndex + parsedLimit < total;

  return {
    data: paginatedData,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      hasNextPage
    }
  };
};

export default searchCatalog;
