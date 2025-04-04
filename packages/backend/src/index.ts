// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import collectionsRouter from './routes/collections.route';
import tasksRouter from './routes/tasks.route';

dotenv.config();

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/collections', collectionsRouter);
  app.use('/api/tasks', tasksRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.send('Server is healthy');
  });

  return app;
}

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const app = createApp();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
