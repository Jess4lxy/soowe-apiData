import app from './app';
import connectMongo from './config/mongo';
import { AppDataSource } from './config/data-source'; // PostgreSQL

const PORT = process.env.PORT || 3015;

(async () => {
    try {
        // MongoDB connection
        try {
            await connectMongo();
            console.log('MongoDB connected successfully.');
        } catch (mongoError) {
            console.error('Error connecting to MongoDB:', mongoError);
            throw mongoError;
        }

        // PostgreSQL connection
        try {
            await AppDataSource.initialize();
            console.log('TypeORM initialized successfully.');
        } catch (postgresError) {
            console.error('Error connecting to PostgreSQL:', postgresError);
            throw postgresError;
        }

        // Start server only if both connections are successful
        console.log('Database connections verified.');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1);
    }
})();
