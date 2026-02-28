# 🚀 Инструкция по деплою на Render.com

## 📋 Что было сделано

Приложение адаптировано для деплоя на Render.com с поддержкой двух AI API:
- **io.net** (Kimi-K2) — основной API
- **Groq** (Llama-3.1-8b-instant) — резервный API

### Изменения:
1. ✅ Создан `render.yaml` для автоматического деплоя
2. ✅ Обновлён `api/send-email.js` с поддержкой io.net + Groq
3. ✅ Обновлён `server.js` для работы на Render
4. ✅ Обновлён `package.json` (добавлены express, cors)
5. ✅ Обновлён `.gitignore` (игнорируем dist/)
6. ✅ Обновлён `src/App.tsx` (API URL из env)

---

## 🎯 Варианты деплоя

### Вариант 1: Автоматический (через Blueprint)

1. Зайдите в [Render Dashboard](https://dashboard.render.com/)
2. Нажмите **New +** → **Blueprint**
3. Подключите репозиторий GitHub: `Rover154/rehabflow`
4. Render автоматически распознает `render.yaml` и создаст 2 сервиса:
   - **rehab-app-static** (Static Site)
   - **rehab-app-api** (Web Service)
5. Добавьте переменные окружения в Dashboard каждого сервиса

### Вариант 2: Ручной (пошагово)

#### Шаг 1: Static Site (фронтенд)

1. **New +** → **Static Site**
2. Подключите репозиторий: `Rover154/rehabflow`
3. Настройте:
   - **Name**: `rehab-app-static`
   - **Branch**: `main`
   - **Root Directory**: (оставьте пустым)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Добавьте **Environment Variables**:
   ```
   VITE_TELEGRAM_BOT_TOKEN=your_bot_token
   VITE_TELEGRAM_CHAT_ID=@cigunrehab
   VITE_IO_NET_API_KEY=your_io_net_key
   VITE_GROQ_API_KEY=your_groq_key
   VITE_API_URL=https://rehab-app-api.onrender.com  (будет после создания Web Service)
   ```
5. Нажмите **Create Static Site**

#### Шаг 2: Web Service (API)

1. **New +** → **Web Service**
2. Подключите репозиторий: `Rover154/rehabflow`
3. Настройте:
   - **Name**: `rehab-app-api`
   - **Region**: Oregon (ближе к вам)
   - **Branch**: `main`
   - **Root Directory**: (оставьте пустым)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: **Starter** ($7/мес)
4. Добавьте **Environment Variables**:
   ```
   PORT=10000
   EMAIL_USER=r-t-c@narod.ru
   EMAIL_PASSWORD=your_email_password
   IO_NET_API_KEY=your_io_net_key
   GROQ_API_KEY=your_groq_key
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=@cigunrehab
   ```
5. Нажмите **Create Web Service**

#### Шаг 3: Обновите Static Site

После создания Web Service:
1. Скопируйте URL Web Service (например: `https://rehab-app-api.onrender.com`)
2. В Static Site добавьте переменную:
   ```
   VITE_API_URL=https://rehab-app-api.onrender.com
   ```
3. Сохраните — начнётся автоматический ребилд

---

## 🔧 Переменные окружения

### Для Static Site:
| Переменная | Описание | Пример |
|---|---|---|
| `VITE_TELEGRAM_BOT_TOKEN` | Токен Telegram бота | `123456789:ABC...` |
| `VITE_TELEGRAM_CHAT_ID` | Chat ID для уведомлений | `@cigunrehab` |
| `VITE_IO_NET_API_KEY` | API ключ io.net | `...` |
| `VITE_GROQ_API_KEY` | API ключ Groq | `...` |
| `VITE_API_URL` | URL Web Service | `https://...onrender.com` |

### Для Web Service:
| Переменная | Описание | Пример |
|---|---|---|
| `PORT` | Порт сервера | `10000` |
| `EMAIL_USER` | Email для SMTP | `r-t-c@narod.ru` |
| `EMAIL_PASSWORD` | Пароль email | `...` |
| `IO_NET_API_KEY` | API ключ io.net | `...` |
| `GROQ_API_KEY` | API ключ Groq | `...` |
| `TELEGRAM_BOT_TOKEN` | Токен бота | `...` |
| `TELEGRAM_CHAT_ID` | Chat ID | `@cigunrehab` |

---

## ✅ Проверка работы

### 1. Проверка Static Site
- Откройте URL Static Site в браузере
- Пройдите опросник
- На последнем шаге нажмите кнопку покупки

### 2. Проверка API
- Откройте: `https://rehab-app-api.onrender.com/health`
- Должно вернуться: `{"status":"ok","timestamp":"..."}`

### 3. Проверка email
- После отправки формы проверьте email клиента и инструктора
- Письма должны прийти с сгенерированным комплексом

---

## 🐛 Возможные проблемы

### Ошибка: "Сервис временно недоступен"
- Проверьте API ключи io.net и Groq в переменных окружения
- Проверьте логи Web Service в Render Dashboard

### Ошибка: "Не удалось отправить письмо"
- Проверьте SMTP credentials (EMAIL_USER, EMAIL_PASSWORD)
- Проверьте логи Web Service

### Фронтенд не видит API
- Убедитесь, что `VITE_API_URL` установлен в Static Site
- Проверьте CORS настройки (должны быть разрешены все origins)

---

## 💰 Стоимость

| Сервис | Тариф | Стоимость |
|---|---|---|
| Static Site | Free | $0/мес |
| Web Service | Starter | $7/мес |
| **Итого** | | **$7/мес** |

---

## 📞 Контакты

При возникновении проблем:
- 📧 rover38354@gmail.com
- 📱 +7 (953) 790-20-10
- 💬 Telegram: @cigunrehab
