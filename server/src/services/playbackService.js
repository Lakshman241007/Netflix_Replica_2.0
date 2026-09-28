import Playback from '../models/Playback.js';
import WatchHistory from '../models/WatchHistory.js';
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

export const normalizePlaybackValues = (position, duration, isCompleted = false) => {
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

export const getPlaybackState = async (userId, profileId, movieId) => {
  await validateProfileOwnership(userId, profileId);
  await validateMovieExists(movieId);

  const cleanMovieId = String(movieId).trim();
  const playback = await Playback.findOne({
    profileId: String(profileId),
    $or: [{ movieId: cleanMovieId }, { videoId: cleanMovieId }]
  });

  if (!playback) {
    return {
      movieId: cleanMovieId,
      position: 0,
      duration: 0,
      progress: 0,
      isPlaying: false,
      completed: false,
      lastPlayedAt: null
    };
  }

  return {
    id: playback._id || playback.id,
    movieId: cleanMovieId,
    position: Number(playback.position || 0),
    duration: Number(playback.duration || 0),
    progress: Number(playback.progress || 0),
    isPlaying: !!playback.isPlaying,
    completed: !!playback.completed,
    lastPlayedAt: playback.lastPlayedAt || playback.updatedAt
  };
};

export const saveOrUpdatePlayback = async (userId, profileId, movieId, data = {}) => {
  await validateProfileOwnership(userId, profileId);
  const movie = await validateMovieExists(movieId);

  const cleanMovieId = String(movieId).trim();
  const normalized = normalizePlaybackValues(data.position, data.duration, data.completed);

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
    isPlaying: data.isPlaying !== undefined ? !!data.isPlaying : false,
    videoType: movie.type || 'movie',
    lastPlayedAt: new Date()
  };

  const updated = await Playback.findOneAndUpdate(filter, update, { upsert: true });

  try {
    await WatchHistory.findOneAndUpdate(
      { profileId: String(profileId), $or: [{ movieId: cleanMovieId }, { videoId: cleanMovieId }] },
      {
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
      },
      { upsert: true }
    );
  } catch {
    // Non-fatal if history sync fails
  }

  return {
    id: updated._id || updated.id,
    movieId: cleanMovieId,
    position: normalized.position,
    duration: normalized.duration,
    progress: normalized.progress,
    completed: normalized.completed,
    isPlaying: update.isPlaying,
    lastPlayedAt: update.lastPlayedAt
  };
};

export const completePlayback = async (userId, profileId, movieId) => {
  await validateProfileOwnership(userId, profileId);
  const movie = await validateMovieExists(movieId);

  const cleanMovieId = String(movieId).trim();
  const existing = await Playback.findOne({
    profileId: String(profileId),
    $or: [{ movieId: cleanMovieId }, { videoId: cleanMovieId }]
  });

  const duration = existing?.duration || 0;

  const update = {
    userId: String(userId),
    profileId: String(profileId),
    movieId: cleanMovieId,
    videoId: cleanMovieId,
    position: duration,
    duration,
    progress: 100,
    completed: true,
    isPlaying: false,
    videoType: movie.type || 'movie',
    lastPlayedAt: new Date()
  };

  const updated = await Playback.findOneAndUpdate(
    { profileId: String(profileId), $or: [{ movieId: cleanMovieId }, { videoId: cleanMovieId }] },
    update,
    { upsert: true }
  );

  try {
    await WatchHistory.findOneAndUpdate(
      { profileId: String(profileId), $or: [{ movieId: cleanMovieId }, { videoId: cleanMovieId }] },
      {
        userId: String(userId),
        profileId: String(profileId),
        movieId: cleanMovieId,
        videoId: cleanMovieId,
        position: duration,
        duration,
        progress: 100,
        completed: true,
        videoType: movie.type || 'movie',
        watchedAt: new Date()
      },
      { upsert: true }
    );
  } catch {
    // Non-fatal
  }

  return {
    id: updated._id || updated.id,
    movieId: cleanMovieId,
    position: duration,
    duration,
    progress: 100,
    completed: true,
    isPlaying: false,
    lastPlayedAt: update.lastPlayedAt
  };
};

export const deletePlaybackState = async (userId, profileId, movieId) => {
  await validateProfileOwnership(userId, profileId);
  await validateMovieExists(movieId);

  const cleanMovieId = String(movieId).trim();
  const existing = await Playback.findOne({
    profileId: String(profileId),
    $or: [{ movieId: cleanMovieId }, { videoId: cleanMovieId }]
  });

  if (!existing) {
    const error = new Error('Playback state not found');
    error.status = 404;
    throw error;
  }

  await Playback.deleteOne({ _id: existing._id || existing.id });
  return true;
};
