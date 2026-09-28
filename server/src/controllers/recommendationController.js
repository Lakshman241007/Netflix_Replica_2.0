import { getPersonalizedRecommendations } from '../services/recommendationService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const resolveProfileId = (req) => {
  return (
    req.headers['x-profile-id'] ||
    req.query.profileId ||
    (req.body && req.body.profileId) ||
    null
  );
};

export const getRecommendations = async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const profileId = resolveProfileId(req);

  if (!profileId) {
    return errorResponse(res, 'Profile ID is required', 400);
  }

  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const recommendations = await getPersonalizedRecommendations(userId, profileId, { limit });
    return res.status(200).json({
      success: true,
      data: recommendations,
      message: 'Recommendations retrieved successfully'
    });
  } catch (err) {
    const status = err.status || 500;
    return errorResponse(res, err.message || 'Unable to retrieve recommendations', status);
  }
};
