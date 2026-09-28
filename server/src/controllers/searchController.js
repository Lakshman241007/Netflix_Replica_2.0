import { searchCatalog } from '../services/searchService.js';
import { errorResponse } from '../utils/apiResponse.js';

export const handleSearch = async (req, res) => {
  const { q, query, page, limit, genre, type } = req.query;
  const searchQuery = q || query;

  if (!searchQuery || !searchQuery.trim()) {
    return errorResponse(res, 'Search query is required', 400);
  }

  try {
    const result = await searchCatalog({
      query: searchQuery,
      page,
      limit,
      genre,
      type
    });

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (err) {
    const isValidation = err.message && err.message.includes('required');
    return errorResponse(res, err.message || 'Search failed', isValidation ? 400 : 500);
  }
};

export default handleSearch;
