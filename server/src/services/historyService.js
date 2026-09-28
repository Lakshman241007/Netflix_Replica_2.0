import WatchHistory from '../models/WatchHistory.js';
import Playback from '../models/Playback.js';
import Profile from '../models/Profile.js';
import Movie from '../models/Movie.js';
import TVShow from '../models/TVShow.js';

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

export const validateMovieExists = async (movieId) => {
  if (!movieId || !String(movieId).trim()) {
    const error = new Error('Movie ID is required');
    error.status = 400;
    throw error;
  }

  const cleanMovieId = String(movieId).trim();
  const allMovies = await Movie.find({});
  let content = allMovies.find((m) => String(m._id || m.id) === cleanMovieId);

  if (!content) {
    try {
      const allShows = await TVShow.find({});
      content = allShows.find((s) => String(s._id || s.id) === cleanMovieId);
    } catch {
      // Ignore
    }
  }

  if (!content) {
    const error = new Error('Movie not found');
    error.status = 404;
    throw error;
  }

  return content;
};

export const normalizeHistoryValues = (position, duration, isCompleted = false) => {
  let pos = Number(position) || 0;
  let dur = Number(duration) || 0;

  if (pos < 0) pos = 0;
  if (dur < 0) dur = 0;
  if (dur > 0 && pos > dur) pos = dur;

  let progress = 0;
  if (dur > 0) {
    progress = Number(((pos / dur) * 100).toFixed(2));
    if (progress > 100) progress = 100;
  }

  const completed = isCompleted || (dur > 0 && progress >= 95);

  return {
    position: pos,
    duration: dur,
    progress,
    completed
  };
};

export const formatHistoryMovie = (content) => {
  if (!content) return null;
  const id = content._id || content.id;
  const poster = content.poster || content.thumbnailUrl || content.posterUrl || '';
  const backdrop = content.backdrop || content.thumbnailUrl || poster;

  return {
    id,
    _id: id,
    title: content.title,
    description: content.description,
    poster,
    posterUrl: poster,
    thumbnailUrl: poster,
    backdrop,
    rating: content.rating || 'PG-13',
    duration: content.duration || '',
    genres: content.genres || [],
    releaseDate: content.releaseDate || (content.year ? `${content.year}-01-01` : null),
    type: content.type || 'movie'
  };
};

