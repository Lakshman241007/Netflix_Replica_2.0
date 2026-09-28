import * as genreService from '../services/genreService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getGenres = async (req, res) => {
  try {
    const genres = await genreService.getAllGenres();
    return successResponse(res, genres);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const getGenreById = async (req, res) => {
  try {
    const genre = await genreService.getGenreById(req.params.id);
    if (!genre) {
      return errorResponse(res, 'Genre not found', 404);
    }
    return successResponse(res, genre);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const createGenre = async (req, res) => {
  try {
    const genre = await genreService.createGenre(req.body);
    return successResponse(res, genre, 'Genre created successfully', 201);
  } catch (err) {
    return errorResponse(res, err, 400);
  }
};

export const deleteGenre = async (req, res) => {
  try {
    const result = await genreService.deleteGenre(req.params.id);
    if (!result || result.deletedCount === 0) {
      return errorResponse(res, 'Genre not found', 404);
    }
    return successResponse(res, null, 'Genre deleted successfully');
  } catch (err) {
    return errorResponse(res, err);
  }
};
