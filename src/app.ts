import express, { Application, Request, Response, NextFunction } from 'express';
import EnfermeroSQLrouter from './routes/enfermeroSQL.routes';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// JSON parser middleware
app.use(express.json());

// error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// API routes
app.use('/api/enfermeros', EnfermeroSQLrouter);

export default app;