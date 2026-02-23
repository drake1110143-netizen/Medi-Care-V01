import { Router } from 'express';
import { login, logout } from '../controllers/authController.js';
import { sessionAuth } from '../../../middleware/auth.js';

const router = Router();
router.post('/login', login);
router.post('/logout', sessionAuth, logout);

export default router;
