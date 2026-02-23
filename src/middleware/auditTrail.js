import { AuditLog } from '../models/AuditLog.js';

function actionForMethod(method) {
  if (method === 'GET') return 'read';
  if (['POST', 'PUT', 'PATCH'].includes(method)) return 'write';
  if (method === 'DELETE') return 'delete';
  return 'other';
}

export function auditTrail(req, res, next) {
  const started = Date.now();
  res.on('finish', async () => {
    if (!req.path.startsWith('/api/v1')) return;
    await AuditLog.create({
      actorId: req.user?._id,
      actorRole: req.user?.role,
      action: actionForMethod(req.method),
      resourceType: req.baseUrl || 'unknown',
      resourceId: req.params.id,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      requestId: req.requestId,
      details: { durationMs: Date.now() - started }
    }).catch(() => {});
  });
  next();
}
