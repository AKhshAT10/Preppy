import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as gemeiniService from '../utils/geminiService.js';
import {findRelevantChunks} from '../utils/textChunker.js';


//generate flashcards from document , POST /api/ai/generate-flashcards , private
export const generateFlashcards = async (req,res,next) => {
    try{
        
    }catch(error){
        next(error);
    }
};

//generate quiz from document , POST /api/ai/generate-quiz , private
export const generateQuiz = async (req,res,next) => {
     try{

     }catch(error){
        next(error);
     }
}; 

//generate document summary , POST /api/ai/generate-summary
export const generateSummary = async (req,res,next) => {

};

//chat with document , POST /api/ai/chat , private
export const chat = async (req,res,next) => {

};

//explain concept from document , POST /api/ai/explain-concept , private
export const explainConcept = async (req,res,next) => {

};

//get chat history for a document , GET /api/ai/chat-history/:documentId , private
export const getChatHistory = async (req,res,next) => {

};