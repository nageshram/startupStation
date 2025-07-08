import express from 'express';
import auth  from '../middlewares/auth.js';
import { signup, login, refreshToken, logout, sendOtp, resetPasswordWithOtp, loginStatus } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', auth, logout);
router.post('/send-otp', sendOtp);
router.post('/reset-password-otp', resetPasswordWithOtp);
router.get('/login-status', auth, loginStatus);

export default router;
