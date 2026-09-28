import Watchlist from '../models/Watchlist.js';
import Profile from '../models/Profile.js';
import Movie from '../models/Movie.js';
import TVShow from '../models/TVShow.js';

export const validateProfileOwnership = async (userId, profileId) => {
  if (!profileId) {
    throw new Error('Profile ID is required');
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

export const getWatchlistForProfile = async (userId, profileId) => {
  await validateProfileOwnership(userId, profileId);

  const records = await Watchlist.find({ profileId: String(profileId) });
  if (!records || records.length === 0) {
    return [];
  }

  const allMovies = await Movie.find({});
  let allShows = [];
  try {
    allShows = await TVShow.find({});
  } catch {
    allShows = [];
  }

  const result = [];
  for (const item of records) {
    const targetId = String(item.movieId || item.videoId || '');
    let content = allMovies.find((m) => String(m._id || m.id) === targetId);
    let isShow = false;

    if (!content) {
      content = allShows.find((s) => String(s._id || s.id) === targetId);
      if (content) isShow = true;
    }

    if (content) {
      result.push({
        id: content._id || content.id,
        _id: content._id || content.id,
        title: content.title,
        description: content.description,
        poster: content.poster || content.thumbnailUrl,
        backdrop: content.backdrop || content.thumbnailUrl || content.poster,
        releaseDate: content.releaseDate || (content.year ? `${content.year}-01-01` : null),
        rating: content.rating,
        duration: content.duration || (content.seasonsCount ? `${content.seasonsCount} Season${content.seasonsCount > 1 ? 's' : ''}` : '1 Season'),
        genres: content.genres || content.genre || [],
        type: isShow ? 'show' : (content.type || 'movie'),
        addedAt: item.createdAt || new Date()
      });
    }
  }

  return result;
};

export const addToWatchlistForProfile = async (userId, profileId, movieId) => {
  await validateProfileOwnership(userId, profileId);

  if (!movieId || !String(movieId).trim()) {
    throw new Error('Movie ID is required');
  }

  const cleanMovieId = String(movieId).trim();

  // Validate movie exists
  const allMovies = await Movie.find({});
  let content = allMovies.find((m) => String(m._id || m.id) === cleanMovieId);
  let isShow = false;

  if (!content) {
    try {
      const allShows = await TVShow.find({});
      content = allShows.find((s) => String(s._id || s.id) === cleanMovieId);
      if (content) isShow = true;
    } catch {
      // Ignore
    }
  }

  if (!content) {
    const err = new Error('Movie not found');
    err.status = 404;
    throw err;
  }

  // Check unique constraint (profileId + movieId)
  const existingRecords = await Watchlist.find({ profileId: String(profileId) });
  const alreadyAdded = existingRecords.some((r) => {
    const rId = String(r.movieId || r.videoId || '');
    return rId === cleanMovieId;
  });

  if (alreadyAdded) {
    const err = new Error('Movie already exists in My List');
    err.status = 400;
    throw err;
  }

  const item = await Watchlist.create({
    userId: String(userId),
    profileId: String(profileId),
    movieId: cleanMovieId,
    videoId: cleanMovieId,
    videoType: isShow ? 'show' : 'movie'
  });

  return {
    id: item._id || item.id,
    _id: item._id || item.id,
    profileId: String(profileId),
    movieId: cleanMovieId
  };
};

export const removeFromWatchlistForProfile = async (userId, profileId, movieId) => {
  await validateProfileOwnership(userId, profileId);

  if (!movieId || !String(movieId).trim()) {
    throw new Error('Movie ID is required');
  }

  const cleanMovieId = String(movieId).trim();

  const existingRecords = await Watchlist.find({ profileId: String(profileId) });
  const targetRecord = existingRecords.find((r) => {
    const rId = String(r.movieId || r.videoId || '');
    return rId === cleanMovieId;
  });

  if (!targetRecord) {
    const err = new Error('Movie not found in My List');
    err.status = 404;
    throw err;
  }

  const recordId = targetRecord._id || targetRecord.id;
  await Watchlist.deleteOne({ _id: recordId });

  return true;
};

export const checkWatchlistForProfile = async (userId, profileId, movieId) => {
  await validateProfileOwnership(userId, profileId);

  if (!movieId || !String(movieId).trim()) {
    return { inWatchlist: false };
  }

  const cleanMovieId = String(movieId).trim();
  const existingRecords = await Watchlist.find({ profileId: String(profileId) });
  const alreadyAdded = existingRecords.some((r) => {
    const rId = String(r.movieId || r.videoId || '');
    return rId === cleanMovieId;
  });

  return { inWatchlist: alreadyAdded };
};
