import mongoose from "mongoose";
import express from 'express'

const router = express.Router();
import { getDocumentsForStartup, getDocumentsForUser }  from '../controllers/documentController.js';
import auth  from '../middlewares/auth.js';

router.get('/user', auth, getDocumentsForUser);
router.get('/startup/:startupId', auth, getDocumentsForStartup);

export default router;