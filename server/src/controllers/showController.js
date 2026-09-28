import TVShow from '../models/TVShow.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getShows = async (req, res) => {
  const { genre, search } = req.query;
  try {
    let shows = await TVShow.find();

    if (genre) {
      shows = shows.filter(show => 
        show.genres && show.genres.some(g => g.toLowerCase() === genre.toLowerCase())
      );
    }

    if (search) {
      const q = search.toLowerCase();
      shows = shows.filter(show => 
        (show.title && show.title.toLowerCase().includes(q)) || 
        (show.description && show.description.toLowerCase().includes(q))
      );
    }

    return successResponse(res, shows, 'TV Shows retrieved successfully');
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const getShowById = async (req, res) => {
  try {
    const show = await TVShow.findById(req.params.id);
    if (!show) {
      return errorResponse(res, 'TV Show not found', 404);
    }
    return successResponse(res, show, 'TV Show retrieved successfully');
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const createShow = async (req, res) => {
  try {
    const show = await TVShow.create(req.body);
    return successResponse(res, show, 'TV Show created successfully', 201);
  } catch (err) {
    return errorResponse(res, err, 400);
  }
};

export const updateShow = async (req, res) => {
  try {
    const show = await TVShow.findByIdAndUpdate(req.params.id, req.body);
    if (!show) {
      return errorResponse(res, 'TV Show not found', 404);
    }
    return successResponse(res, show, 'TV Show updated successfully');
  } catch (err) {
    return errorResponse(res, err, 400);
  }
};

export const deleteShow = async (req, res) => {
  try {
    const result = await TVShow.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return errorResponse(res, 'TV Show not found', 404);
    }
    return successResponse(res, null, 'TV Show deleted successfully');
  } catch (err) {
    return errorResponse(res, err);
  }
};
