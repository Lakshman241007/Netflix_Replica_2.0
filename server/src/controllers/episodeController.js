import Episode from '../models/Episode.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getEpisodes = async (req, res) => {
  const { showId, season } = req.query;
  try {
    let episodes = await Episode.find();

    if (showId) {
      episodes = episodes.filter(ep => String(ep.showId) === String(showId));
    }
    if (season) {
      episodes = episodes.filter(ep => Number(ep.season) === Number(season));
    }

    return successResponse(res, episodes, 'Episodes retrieved successfully');
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const getEpisodeById = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      return errorResponse(res, 'Episode not found', 404);
    }
    return successResponse(res, episode, 'Episode retrieved successfully');
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const createEpisode = async (req, res) => {
  try {
    const episode = await Episode.create(req.body);
    return successResponse(res, episode, 'Episode created successfully', 201);
  } catch (err) {
    return errorResponse(res, err, 400);
  }
};

export const updateEpisode = async (req, res) => {
  try {
    const episode = await Episode.findByIdAndUpdate(req.params.id, req.body);
    if (!episode) {
      return errorResponse(res, 'Episode not found', 404);
    }
    return successResponse(res, episode, 'Episode updated successfully');
  } catch (err) {
    return errorResponse(res, err, 400);
  }
};

export const deleteEpisode = async (req, res) => {
  try {
    const result = await Episode.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return errorResponse(res, 'Episode not found', 404);
    }
    return successResponse(res, null, 'Episode deleted successfully');
  } catch (err) {
    return errorResponse(res, err);
  }
};
