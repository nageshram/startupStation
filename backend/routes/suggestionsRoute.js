import express from 'express';
import { suggestForFounder, suggestForDev, suggestForInvestor } from '../controllers/suggestionsController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/Founder', auth, suggestForFounder);
router.get('/Dev', auth, suggestForDev);
router.get('/Investor', auth, suggestForInvestor);

export default router;