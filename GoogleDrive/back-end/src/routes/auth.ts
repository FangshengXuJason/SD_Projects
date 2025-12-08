import express from 'express';
import { register, login, getMe, exchangeToken } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/exchange-token', exchangeToken); // Exchange NextAuth token for backend JWT
router.get('/me', protect, getMe);

export default router;