import express from 'express';
const router = express.Router();
import {getUserNotifications, markAsSeen, clearAllNotifications } from '../controllers/notificationController.js';
import auth from '../middlewares/auth.js';

router.get('/', auth, getUserNotifications);
router.put('/seen', auth, markAsSeen);
router.delete('/clear', auth, clearAllNotifications);

export default router;