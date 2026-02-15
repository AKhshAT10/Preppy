import express from 'express';

import{
    getQuizzes,getQuizById,submitQuiz,getQuizResults,deleteQuiz
}from '../controllers/quizController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

//all routes are protected
router.use(protect);

router.get('/:documentId',getQuizzes);
router.get('/quiz/:id',getQuizById);
router.get('/:id/submit',submitQuiz);
router.get('/:id/results',getQuizResults);
router.delete('/:id',deleteQuiz);

export default router;