// Сервер для запуска RehabApp на Render.com
// Комбинированный режим: раздача статики (фронтенд) + API
import express from 'express';
import cors from 'cors';
import sendEmailRouter from './api/send-email.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, 'dist');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', sendEmailRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'rehab-app'
  });
});

// Раздаём статику из dist (фронтенд)
app.use(express.static(distPath, {
  maxAge: '1d', // Кэширование на 1 день
  etag: true,
  lastModified: true
}));

// API для Telegram бота (опционально)
app.get('/api/telegram', (req, res) => {
  res.json({ message: 'Telegram API endpoint' });
});

// Все остальные запросы -> index.html (для SPA роутинга)
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log('🚀 ============================================');
  console.log(`🚀 RehabApp запущен на http://localhost:${PORT}`);
  console.log('🚀 ============================================');
  console.log(`📧 API Endpoint: http://localhost:${PORT}/api/send-email`);
  console.log(`❤️ Health Check: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log('🚀 ============================================');
});
