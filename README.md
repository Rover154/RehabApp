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

# API URL (для Render.com - оставьте пустым для production)
VITE_API_URL=

# io.net API Key (Kimi-K2)
VITE_IO_NET_API_KEY=your_io_net_api_key_here

# Groq API Key (Llama-3.1-8b-instant)
VITE_GROQ_API_KEY=your_groq_api_key_here

# Email для отправки через SMTP
EMAIL_USER=your_email_here
EMAIL_PASSWORD=your_email_password_here
```

## 🌐 Деплой на Render.com

### Автоматический деплой (через render.yaml)

1. Запушите проект на GitHub
2. В Render Dashboard нажмите **New +** → **Blueprint**
3. Подключите репозиторий GitHub: `Rover154/RehabApp`
4. Render автоматически создаст Web Service
5. Добавьте переменные окружения в Dashboard

### Ручной деплой

1. **New +** → **Web Service**
2. Подключите репозиторий
3. Build Command: `npm install && npm run build`
4. Start Command: `node server.js`
5. Добавьте environment variables (см. [DEPLOY_RENDER.md](DEPLOY_RENDER.md))

📖 **Подробная инструкция**: [DEPLOY_RENDER.md](DEPLOY_RENDER.md)

## 📁 Структура проекта

```
rehab-app/
├── api/
│   └── send-email.js       # API для отправки email с AI генерацией (io.net + Groq)
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
│   │   └── Step9Result.tsx
│   ├── utils/
│   │   ├── cn.ts
│   │   └── validate.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server.js               # Express сервер (фронтенд + API)
├── render.yaml             # Конфигурация для Render.com
├── package.json
└── README.md
```

## 🤖 AI Генерация упражнений

Приложение использует **два AI API** с автоматическим переключением:

1. **io.net** (Kimi-K2) — основной API
2. **Groq** (Llama-3.1-8b-instant) — резервный API

### Преимущества:
- ✅ Автоматическое переключение при исчерпании лимита токенов
- ✅ Дневные лимиты: io.net (10k токенов), Groq (100k токенов)
- ✅ Fallback генерация при недоступности обоих API
- ✅ Сброс счётчиков токенов каждый день (UTC)

### Как работает переключение:

```
1. Проверка io.net → доступно → используем io.net
2. io.net недоступен (401/429) → проверка Groq → используем Groq
3. Лимит io.net исчерпан → переключение на Groq
4. Лимит Groq исчерпан → попытка вернуться на io.net
```

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

## 💰 Стоимость деплоя

| Сервис | Тариф | Стоимость |
|---|---|---|
| Render Web Service | Starter | $7/мес |

> ⚠️ На бесплатном тарифе Render может переводить сервис в спящий режим.

## 📞 Контакты

📞 +7 (953) 790-20-10
📧 rover38354@gmail.com
💬 Telegram: @cigunrehab
