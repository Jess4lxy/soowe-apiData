import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRouter from './routes';
import authRouter from './routes/auth.routes';
import { authMiddleware } from './middlewares/authMiddleware';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Auth & public routes
app.use('/auth', authRouter);

// API Routes
app.use('/api', authMiddleware, apiRouter);

// Default Route
app.get('/', (req: Request, res: Response) => {
    res.send('Soowie API is running!');
});

// Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;
