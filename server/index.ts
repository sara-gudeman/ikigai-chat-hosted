// server.js
import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { fetchAccessToken } from 'hume';

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
