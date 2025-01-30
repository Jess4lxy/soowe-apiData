import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import adminRouter from './routes/admin.routes';
import movilRouter from './routes/mobile.routes';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api/admin', adminRouter);
app.use('/api/movil', movilRouter);

// Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Default Route
app.get('/', (req: Request, res: Response) => {
    res.send('Soowie API is running!');
});

export default app;
