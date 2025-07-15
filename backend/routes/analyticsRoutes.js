import express from 'express';
import { getInvestorStartups, getStartupAnalytics } from '../controllers/analyticsController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/investor-startups', auth, getInvestorStartups);
router.get('/startup/:id', auth, getStartupAnalytics);

export default router;
