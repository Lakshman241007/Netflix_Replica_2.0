import { request } from './api.js';

export const getMovies = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.genre) query.append('genre', params.genre);
  if (params.search) query.append('search', params.search);
  
  const queryString = query.toString();
  return await request(`/movies${queryString ? `?${queryString}` : ''}`);
};

export const getMovieById = async (id) => {
  return await request(`/movies/${id}`);
};

export const getFeaturedMovies = async () => {
  return await request('/movies/featured');
};

export const getPopularMovies = async (limit = 10) => {
  return await request(`/movies/popular?limit=${limit}`);
};

export const getTrendingMovies = async (limit = 10) => {
  return await request(`/movies/trending?limit=${limit}`);
};

export const getMoviesByGenre = async (genre) => {
  return await request(`/movies/genre/${encodeURIComponent(genre)}`);
};

export const getGenres = async () => {
  return await request('/genres');
};

export const getGenreById = async (id) => {
  return await request(`/genres/${id}`);
};

// TV Show endpoints support
export const getShows = async (genre = '') => {
  return await request(`/shows?genre=${genre}`);
};

export const getShowById = async (id) => {
  return await request(`/shows/${id}`);
};

export const getEpisodes = async (showId) => {
  return await request(`/episodes?showId=${showId}`);
};

// Planned administrative actions (preserved for future phases)
export const createMovie = async (movieData) => {
  return await request('/movies', {
    method: 'POST',
    body: movieData
  });
};

export const updateMovie = async (id, movieData) => {
  return await request(`/movies/${id}`, {
    method: 'PUT',
    body: movieData
  });
};

export const deleteMovie = async (id) => {
  return await request(`/movies/${id}`, {
    method: 'DELETE'
  });
};

export const createShow = async (showData) => {
  return await request('/shows', {
    method: 'POST',
    body: showData
  });
};

export const updateShow = async (id, showData) => {
  return await request(`/shows/${id}`, {
    method: 'PUT',
    body: showData
  });
};

export const deleteShow = async (id) => {
  return await request(`/shows/${id}`, {
    method: 'DELETE'
  });
};

export const createEpisode = async (episodeData) => {
  return await request('/episodes', {
    method: 'POST',
    body: episodeData
  });
};
