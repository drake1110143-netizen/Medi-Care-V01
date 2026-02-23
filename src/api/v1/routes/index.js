import { Router } from 'express';
import authRoutes from './authRoutes.js';
import documentRoutes from './documentRoutes.js';
import riskRoutes from './riskRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import { sessionAuth, requireRoles } from '../../../middleware/auth.js';
import { ok } from '../../../utils/response.js';
import { documentQueue } from '../../../jobs/queues.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/risk', riskRoutes);
router.use('/appointments', appointmentRoutes);

router.get('/management/population-insights', sessionAuth, requireRoles('management'), async (_req, res) => {
  return ok(res, {
    cohorts: ['high-risk-chronic', 'adherence-watchlist'],
    outbreakSignals: [],
    doctorUtilizationForecast: { next7dPeak: 'Monday 10:00-13:00' }
  });
});

router.get('/health', async (_req, res) => {
  const queueState = await documentQueue.getJobCounts();
  return ok(res, { status: 'ok', queueState, timestamp: new Date().toISOString() });
});

export default router;
