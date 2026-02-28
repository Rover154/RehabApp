# RehabApp - Персональная программа реабилитации

Интерактивное веб-приложение для сбора анкеты пациента и формирования персональной программы реабилитации.

## 🚀 Быстрый старт

```bash
npm install
npm run dev
```

## 📦 Сборка для production

```bash
npm install
npm run build
```

## 🔧 Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните:

```env
# Telegram Bot Token
VITE_TELEGRAM_BOT_TOKEN=your_bot_token_here
VITE_TELEGRAM_CHAT_ID=@cigunrehab

# API URL (для Render.com - укажите URL вашего Web Service)
VITE_API_URL=https://your-app-api.onrender.com

# io.net API Key
VITE_IO_NET_API_KEY=your_io_net_api_key_here

# Groq API Key
VITE_GROQ_API_KEY=your_groq_api_key_here

# Email для отправки через SMTP
EMAIL_USER=your_email_here
EMAIL_PASSWORD=your_email_password_here
```

## 🌐 Деплой на Render.com

### Вариант 1: Автоматический (через render.yaml)

1. Запушите проект на GitHub
2. В Render Dashboard нажмите **New +** → **Blueprint**
3. Подключите репозиторий GitHub
4. Render автоматически создаст 2 сервиса:
   - **Static Site** (фронтенд)
   - **Web Service** (API)
5. Добавьте переменные окружения в Dashboard каждого сервиса

### Вариант 2: Ручной

#### Static Site (фронтенд):
1. **New +** → **Static Site**
2. Подключите репозиторий
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. Добавьте environment variables:
   - `VITE_TELEGRAM_BOT_TOKEN`
   - `VITE_TELEGRAM_CHAT_ID`
   - `VITE_IO_NET_API_KEY`
   - `VITE_GROQ_API_KEY`
   - `VITE_API_URL` (URL вашего Web Service)

#### Web Service (API):
1. **New +** → **Web Service**
2. Подключите репозиторий
3. Environment: `Node`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Добавьте environment variables:
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `IO_NET_API_KEY`
   - `GROQ_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `PORT` (по умолчанию 10000)

## 📁 Структура проекта

```
rehab-app/
├── api/
│   └── send-email.ts       # API для отправки email с AI генерацией
├── src/
│   ├── components/
│   │   ├── Step1Welcome.tsx
│   │   ├── Step2PersonalInfo.tsx
│   │   ├── Step3Condition.tsx
│   │   ├── Step4TimeFrame.tsx
│   │   ├── Step5Specifics.tsx
│   │   ├── Step6Contraindications.tsx
│   │   ├── Step7Format.tsx
│   │   ├── Step8Contact.tsx
│   │   ├── Step9Result.tsx
│   │   └── FormComponents.tsx
│   ├── utils/
│   │   ├── cn.ts
│   │   └── validate.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server.js               # Express сервер для API
├── render.yaml             # Конфигурация для Render
├── vercel.json             # Конфигурация для Vercel
└── package.json
```

## 🤖 AI Генерация упражнений

Приложение использует **два AI API** с автоматическим переключением:

1. **io.net** (Kimi-K2) — основной API
2. **Groq** (Llama-3.1-8b-instant) — резервный API

### Преимущества:
- Автоматическое переключение при исчерпании лимита токенов
- Дневные лимиты: io.net (10k токенов), Groq (100k токенов)
- Fallback генерация при недоступности обоих API

## 📱 Экраны приложения

1. **Приветствие** - заголовок и кнопка начала
2. **Личная информация** - имя, возраст, рост, вес
3. **Ситуация** - инсульт, инфаркт, травма, хроническое, другое
4. **Время** - сколько времени прошло с момента события
5. **Детали** - симптомы в зависимости от ситуации
6. **Хронические заболевания** - гипертония, астма, диабет, другое
7. **Формат занятий** - самостоятельно, онлайн, лично, не знаю
8. **Контакты** - телефон, email, согласие
9. **Результат** - кнопка покупки методички и Telegram бот

## 🎨 Дизайн

- Бело-зелёная цветовая схема
- Адаптивный дизайн (ПК, планшет, смартфон)
- Зелёные кнопки с белым текстом

## 📞 Контакты

📞 +7 (953) 790-20-10
