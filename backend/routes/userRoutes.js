import express from 'express'
import { checkUserName, addUser, getAllUsers, updateUser, deleteUser, getSingleUser, createOrUpdateDevProfile, checkEmail, getDevProfile, updateUserPatch } from '../controllers/userController.js';
import auth from "../middlewares/auth.js"

const router = express.Router();

router.post('/check-username' , checkUserName);

router.post('/check-email' , checkEmail);

router.post('/add', addUser);

router.get('/all',auth, getAllUsers); 

router.get('/', auth, getSingleUser);

router.put('/', auth, updateUser);

router.patch('/', auth, updateUserPatch);

router.delete('/:id',auth,  deleteUser);

router.post("/dev/profile", auth,  createOrUpdateDevProfile);

router.get("/dev/profile", auth, getDevProfile);

export default router;