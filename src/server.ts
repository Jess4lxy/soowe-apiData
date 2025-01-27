import app from './app';
import connectMongo from './config/mongo';
import { AppDataSource } from './config/data-source'; // PostgreSQL

const PORT = process.env.PORT || 3015;

(async () => {
    try {
        await connectMongo(); // Connect to MongoDB
        await AppDataSource.initialize(); // Connect to PostgreSQL

        console.log('TypeORM initialized successfully.');

        console.log('Database connections verified.');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
    }
})();
