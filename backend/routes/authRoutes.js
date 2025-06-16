import express from 'express';
import { signup, login, refreshToken, logout, sendOtp, resetPasswordWithOtp  } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/send-otp', sendOtp);
router.post('/reset-password-otp', resetPasswordWithOtp);

export default router;
