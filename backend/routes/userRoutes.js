import express from 'express'
import { checkUserName, addUser, getAllUsers, updateUser, deleteUser, getSingleUser, createOrUpdateDevProfile } from '../controllers/userController.js';
import auth from "../middlewares/auth.js"

const router = express.Router();

router.get('/check-username', checkUserName);

router.post('/add', addUser);

router.get('/', auth, getAllUsers);

router.get('/:id', auth, getSingleUser);

router.put('/:id', auth , updateUser);

router.delete('/:id', auth, deleteUser);

router.post("/dev/profile", createOrUpdateDevProfile);

export default router;