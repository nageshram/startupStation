import mongoose from "mongoose";
import auth  from '../middlewares/auth.js';
import express from 'express'

const router = express.Router();
import { createTask, updateTask, getTasksForUser, getTasksForStartup } from  '../controllers/taskController.js ';

router.post('/', auth,  createTask);
router.put('/:id', auth,  updateTask);
router.get('/user', auth,  getTasksForUser);
router.get('/startup/:startupId', auth,  getTasksForStartup);

export default  router;