import express from 'express';
import { getGenres, getGenreById, createGenre, deleteGenre } from '../controllers/genreController.js';

const router = express.Router();

router.get('/', getGenres);
router.get('/:id', getGenreById);
router.post('/', createGenre);
router.delete('/:id', deleteGenre);

export default router;
