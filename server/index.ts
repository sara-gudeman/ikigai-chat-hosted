// server.js
import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { fetchAccessToken } from 'hume';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://storage.googleapis.com; " +
      "connect-src 'self' wss://api.hume.ai https://api.hume.ai; " +
      "worker-src 'self' blob:;",
  );
  next();
});

// Get current directory for ES modules

const isDevelopment = process.env.NODE_ENV !== 'production';

const publicPath = isDevelopment
  ? resolve(__dirname, '../client/dist')
  : resolve(__dirname, '../../client/dist');

app.use(express.static(publicPath));

app.get('/api/token', async (req, res) => {
  const HUME_API_KEY = process.env.HUME_API_KEY || '';
  const HUME_SECRET_KEY = process.env.HUME_SECRET_KEY || '';
  const accessToken = await fetchAccessToken({
    apiKey: HUME_API_KEY,
    secretKey: HUME_SECRET_KEY,
  });
  res.send({ accessToken });
});

// Serve React app static files
app.use(express.static(publicPath));

// // Catch-all handler: send back React's index.html file for any non-API routes
app.get('/', (req, res) => {
  res.sendFile(join(publicPath, '/index.html'));
});

// Create HTTP server from Express app
const server = createServer(app);

// Start server on single port
const PORT = Number(process.env.PORT) || 3001;
const HOST = '0.0.0.0'; // Important for Render!

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
