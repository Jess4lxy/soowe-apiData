import app from './app';
import connectMongo from './config/mongo';
import { connectPostgres } from './config/postgres';

const PORT = process.env.PORT || 3015;

(async () => {
    try {
    await connectMongo();
    await connectPostgres();
    console.log('Database connection verified.');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
    } catch (error) {
    console.error('Failed to start the server:', error);
    }
})();
