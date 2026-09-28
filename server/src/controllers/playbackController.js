import * as playbackService from '../services/playbackService.js';
import * as historyService from '../services/historyService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const resolveProfileId = (req) => {
  return (
    req.headers['x-profile-id'] ||
    req.query.profileId ||
    (req.body && req.body.profileId) ||
    null
  );
};

export const getContinueWatching = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  try {
    const { limit } = req.query;
    const items = await historyService.getContinueWatching(userId, profileId, { limit });
    return successResponse(res, items, 'Continue watching retrieved successfully');
  } catch (err) {
    const status = err.status || 500;
    return errorResponse(res, err.message || 'Unable to retrieve continue watching', status);
  }
};

export const getPlayback = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);
  const movieId = req.params.movieId || req.query.movieId || req.query.videoId;

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  if (!movieId) {
    return errorResponse(res, 'Movie ID is required', 400);
  }

  try {
    const data = await playbackService.getPlaybackState(userId, profileId, movieId);
    return successResponse(res, data, 'Playback state retrieved successfully');
  } catch (err) {
    const status = err.status || 500;
    return errorResponse(res, err.message || 'Unable to retrieve playback state', status);
  }
};

export const initOrUpdatePlayback = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);
  const movieId = req.params.movieId || req.body.movieId || req.body.videoId;

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  if (!movieId) {
    return errorResponse(res, 'Movie ID is required', 400);
  }

  try {
    const data = await playbackService.saveOrUpdatePlayback(userId, profileId, movieId, {
      position: req.body.position !== undefined ? req.body.position : req.body.progress,
      duration: req.body.duration,
      isPlaying: req.body.isPlaying,
      completed: req.body.completed
    });

    return successResponse(res, data, 'Playback state saved successfully', 200);
  } catch (err) {
    const status = err.status || 400;
    return errorResponse(res, err.message || 'Unable to save playback state', status);
  }
};

export const markPlaybackComplete = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);
  const movieId = req.params.movieId || req.body?.movieId || req.query?.movieId;

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  if (!movieId) {
    return errorResponse(res, 'Movie ID is required', 400);
  }

  try {
    const data = await playbackService.completePlayback(userId, profileId, movieId);
    return successResponse(res, data, 'Playback marked as completed');
  } catch (err) {
    const status = err.status || 400;
    return errorResponse(res, err.message || 'Unable to complete playback', status);
  }
};

export const deletePlayback = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);
  const movieId = req.params.movieId || req.body?.movieId || req.query?.movieId;

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  if (!movieId) {
    return errorResponse(res, 'Movie ID is required', 400);
  }

  try {
    await playbackService.deletePlaybackState(userId, profileId, movieId);
    return successResponse(res, null, 'Playback state deleted successfully');
  } catch (err) {
    const status = err.status || 400;
    return errorResponse(res, err.message || 'Unable to delete playback state', status);
  }
};

// Legacy compatibility exports
export const getPlaybackState = getPlayback;
export const savePlaybackState = initOrUpdatePlayback;
