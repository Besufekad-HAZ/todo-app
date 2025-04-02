import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface WebSocketMessage {
  type: 'statsUpdate' | 'taskUpdate';
  data: any;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  // Function to broadcast updates to all connected clients
  function broadcast(message: WebSocketMessage) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // Return the broadcast function for use in other parts of the app
  return { broadcast };
}

// export default setupWebSocket;
