import express from 'express';
import {
  createStartup,
  getStartup,
  updateStartup,
  deleteStartup,
  addInvestor,
  addRole
} from '../controllers/startupController.js';

const router = express.Router();

router.post('/create', createStartup);
router.get('/:id', getStartup);
router.put('/:id', updateStartup);
router.delete('/:id', deleteStartup);

router.post('/add-investor', addInvestor);
router.post('/add-role', addRole);

export default router;
