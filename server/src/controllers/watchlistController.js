import {
  getWatchlistForProfile,
  addToWatchlistForProfile,
  removeFromWatchlistForProfile,
  checkWatchlistForProfile
} from '../services/watchlistService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const resolveProfileId = (req) => {
  return (
    req.headers['x-profile-id'] ||
    req.query.profileId ||
    (req.body && req.body.profileId) ||
    null
  );
};

export const getWatchlist = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  try {
    const list = await getWatchlistForProfile(userId, profileId);
    return successResponse(res, list, 'Watchlist retrieved successfully');
  } catch (err) {
    const status = err.status || (err.message && err.message.includes('Profile ID is required') ? 400 : 500);
    return errorResponse(res, err.message || 'Unable to retrieve watchlist', status);
  }
};

export const addToWatchlist = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);
  const movieId = req.body.movieId || req.body.videoId;

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  if (!movieId) {
    return errorResponse(res, 'Movie ID is required', 400);
  }

  try {
    const item = await addToWatchlistForProfile(userId, profileId, movieId);
    return successResponse(res, item, 'Added to My List', 201);
  } catch (err) {
    const status = err.status || 400;
    return errorResponse(res, err.message || 'Unable to add to watchlist', status);
  }
};

export const removeFromWatchlist = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);
  const movieId = req.params.movieId || (req.body && (req.body.movieId || req.body.videoId));

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  if (!movieId) {
    return errorResponse(res, 'Movie ID is required', 400);
  }

  try {
    await removeFromWatchlistForProfile(userId, profileId, movieId);
    return successResponse(res, null, 'Removed from My List');
  } catch (err) {
    const status = err.status || 400;
    return errorResponse(res, err.message || 'Unable to remove from watchlist', status);
  }
};

export const checkWatchlist = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const profileId = resolveProfileId(req);
  const { movieId } = req.params;

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  try {
    const result = await checkWatchlistForProfile(userId, profileId, movieId);
    return successResponse(res, result);
  } catch (err) {
    const status = err.status || 400;
    return errorResponse(res, err.message || 'Unable to check watchlist status', status);
  }
};
