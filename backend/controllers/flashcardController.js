import FlashCard from '../models/Flashcard.js';


//get all flashcards for a document , GET /api/flashcards/:documentId
export const getFlashcards = async (req,res,next) => {
     try{
        const flashcards = await FlashCard.find({
            userId: req.user._id,
            documentId: req.params.documentId
        })
        .populate('documentId','title fileName')
        .sort({createdAt: -1});

        res.status(200).json({
            success: true,
            count: flashcards.length,
            data: flashcards
        });
     }catch(error){
        next(error);
     }
};


//get all flashcards sets for a user GET /api/flashcards

export const getAllFlashcardSets = async (req,res,next) => {
      try{
        const flashcardSets = await FlashCard.find({userId: req.user._id})
        .populate('documentId','title')
        .sort({createdAt: -1});

        res.status(200).json({
            success: true,
            count: flashcardSets.length,
            data: flashcardSets,
        });
      }catch(error){
         next(error);
      }
};

//mark flashcard as reviewed PUT /api/flashcards/:cardId/review
export const reviewFlashcard = async (req,res,next) =>{
    try{
        const flashcardSet = await FlashCard.findOne({
            'cards._id':req.params.cardId,
            userId: req.user._id
        });
        
        if(!flashcardSet){
            return res.status(404).json({
                success: false,
                error: 'flashcard set or card not found',
                statusCode: 404
            });
        }
           
        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

        if(cardIndex === -1){
            return res.status(404).json({
                success: false,
                error: 'card not found in set',
                statusCode: 404
            });
        }

        //update review info
        flashcardSet.cards[cardIndex].lastReviewed = new Date();
        flashcardSet.cards[cardIndex].reviewCount += 1;

        await flashcardSet.save();

        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: 'flashcard reviewed successfully'
        });
    }catch(error){
        next(error);
    }
};

//toggle star on flashcard PUT /api/flashcards/:cardId/star
export const toggleStarFlashcard = async (req,res,next) => {
      try{

        const flashcardSet = await FlashCard.findOne({
            'cards._id': req.params.cardId,
            userId: req.user._id
        });

        if(!flashcardSet){
            return res.status(404).json({
                success: false,
                error: 'flashcard set or card not found',
                statusCode: 404
            });
        }

        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

        if(cardIndex === -1){
            return res.status(404).json({
                success: false,
                error: 'card not found in set',
                statusCode: 404
            });
        }
         
        //toggle star
        flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred;

        await flashcardSet.save();

        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: `Flashcard ${flashcardSet.cards[cardIndex].isStarred ? 'starred' : 'unstarred'} successfully`
        });
      }catch(error){
        next(error);
      }
};

//delete flashcard set DELETE /api/flashcards/:id
export const deleteFlashcardSet = async (req,res,next) => {
     try{
        const flashcardSet = await FlashCard.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!flashcardSet){
            return res.status(404).json({
                success: false,
                error: 'flashcard set not found',
                statusCode: 404
            });
        }

        await flashcardSet.deleteOne();

        res.status(200).json({
            success: true,
            message: 'flashcard set deleted successfully'
        });
     }catch(error){
         next(error);
     }
};
