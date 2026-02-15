import express from 'express';
import {getDashBoard,} from '../controllers/progressController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard',getDashBoard);

export default router;