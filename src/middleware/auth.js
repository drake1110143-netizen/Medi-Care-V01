import { User } from '../models/User.js';

export async function sessionAuth(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  const user = await User.findById(req.session.userId).lean();
  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ success: false, error: 'Invalid session' });
  }
  req.user = user;
  return next();
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    return next();
  };
}

export function enforceOwnership(paramKey = 'patientId') {
  return (req, res, next) => {
    if (req.user.role === 'management') return next();
    const target = req.params[paramKey] || req.body[paramKey] || req.query[paramKey];
    if (!target) return res.status(400).json({ success: false, error: `${paramKey} is required` });
    const ownerId = req.user.role === 'patient' ? req.user._id.toString() : undefined;
    if (ownerId && ownerId !== target) {
      return res.status(403).json({ success: false, error: 'Ownership validation failed' });
    }
    return next();
  };
}
