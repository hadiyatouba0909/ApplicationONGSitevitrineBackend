import { Router } from 'express';
import { login, loginValidation } from '../controllers/authController';

const router = Router();

// POST /api/auth/login
router.post('/login', loginValidation, login);

export default router;
