import { Router } from 'express';
import { sessionAuth, requireRoles, enforceOwnership } from '../../../middleware/auth.js';
import { streamDocument, uploadDocument, uploadMiddleware } from '../controllers/documentController.js';

const router = Router();

router.post('/', sessionAuth, requireRoles('management', 'doctor', 'patient'), enforceOwnership('patientId'), uploadMiddleware, uploadDocument);
router.get('/:id/stream', sessionAuth, requireRoles('management', 'doctor', 'patient'), streamDocument);

export default router;
