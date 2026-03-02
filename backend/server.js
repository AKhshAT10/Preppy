import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../backend/config/db.js';
import errorHandler from '../backend/middleware/errorHandler.js';

import authRoutes from '../backend/routes/authRoutes.js';
import documentRoutes from '../backend/routes/documentRoutes.js';
import flashcardRoutes from '../backend/routes/flashcardRoutes.js';
import aiRoutes from '../backend/routes/aiRoutes.js';
import quizRoutes from '../backend/routes/quizRoutes.js';
import progressRoutes from '../backend/routes/progressRoutes.js';

//es6 module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//initiliaze express app
const app = express();

//conect to mongodb
connectDB();

//middleware to handle cors
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//static folder for uploads
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

//routes
app.use('/api/auth',authRoutes);
app.use('/api/documents',documentRoutes);
app.use('/api/flashcards',flashcardRoutes);
app.use('/api/aiRoutes',aiRoutes);
app.use('/api/quizzes',quizRoutes);
app.use('/api/progress',progressRoutes);


app.use(errorHandler);


//404 handler
app.use((req,res)=>{
    res.status(404).json({
        success: false,
        error: 'Route not found',
        statusCode: 404
    });
});

//start server
const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} node on port ${PORT}`);
});

process.on('unhandledRejection',(err)=>{
    console.error(`Error: ${err.message}`);
    process.exit(1);
}); 


//basically routes hot jo routes hai 
//controller meaning jo routes jo kaam krenege wo 
//middleware honge like agar koi protect route bna na ho toh uska function
//models basically models jisme data dalega and store hoga inside the database
