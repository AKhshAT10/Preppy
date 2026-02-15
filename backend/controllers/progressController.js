import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';

// get user learning statistics , GET /api/progress/dashboard , Private
export const getDashboard = async (req,res,next) => {
    try{
       const userId = req.user._id;

       //get counts
       const totalDocuments = await Document.countDocuments({userId});
       const totalFlashcardSets = await Flashcard.countDocuments({userId});
       const totalQuizzes = await Quiz.countDocuments({userId});
       const completedQuizzes = await Quiz.countDocuments({userId,completedAt: {$ne: null}});

       //get flashcard statistics
       const flashcardSets = await Flashcard.find({userId});
       let totalFlashcards = 0;
       let reviewedFlashcards = 0;
       let starredFlashcards = 0;

       flashcardSets.forEach(set=>{
        totalFlashcards += set.cards.length;
        reviewedFlashcards += set.cards.filter(c=>c.reviewCount>0).length;
        starredFlashcards += set.cards.filter(c=>c.isStarred).length;
       });

       //get quiz statistics
       const quizzes = await Quiz.find({userId,compltedAt: {$ne: null}});
       const averageScore = quizzes.length>0
       ? Math.round(quizzes.reduce((sum,q)=>sum + q.score,0)/quizzes.length)
       : 0;

       //recent activity
       const recentDocuments = await Document.find({userId})
       .sort({lastAccessed: -1})
       .limit(5)
       .select('title filName lastAccessed status');

       const recentQuizzes = await Quiz.find({userId})
       .sort({createdAt: -1})
       .limit(5)
       .populate('documentId','title')
       .select('title score totalQuestions completedAt');


       //study streak (simplified - in production , track daily activity)
       const studyStreak = Math.floor(Math.random()*7)+1;

       res.status(200).json({
        success: true,
        data: {
            overview: {
                totalDocuments,
                totalFlashcardSets,
                totalFlashcards,
                reviewedFlashcards,
                starredFlashcards,
                totalQuizzes,
                completedQuizzes,
                averageScore,
                studyStreak
            },
            recentActivity: {
                documents: recentDocuments,
                quizzes: recentQuizzes
            }
        }
       });
    }catch(error){
        next(error);
    }
};