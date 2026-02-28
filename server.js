// Сервер для запуска API на Render.com
import express from 'express';
import cors from 'cors';
import sendEmailRouter from './api/send-email.js';

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', sendEmailRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Static files (для production)
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, 'dist');

// Раздаём статику из dist
app.use(express.static(distPath));

// Все остальные запросы -> index.html (для SPA)
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📧 Endpoint: http://localhost:${PORT}/api/send-email`);
  console.log(`❤️ Health: http://localhost:${PORT}/health`);
});
