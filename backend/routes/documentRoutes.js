import mongoose from "mongoose";
import express from 'express'

const router = express.Router();
import { deleteDocument, getDocumentsForAdmin, getDocumentsForStartup, getDocumentsForUser }  from '../controllers/documentController.js';
import auth  from '../middlewares/auth.js';

router.get('/user', auth, getDocumentsForUser);
router.get('/startup/:startupId', auth, getDocumentsForStartup);
router.get('/', auth, getDocumentsForAdmin);
router.delete('/:id' , auth, deleteDocument);

export default router;