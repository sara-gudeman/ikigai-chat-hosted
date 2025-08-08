// server.js
import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { fetchAccessToken } from 'hume';

dotenv.config();
const app = express();

app.get('/api/token', async (req, res) => {
  const HUME_API_KEY = process.env.HUME_API_KEY || '';
  const HUME_SECRET_KEY = process.env.HUME_SECRET_KEY || '';
  const accessToken = await fetchAccessToken({
    apiKey: HUME_API_KEY,
    secretKey: HUME_SECRET_KEY,
  });
  res.send({ accessToken });
});

// Create HTTP server from Express app
const server = createServer(app);

// Start server on single port
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`HTTP: http://localhost:${PORT}`);
});
