import { Router } from 'express';
import { sessionAuth, requireRoles } from '../../../middleware/auth.js';
import { smartBook } from '../controllers/appointmentController.js';

const router = Router();
router.post('/smart-book', sessionAuth, requireRoles('management', 'doctor'), smartBook);

export default router;
