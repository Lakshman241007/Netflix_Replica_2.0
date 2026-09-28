import * as movieService from '../services/movieService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getMovies = async (req, res) => {
  try {
    const movies = await movieService.getAllMovies(req.query);
    return successResponse(res, movies);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await movieService.getMovieById(req.params.id);
    if (!movie) {
      return errorResponse(res, 'Movie not found', 404);
    }
    return successResponse(res, movie);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const getFeaturedMovies = async (req, res) => {
  try {
    const featured = await movieService.getFeaturedMovies();
    return successResponse(res, featured);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const getPopularMovies = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const popular = await movieService.getPopularMovies(limit);
    return successResponse(res, popular);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const getTrendingMovies = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const trending = await movieService.getTrendingMovies(limit);
    return successResponse(res, trending);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const getMoviesByGenre = async (req, res) => {
  try {
    const movies = await movieService.getMoviesByGenre(req.params.genre);
    return successResponse(res, movies);
  } catch (err) {
    return errorResponse(res, err);
  }
};

export const createMovie = async (req, res) => {
  try {
    const movie = await movieService.createMovie(req.body);
    return successResponse(res, movie, 'Movie created successfully', 201);
  } catch (err) {
    return errorResponse(res, err, 400);
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movie = await movieService.updateMovie(req.params.id, req.body);
    if (!movie) {
      return errorResponse(res, 'Movie not found', 404);
    }
    return successResponse(res, movie, 'Movie updated successfully');
  } catch (err) {
    return errorResponse(res, err, 400);
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const result = await movieService.deleteMovie(req.params.id);
    if (!result || result.deletedCount === 0) {
      return errorResponse(res, 'Movie not found', 404);
    }
    return successResponse(res, null, 'Movie deleted successfully');
  } catch (err) {
    return errorResponse(res, err);
  }
};
