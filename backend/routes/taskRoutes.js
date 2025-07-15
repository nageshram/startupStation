import mongoose from "mongoose";
import auth  from '../middlewares/auth.js';
import express from 'express'

const router = express.Router();
import { createTask, updateTask, getTasksForUser, getTasksForStartup, deleteTask } from  '../controllers/taskController.js ';

router.post('/', auth,  createTask);
router.put('/:id', auth,  updateTask);
router.get('/user/:id', auth,  getTasksForUser);
router.get('/startup/:startupId', auth,  getTasksForStartup);
router.delete('/:id', auth, deleteTask);



export default  router;