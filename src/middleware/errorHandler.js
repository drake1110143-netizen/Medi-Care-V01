import { logger } from '../config/logger.js';

export function notFound(_req, res) {
  return res.status(404).json({ success: false, error: 'Not found' });
}

export function errorHandler(err, req, res, _next) {
  logger.error('Unhandled error', { requestId: req.requestId, err });
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
    requestId: req.requestId
  });
}
