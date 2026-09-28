export const successResponse = (res, data, message, statusCode = 200) => {
  const payload = { success: true };
  if (message) {
    payload.message = message;
  }
  if (data !== undefined && data !== null) {
    payload.data = data;
  }
  return res.status(statusCode).json(payload);
};

export const errorResponse = (res, message = 'Internal Server Error', statusCode = 500) => {
  const errorMessage = typeof message === 'string' ? message : message.message || 'An error occurred';
  return res.status(statusCode).json({
    success: false,
    message: errorMessage
  });
};
