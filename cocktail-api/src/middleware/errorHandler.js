const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err);

  // Default error response
  let status = 500;
  let message = 'Internal server error';
  let details = null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
    details = err.message;
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid data format';
    details = err.message;
  } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    status = 503;
    message = 'External service unavailable';
    details = 'Unable to connect to cocktail database';
  } else if (err.response && err.response.status) {
    // Axios errors
    status = err.response.status;
    message = err.response.statusText || message;
    details = err.response.data || null;
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && status === 500) {
    details = null;
  }

  res.status(status).json({
    error: message,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
    path: req.path
  });
};

module.exports = errorHandler;