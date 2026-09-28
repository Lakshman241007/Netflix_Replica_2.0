import { request } from './api.js';

export const searchContent = async (query, { page = 1, limit = 20, genre, type, signal } = {}) => {
  if (!query || !query.trim()) {
    return { data: [], pagination: { page: 1, limit, total: 0, hasNextPage: false } };
  }

  const params = new URLSearchParams();
  params.append('q', query.trim());
  if (page) params.append('page', String(page));
  if (limit) params.append('limit', String(limit));
  if (genre) params.append('genre', genre);
  if (type) params.append('type', type);

  return await request(`/search?${params.toString()}`, { signal });
};

export const searchMovies = searchContent;
export default searchContent;
