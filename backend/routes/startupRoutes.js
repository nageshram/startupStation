import express from 'express';
import {
  createStartup,
  getStartup,
  updateStartup,
  deleteStartup,
  addInvestor,
  addRole,
  getAllStartups,
  removeInvestor,
  removeRole,
  unAssignRole
} from '../controllers/startupController.js';

import auth  from '../middlewares/auth.js';

const router = express.Router();

router.post('/create', auth, createStartup);
router.get('/:id', auth, getStartup);
router.get('/', getAllStartups);
router.put('/:id',auth, updateStartup);
router.delete('/:id', deleteStartup);
router.post('/add-investor',auth, addInvestor);
router.post('/add-role', auth, addRole);
router.post('/remove-role', auth, removeRole);
router.post('/remove-investor', auth, removeInvestor);
router.post('/unassign-role', auth, unAssignRole);

export default router;
