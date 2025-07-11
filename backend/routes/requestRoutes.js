import mongoose from "mongoose";
import express from 'express'

import auth  from '../middlewares/auth.js';
const router = express.Router();
import { sendJobRequest,  sendInvestRequest,resignFromStartup ,acceptRequest,confirmInvestProposal, confirmJobProposal, getMyRequests, founderRequest, createResignReq, deleteRequest, rejectRequest } from '../controllers/requestController.js';


router.get('/', auth, getMyRequests);
router.post('/job', auth,  sendJobRequest);//lreave this route
router.post('/invest', auth,  sendInvestRequest);// leave this route
router.put('/:id/accept', auth,  acceptRequest);
router.put('/:id/confirm/job-proposal', auth,  confirmJobProposal);
router.put('/:id/confirm/invest-proposal', auth,  confirmInvestProposal);
router.put('/accept/resign/:id', auth,  resignFromStartup);// for founder to accept resign req
router.post('/founder-req', auth, founderRequest)// leave this one as wellrouter
router.post('/resign', auth, createResignReq);// needed founderId, startupId, targetRoleId
router.delete('/:id', auth, deleteRequest);// needed reqId
router.put('/reject/:id', auth, rejectRequest);// needed reqId

export default router;