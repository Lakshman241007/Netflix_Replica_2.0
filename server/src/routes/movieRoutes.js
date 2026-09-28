import express from 'express';
import {
  getMovies,
  getMovieById,
  getFeaturedMovies,
  getPopularMovies,
  getTrendingMovies,
  getMoviesByGenre,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movieController.js';

const router = express.Router();

// Specific routes first
router.get('/featured', getFeaturedMovies);
router.get('/popular', getPopularMovies);
router.get('/trending', getTrendingMovies);
router.get('/genre/:genre', getMoviesByGenre);

// General & ID-based routes
router.get('/', getMovies);
router.get('/:id', getMovieById);

// Creation and modification routes
router.post('/', createMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

export default router;