export const getWatchHistory = async (userId, profileId, { page = 1, limit = 20 } = {}) => {
  await validateProfileOwnership(userId, profileId);

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));

  const records = await WatchHistory.find({ profileId: String(profileId) });

  // Sort descending by watchedAt / updatedAt
  records.sort((a, b) => {
    const timeA = new Date(a.watchedAt || a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.watchedAt || b.updatedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const total = records.length;
  const totalPages = Math.ceil(total / limitNum) || 1;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = records.slice(startIndex, startIndex + limitNum);

  const allMovies = await Movie.find({});
  let allShows = [];
  try {
    allShows = await TVShow.find({});
  } catch {
    allShows = [];
  }

  const data = paginated.map((item) => {
    const targetId = String(item.movieId || item.videoId || '');
    let content = allMovies.find((m) => String(m._id || m.id) === targetId);
    if (!content) {
      content = allShows.find((s) => String(s._id || s.id) === targetId);
    }

    return {
      id: item._id || item.id,
      _id: item._id || item.id,
      movieId: targetId,
      position: Number(item.position || 0),
      duration: Number(item.duration || 0),
      progress: Number(item.progress || 0),
      completed: !!item.completed,
      watchedAt: item.watchedAt || item.updatedAt || item.createdAt,
      movie: formatHistoryMovie(content)
    };
  });

  return {
    items: data,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages
    }
  };
};

export const getWatchHistoryItem = async (userId, profileId, movieId) => {
  await validateProfileOwnership(userId, profileId);
  const movie = await validateMovieExists(movieId);

  const cleanMovieId = String(movieId).trim();
  const record = await WatchHistory.findOne({
    profileId: String(profileId),
    $or: [{ movieId: cleanMovieId }, { videoId: cleanMovieId }]
  });

  if (!record) {
    return null;
  }

  return {
    id: record._id || record.id,
    _id: record._id || record.id,
    movieId: cleanMovieId,
    position: Number(record.position || 0),
    duration: Number(record.duration || 0),
    progress: Number(record.progress || 0),
    completed: !!record.completed,
    watchedAt: record.watchedAt || record.updatedAt,
    movie: formatHistoryMovie(movie)
  };
};

export const saveWatchHistory = async (userId, profileId, movieId, data = {}) => {
  await validateProfileOwnership(userId, profileId);
  const movie = await validateMovieExists(movieId);

  const cleanMovieId = String(movieId).trim();
  const normalized = normalizeHistoryValues(data.position, data.duration, data.completed);

  const filter = {
    profileId: String(profileId),
    $or: [{ movieId: cleanMovieId }, { videoId: cleanMovieId }]
  };

  const update = {
    userId: String(userId),
    profileId: String(profileId),
    movieId: cleanMovieId,
    videoId: cleanMovieId,
    position: normalized.position,
    duration: normalized.duration,
    progress: normalized.progress,
    completed: normalized.completed,
    videoType: movie.type || 'movie',
    watchedAt: new Date()
  };

  const updated = await WatchHistory.findOneAndUpdate(filter, update, { upsert: true });

  return {
    id: updated._id || updated.id,
    _id: updated._id || updated.id,
    movieId: cleanMovieId,
    position: normalized.position,
    duration: normalized.duration,
    progress: normalized.progress,
    completed: normalized.completed,
    watchedAt: update.watchedAt,
    movie: formatHistoryMovie(movie)
  };
};

export const deleteWatchHistoryItem = async (userId, profileId, movieId) => {
  await validateProfileOwnership(userId, profileId);
  await validateMovieExists(movieId);

  const cleanMovieId = String(movieId).trim();
  const existing = await WatchHistory.findOne({
    profileId: String(profileId),
    $or: [{ movieId: cleanMovieId }, { videoId: cleanMovieId }]
  });

  if (!existing) {
    const error = new Error('Watch history record not found');
    error.status = 404;
    throw error;
  }

  await WatchHistory.deleteOne({ _id: existing._id || existing.id });
  return true;
};

export const clearWatchHistory = async (userId, profileId) => {
  await validateProfileOwnership(userId, profileId);

  await WatchHistory.deleteMany({ profileId: String(profileId) });
  return true;
};

export const getContinueWatching = async (userId, profileId, { limit = 20 } = {}) => {
  await validateProfileOwnership(userId, profileId);

  const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 20));

  // Retrieve watch histories and playbacks for this profile
  const [histories, playbacks, allMovies] = await Promise.all([
    WatchHistory.find({ profileId: String(profileId) }),
    Playback.find({ profileId: String(profileId) }),
    Movie.find({})
  ]);

  let allShows = [];
  try {
    allShows = await TVShow.find({});
  } catch {
    allShows = [];
  }

  // Filter histories with meaningful incomplete progress
  const activeHistories = histories.filter((h) => {
    const pos = Number(h.position || 0);
    const prog = Number(h.progress || 0);
    const isComp = !!h.completed;
    return pos > 0 && prog < 95 && !isComp;
  });

  // Sort descending by watchedAt / updatedAt
  activeHistories.sort((a, b) => {
    const timeA = new Date(a.watchedAt || a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.watchedAt || b.updatedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const sliced = activeHistories.slice(0, limitNum);

  const results = [];
  for (const item of sliced) {
    const mid = String(item.movieId || item.videoId || '');
    let content = allMovies.find((m) => String(m._id || m.id) === mid);
    if (!content) {
      content = allShows.find((s) => String(s._id || s.id) === mid);
    }

    if (content) {
      // Find playback for exact playhead position if available
      const pb = playbacks.find((p) => String(p.movieId || p.videoId) === mid);
      const position = pb ? Number(pb.position || item.position) : Number(item.position || 0);
      const duration = pb ? Number(pb.duration || item.duration) : Number(item.duration || 0);
      const progress = pb ? Number(pb.progress || item.progress) : Number(item.progress || 0);

      const formatted = formatHistoryMovie(content);
      results.push({
        id: formatted.id,
        _id: formatted.id,
        movieId: mid,
        position,
        duration,
        progress,
        completed: false,
        watchedAt: item.watchedAt || item.updatedAt,
        movie: formatted,
        // Flat movie properties for direct MovieCard compatibility
        title: formatted.title,
        description: formatted.description,
        poster: formatted.poster,
        posterUrl: formatted.poster,
        thumbnailUrl: formatted.poster,
        backdrop: formatted.backdrop,
        rating: formatted.rating,
        genres: formatted.genres,
        type: formatted.type
      });
    }
  }

  return results;
};
