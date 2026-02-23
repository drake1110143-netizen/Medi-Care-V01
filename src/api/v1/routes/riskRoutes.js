import { Router } from 'express';
import { sessionAuth, requireRoles } from '../../../middleware/auth.js';
import { generateRisk, whatIfSimulation } from '../controllers/riskController.js';

const router = Router();
router.post('/calculate', sessionAuth, requireRoles('management', 'doctor'), generateRisk);
router.post('/simulate', sessionAuth, requireRoles('management', 'doctor'), whatIfSimulation);

export default router;
