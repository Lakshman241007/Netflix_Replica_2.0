import Genre from '../models/Genre.js';

export const getAllGenres = async () => {
  return await Genre.find();
};

export const getGenreById = async (id) => {
  // Support searching by MongoDB ID or slug
  const genre = await Genre.findById(id);
  if (genre) return genre;
  return await Genre.findOne({ slug: id.toLowerCase() });
};

export const createGenre = async (data) => {
  return await Genre.create(data);
};

export const deleteGenre = async (id) => {
  return await Genre.deleteOne({ _id: id });
};
