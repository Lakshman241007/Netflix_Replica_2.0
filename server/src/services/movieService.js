import Movie from '../models/Movie.js';

export const getAllMovies = async (query = {}) => {
  const { page, limit, genre, search } = query;
  let movies = await Movie.find();

  if (genre) {
    const genreLower = genre.toLowerCase();
    movies = movies.filter(m =>
      m.genres && m.genres.some(g => g.toLowerCase() === genreLower)
    );
  }

  if (search) {
    const q = search.toLowerCase();
    movies = movies.filter(m =>
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.description && m.description.toLowerCase().includes(q))
    );
  }

  // Basic pagination support
  if (page && limit) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    return movies.slice(startIndex, startIndex + limitNum);
  }

  return movies;
};

export const getMovieById = async (id) => {
  return await Movie.findById(id);
};

export const getFeaturedMovies = async () => {
  const all = await Movie.find();
  const featured = all.filter(m => m.featured || m.isFeatured);
  if (featured.length > 0) return featured;
  // Fallback to highest popularity movie
  const sorted = [...all].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  return sorted.slice(0, 1);
};

export const getPopularMovies = async (limit = 10) => {
  const all = await Movie.find();
  const sorted = [...all].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  return sorted.slice(0, limit);
};

export const getTrendingMovies = async (limit = 10) => {
  const all = await Movie.find();
  const sorted = [...all].sort((a, b) => {
    const dateA = new Date(a.releaseDate || a.createdAt || 0);
    const dateB = new Date(b.releaseDate || b.createdAt || 0);
    return dateB - dateA;
  });
  return sorted.slice(0, limit);
};

export const getMoviesByGenre = async (genreParam) => {
  if (!genreParam) return [];
  const genreLower = genreParam.toLowerCase();
  const all = await Movie.find();
  return all.filter(m =>
    m.genres && m.genres.some(g => g.toLowerCase() === genreLower || g.toLowerCase().replace(/[^a-z0-9]/g, '') === genreLower.replace(/[^a-z0-9]/g, ''))
  );
};

export const createMovie = async (movieData) => {
  return await Movie.create(movieData);
};

export const updateMovie = async (id, movieData) => {
  return await Movie.findByIdAndUpdate(id, movieData);
};

export const deleteMovie = async (id) => {
  return await Movie.deleteOne({ _id: id });
};
