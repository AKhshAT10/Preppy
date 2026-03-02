import express from 'express';
import {
    getQuizzes,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz
} from '../controllers/quizController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// all routes protected
router.use(protect);

// IMPORTANT: specific routes first
router.get('/quiz/:id', getQuizById);
router.post('/:id/submit', submitQuiz);
router.get('/:id/results', getQuizResults);
router.delete('/:id', deleteQuiz);

// generic route LAST
router.get('/:documentId', getQuizzes);

export default router;