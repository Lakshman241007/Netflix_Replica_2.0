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

export const getHistory = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  try {
    const { page, limit } = req.query;
    const data = await historyService.getWatchHistory(userId, profileId, { page, limit });
    return res.status(200).json({
      success: true,
      data: data.items,
      pagination: data.pagination
    });
  } catch (err) {
    const status = err.status || 500;
    return errorResponse(res, err.message || 'Unable to retrieve watch history', status);
  }
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

export const getHistoryItem = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);
  const movieId = req.params.movieId || req.params.id || req.query.movieId;

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  if (!movieId) {
    return errorResponse(res, 'Movie ID is required', 400);
  }

  try {
    const item = await historyService.getWatchHistoryItem(userId, profileId, movieId);
    if (!item) {
      return errorResponse(res, 'Watch history record not found for this movie', 404);
    }
    return successResponse(res, item, 'Watch history item retrieved successfully');
  } catch (err) {
    const status = err.status || 500;
    return errorResponse(res, err.message || 'Unable to retrieve history record', status);
  }
};

export const saveHistory = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);
  const movieId = req.params.movieId || req.body.movieId || req.body.videoId || req.params.id;

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  if (!movieId) {
    return errorResponse(res, 'Movie ID is required', 400);
  }

  try {
    const data = await historyService.saveWatchHistory(userId, profileId, movieId, {
      position: req.body.position !== undefined ? req.body.position : req.body.progress,
      duration: req.body.duration,
      completed: req.body.completed
    });

    return successResponse(res, data, 'Watch history record saved successfully', 200);
  } catch (err) {
    const status = err.status || 400;
    return errorResponse(res, err.message || 'Unable to save watch history record', status);
  }
};

export const deleteHistoryItem = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);
  const movieId = req.params.movieId || req.params.id || req.body?.movieId || req.query?.movieId;

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  if (!movieId) {
    return errorResponse(res, 'Movie ID is required', 400);
  }

  try {
    await historyService.deleteWatchHistoryItem(userId, profileId, movieId);
    return successResponse(res, null, 'Watch history item removed successfully');
  } catch (err) {
    const status = err.status || 400;
    return errorResponse(res, err.message || 'Unable to remove watch history item', status);
  }
};

export const clearHistory = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  try {
    await historyService.clearWatchHistory(userId, profileId);
    return successResponse(res, null, 'Profile watch history cleared successfully');
  } catch (err) {
    const status = err.status || 400;
    return errorResponse(res, err.message || 'Unable to clear watch history', status);
  }
};

// Compatibility aliases
export const getWatchHistory = getHistory;
export const addToWatchHistory = saveHistory;
export const deleteWatchHistoryItem = deleteHistoryItem;
