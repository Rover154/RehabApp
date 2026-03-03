# 🚀 Инструкция по деплою на Render.com

## 📋 Что было сделано

Приложение адаптировано для деплоя на Render.com с поддержкой двух AI API:
- **io.net** (Kimi-K2) — основной API
- **Groq** (Llama-3.1-8b-instant) — резервный API

### Изменения:
1. ✅ Создан `render.yaml` для автоматического деплоя
2. ✅ Обновлён `api/send-email.js` с поддержкой io.net + Groq
3. ✅ Обновлён `server.js` для работы на Render (комбинированный режим: фронтенд + API)
4. ✅ Обновлён `.gitignore`
5. ✅ Обновлена документация

---

## 🎯 Деплой (Единый Web Service)

### Шаг 1: Подготовка на GitHub

1. Убедитесь, что проект запушен на GitHub: `https://github.com/Rover154/RehabApp`
2. Все изменения закоммичены и запушены в ветку `main`

### Шаг 2: Создание сервиса на Render

1. Зайдите в [Render Dashboard](https://dashboard.render.com/)
2. Нажмите **New +** → **Blueprint**
3. Подключите репозиторий GitHub: `Rover154/RehabApp`
4. Render автоматически распознает `render.yaml` и создаст сервис:
   - **rehab-app** (Web Service)

ИЛИ вручную:

1. **New +** → **Web Service**
2. Подключите репозиторий: `Rover154/RehabApp`
3. Настройте:
   - **Name**: `rehab-app`
   - **Region**: Oregon (ближе к вам)
   - **Branch**: `main`
   - **Root Directory**: (оставьте пустым)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Instance Type**: **Starter** ($7/мес)
4. Нажмите **Create Web Service**

### Шаг 3: Добавление переменных окружения

После создания сервиса добавьте **Environment Variables** в Render Dashboard:

| Переменная | Описание | Пример |
|---|---|---|
| `PORT` | Порт сервера | `10000` |
| `VITE_TELEGRAM_BOT_TOKEN` | Токен Telegram бота | `123456789:ABC...` |
| `VITE_TELEGRAM_CHAT_ID` | Chat ID для уведомлений | `@cigunrehab` |
| `VITE_IO_NET_API_KEY` | API ключ io.net (Kimi-K2) | `io_...` |
| `VITE_GROQ_API_KEY` | API ключ Groq (Llama-3.1) | `gsk_...` |
| `VITE_API_URL` | URL API (оставьте пустым) | `` (пусто) |
| `EMAIL_USER` | Email для SMTP | `r-t-c@narod.ru` |
| `EMAIL_PASSWORD` | Пароль email | `...` |
| `IO_NET_API_KEY` | API ключ io.net (сервер) | `io_...` |
| `GROQ_API_KEY` | API ключ Groq (сервер) | `gsk_...` |
| `TELEGRAM_BOT_TOKEN` | Токен бота (сервер) | `123456789:ABC...` |
| `TELEGRAM_CHAT_ID` | Chat ID (сервер) | `@cigunrehab` |

После добавления переменных нажмите **Save Changes** — начнётся автоматический билд.

---

## 🤖 Работа с двумя AI (io.net + Groq)

### Принцип работы

Приложение использует **автоматическое переключение** между AI API:

1. **Основной API**: io.net (Kimi-K2)
2. **Резервный API**: Groq (Llama-3.1-8b-instant)

### Автоматическое переключение

- При запуске проверяется доступность io.net
- Если io.net недоступен (401, 429, ошибка) → переключение на Groq
- При исчерпании дневного лимита io.net (10k токенов) → переключение на Groq
- При исчерпании лимита Groq (100k токенов) → попытка вернуться на io.net
- Счётчики токенов сбрасываются каждый день (в UTC)

### Мониторинг

В логах Render Dashboard вы увидите:
```
✅ io.net: API доступно
📊 io.net: использовано токенов: 1234, всего сегодня: 5678
⚠️ io.net: Достигнут дневной лимит, пробуем Groq
🤖 Используем API: groq
```

---

## ✅ Проверка работы

### 1. Проверка Health Check
- Откройте: `https://rehab-app.onrender.com/health`
- Должно вернуться: `{"status":"ok","timestamp":"...","service":"rehab-app"}`

### 2. Проверка фронтенда
- Откройте: `https://rehab-app.onrender.com`
- Пройдите опросник (все 8 шагов)

### 3. Проверка отправки email
- На последнем шаге нажмите кнопку покупки
- Проверьте email клиента и инструктора
- Письма должны прийти с сгенерированным комплексом

### 4. Проверка Telegram
- Проверьте чат `@cigunrehab` — должно прийти уведомление о новой заявке

---

## 🐛 Возможные проблемы

### Ошибка: "Сервис временно недоступен"
- Проверьте API ключи io.net и Groq в переменных окружения
- Проверьте логи Web Service в Render Dashboard
- Убедитесь, что ключи действительны и не истекли

### Ошибка: "Не удалось отправить письмо"
- Проверьте SMTP credentials (EMAIL_USER, EMAIL_PASSWORD)
- Проверьте логи Web Service
- Убедитесь, что почтовый сервер smtp.narod.ru доступен

### Фронтенд не загружается
- Проверьте, что билд прошёл успешно
- Проверьте, что `dist` папка создана при билде
- Проверьте логи в Render Dashboard

### Превышен лимит токенов
- io.net: 10,000 токенов в день
- Groq: 100,000 токенов в день
- Счётчики сбрасываются автоматически в начале нового дня (UTC)

---

## 💰 Стоимость

| Сервис | Тариф | Стоимость |
|---|---|---|
| Web Service | Starter | $7/мес |
| **Итого** | | **$7/мес** |

> ⚠️ Render может переводить сервис в спящий режим на бесплатном тарифе. Для production рекомендуется Starter ($7/мес).

---

## 📞 Контакты

При возникновении проблем:
- 📧 rover38354@gmail.com
- 📱 +7 (953) 790-20-10
- 💬 Telegram: @cigunrehab

---

## 🔗 Полезные ссылки

- [Render Documentation](https://render.com/docs)
- [io.net API Documentation](https://docs.io.solutions/)
- [Groq API Documentation](https://console.groq.com/docs)
- [Nodemailer Documentation](https://nodemailer.com/)
