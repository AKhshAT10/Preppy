import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js';
import {findRelevantChunks, relevantChunks} from '../utils/textChunker.js';


//generate flashcards from document , POST /api/ai/generate-flashcards , private
export const generateFlashcards = async (req,res,next) => {
    try{
        const {documentId,count = 10} = req.body;

        if(!documentId){
            return res.status(400).jso({
                success: false,
                error: 'please provide documentId',
                statusCode: 400
            });
        }
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if(!document){
            return res.status(404).json({
                success: false,
                error: 'document not found or not ready',
                statusCode: 404
            });
        }

        //generate flashcards using Gemini
        const cards = await gemeiniService.generateFlashcards(
            document.extractedText,
            parseInt(count)
        );

        //save to database
        const flashcardSet = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                isStarred: false
            }))
        });

        res.status(201).json({
            success: true,
            data: flashcardSet,
            message: 'flashcards genrated successfully'
        });

    }catch(error){
        next(error);
    }
};

//generate quiz from document , POST /api/ai/generate-quiz , private
export const generateQuiz = async (req,res,next) => {
     try{
        const {documentId, numQuestions = 5, title} = req.body;

        if(!documentId){
            return res.status(400).json({
                success: false,
                error: 'please provide documentId',
                statusCode: 400
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            statusCode: 404
        });

        if(!document){
            return res.status(404).json({
                success: false,
                error: 'document not found or not ready',
                statusCode: 404
            });
        }

        //generate quiz using Gemini
        const questions = await gemeiniService.generateQuiz(
            document.extractedText,
            parseInt(numQuestions)
        );

        //save to database
        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title} - Quiz`,
            questions: questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0
        });

        res.status(201).json({
            success: true,
            data: quiz,
            message: 'Quiz generated successfully'
        });

     }catch(error){
        next(error);
     }
}; 

//generate document summary , POST /api/ai/generate-summary
export const generateSummary = async (req,res,next) => {
    try{
       const {documentId} = req.body;

       if(!documentId){
         return res.status(400).json({
            success: false,
            error: 'please provide documentId',
            statusCode: 400
         });
       }

       const document = await Document.findOne({
        _id: documentId,
        userId: req.user._id,
        status: 'ready'
       });

       if(!document){
        return res.status(404).json({
            success: false,
            error: 'document not found or not ready',
            statusCode: 404
        });
       }

       //generate summary using Gemini
       const summary = await gemeiniService.generateSummary(document.extractedText);

       res.status(200).json({
        success: true,
        data: {
            documentId: document._id,
            title: document.title,
            summary
        },
        message: 'summary generated successfully'
       });
    }catch(error){
        next(error);
    }
};

//chat with document , POST /api/ai/chat , private
export const chat = async (req,res,next) => {
    try{
       const {documentId,question} = req.body;

   if(!documentId || !question){
    return res.status(400).json({
        success: false,
        error: 'please provide documentId and question',
        statusCode: 400
    });
   }

   const document = await Document.findOne({
    _id: documentId,
    userId: req.user._id,
    status: 'ready'
   });

   if(!document){
     return res.status(404).json({
        success: false,
        error: 'document not found or not ready',
        statusCode: 404
     });
   }

   //find relevant chunks
   const findRelevantChunks = findRelevantChunks(document.chunks,question,3);
   const chunkIndices = relevantChunks(c => c.chunkIndex);

   //get or create chat history
   let chatHistory = await ChatHistory.findOne({
     userId: req.user._id,
     documentId: document._id
   });

   if(!chatHistory){
    chatHistory = await ChatHistory.create({
        userId: req.user._id,
        documentId: document._id,
        messages: []
    });
}

    //generate responses using Gemini
    const answer = await geminiService.chatWithContext(question,relevantChunks);

    //save conversations
    chatHistory.messages.push(
        {
         role: 'user',
         content: question,
         timestamp: new Date(),
         relevantChunks: []
        },
        {
         role: 'assistant',
         content: answer,
         timestamp: new Date(),
         relevantChunks: chunkIndices
        }
    );
    
    await chatHistory.save();

    res.status(200).json({
        success: true,
        data: {
            question,
            answer,
            relevantChunks: chunkIndices,
            chatHistoryId: chatHistory._id
        },
        message: 'response generated successfully'
    });
    }catch(error){
      next(error);
    }
};

//explain concept from document , POST /api/ai/explain-concept , private
export const explainConcept = async (req,res,next) => {
    try{
      const {documentId,concept} = req.body;

      if(documentId || !concept){
        return res.status(400).json({
            success: false,
            error: 'please provide documentId and concept',
            statusCode: 400
        });
      }

      const document = await Document.findOne({
        _id: documentId,
        userId: req.user._id,
        status: 'ready'
      });

      if(!document){
        return res.status(404).json({
            success: false,
            error: 'document not found or not ready',
            statusCode: 404
        });
      }

      //find relevant chunks for the concept
      const relevantChunks = findRelevantChunks(document.chunks,concept,3);
      const context = relevantChunks.map(c => c.content).join('\n\n');

      //generate explanation using gemini
      const explanation = await geminiService.explainConcept(concept,context);

      res.status(200).json({
        success: true,
        data: {
            concept,
            explanation,
            relevantChunks: relevantChunks.map(c => c.chunkIndex)
        },
        message: 'explanation generated successfully'
      });
    }catch(error){
       next(error);
    }
};

//get chat history for a document , GET /api/ai/chat-history/:documentId , private
export const getChatHistory = async (req,res,next) => {
   try{
      const {documentId} = req.params;

      if(!documentId){
        return res.status(400).json({
            success: false,
            error: 'please provide documentId',
            statusCode: 400
        });
      }

      const chatHistory = await ChatHistory.findOne({
        userId: req.user._id,
        documentId: documentId
      }).select('messages'); //only retrieve the messages array

      if(!chatHistory){
        return res.status(200).json({
            success: true,
            data: [],
            message: 'no chat history found for this document'
        });
      }

      res.status(200).json({
         success: true,
         data: chatHistory.messages,
         message: 'chat history retrieved successfully'
      });
   }catch(error){
      next(error);
   }
};

