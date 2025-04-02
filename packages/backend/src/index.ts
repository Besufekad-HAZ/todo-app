import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import collectionsRouter from './routes/collections.route';
import tasksRouter from './routes/tasks.route';
import { setupWebSocket } from './utils/websocket';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/collections', collectionsRouter);
app.use('/api/tasks', tasksRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.send('Server is healthy');
});

// Start the server and capture the http.Server instance
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Setup WebSocket and attach broadcast to app.locals
const { broadcast } = setupWebSocket(server);
app.locals.broadcast = broadcast;
