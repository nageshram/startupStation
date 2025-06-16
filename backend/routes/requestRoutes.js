import mongoose from "mongoose";
import express from 'express'

import auth  from '../middlewares/auth.js';
const router = express.Router();
import { sendJobRequest, sendInvestRequest,resignFromStartup ,acceptRequest,confirmInvestProposal, confirmJobProposal, getMyRequests } from '../controllers/requestController.js';


router.get('/', auth, getMyRequests);
router.post('/job', auth,  sendJobRequest);
router.post('/invest', auth,  sendInvestRequest);
router.put('/:id/accept', auth,  acceptRequest);
router.put('/:id/confirm/job-proposal', auth,  confirmJobProposal);
router.put('/:id/confirm/invest-proposal', auth,  confirmInvestProposal);
router.put('/:startupId/resign/:roleId', auth,  resignFromStartup);


export default router;