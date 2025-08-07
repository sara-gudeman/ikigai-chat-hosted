// server.js
import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import {fetchAccessToken} from 'hume';

const app = express();

dotenv.config();

// Your regular Express routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/token', async (req, res) => {
  const HUME_API_KEY = process.env.HUME_API_KEY || '';
  const HUME_SECRET_KEY = process.env.HUME_SECRET_KEY || '';
  const accessToken = await fetchAccessToken({
    apiKey: HUME_API_KEY,
    secretKey: HUME_SECRET_KEY,
  });
  console.log('Generated access token:', accessToken);
  res.send({ accessToken });
});

app.get('/api/other-endpoint', (req, res) => {
  res.json({ data: 'something' });
});

// Create HTTP server from Express app
const server = createServer(app);

// Attach WebSocket server to the same HTTP server
const wss = new WebSocketServer({
  server,
  path: '/ws', // Optional: specify WebSocket path
});

// Your Hume proxy logic
wss.on('connection', clientWs => {
  console.log('Client connected to WebSocket');
  const api_key = process.env.HUME_API_KEY || '';
  const config_id = process.env.HUME_CONFIG_ID || '';
  console.log('Using API Key:', api_key);
  console.log('Using Config ID:', config_id);

  const connectToHume = async () => {
    const queryParams = {
      api_key,
      config_id,
    };
    const humeWsUrl = `wss://api.hume.ai/v0/evi/chat?${new URLSearchParams(queryParams)}`;
    console.log('Connecting to Hume WebSocket:', humeWsUrl);
    const humeWs = new WebSocket(humeWsUrl);

    humeWs.onmessage = event => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(event.data);
      }
    };

    clientWs.on('message', data => {
      if (humeWs.readyState === WebSocket.OPEN) {
        humeWs.send(data);
      }
    });
  };

  connectToHume();
});

// Start server on single port
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`HTTP: http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}/ws`);
});

// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import Websocket, { WebSocketServer } from 'ws';

// dotenv.config();

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: 'http://localhost:5173',
//     credentials: true,
//   },
// });

// const PORT = process.env.PORT || 3001;
// const API_KEY = process.env.API_KEY;

// app.use(cors({ origin: 'http://localhost:5173' }));
// app.use(express.json());

// // WebSocket connection with API key validation
// io.on('connection', socket => {
//   console.log('Client attempting to connect');

//   // Require API key authentication
//   socket.on('authenticate', (apiKey: string) => {
//     if (apiKey !== API_KEY) {
//       socket.emit('auth_error', 'Invalid API key');
//       socket.disconnect();
//       return;
//     }

//     console.log('Client authenticated successfully');
//     socket.emit('authenticated');

//     // Handle messages after authentication
//     socket.on('message', (data: string) => {
//       console.log('Received:', data);
//       // Echo the message back
//       socket.emit('message', `Server received: ${data}`);
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// app.get('/', (req, res) => {
//   res.json({ message: 'WebSocket server running' });
// });

// httpServer.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
