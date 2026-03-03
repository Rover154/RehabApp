// API для отправки уведомлений через Telegram с генерацией через AI
// Работает на Render.com Web Service
// Приоритет: Telegram вместо email (надёжнее)

import express from 'express';

const router = express.Router();

// === Глобальные переменные для переключения API ===
let USE_GROQ = false;  // Флаг: false = io.net, true = Groq
const IO_NET_DAILY_LIMIT = 10000;  // Дневной лимит токенов для io.net
const GROQ_DAILY_LIMIT = 100000;   // Дневной лимит для Groq
let ioNetTokensUsed = 0;
let groqTokensUsed = 0;
let lastResetDate = null;

// Сброс счётчиков при новом дне
function resetDailyTokensIfNewDay() {
  const today = new Date().toISOString().split('T')[0];
  if (lastResetDate !== today) {
    console.log(`📅 Новый день (${today}), сброс счётчиков токенов`);
    ioNetTokensUsed = 0;
    groqTokensUsed = 0;
    lastResetDate = today;
  }
}

// Проверка доступности io.net
async function checkIoNetAvailability() {
  resetDailyTokensIfNewDay();
  
  try {
    const response = await fetch('https://api.intelligence.io.solutions/api/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.IO_NET_API_KEY}` },
      method: 'GET',
    });
    
    if (response.status === 401) {
      console.error('❌ io.net: Неверный API ключ');
      return false;
    }
    if (response.status === 429) {
      console.warn('⚠️ io.net: Превышен лимит токенов (429)');
      return false;
    }
    if (response.status === 200) {
      const remaining = response.headers.get('X-RateLimit-Remaining');
      if (remaining && parseInt(remaining) <= 0) {
        console.warn('⚠️ io.net: Лимит токенов исчерпан');
        return false;
      }
      console.log('✅ io.net: API доступно');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ io.net: Ошибка проверки — ${error}`);
    return false;
  }
}

// Проверка доступности Groq
async function checkGroqAvailability() {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      method: 'GET',
    });
    
    if (response.status === 401) {
      console.error('❌ Groq: Неверный API ключ');
      return false;
    }
    if (response.status === 429) {
      console.warn('⚠️ Groq: Превышен лимит токенов (429)');
      return false;
    }
    if (response.status === 200) {
      const remaining = response.headers.get('x-ratelimit-remaining-tokens');
      if (remaining && parseInt(remaining) <= 0) {
        console.warn('⚠️ Groq: Лимит токенов исчерпан');
        return false;
      }
      console.log('✅ Groq: API доступно');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Groq: Ошибка проверки — ${error}`);
    return false;
  }
}

// Определение доступного API
async function getAvailableApi() {
  if (!USE_GROQ && await checkIoNetAvailability()) {
    return 'io_net';
  }
  if (await checkGroqAvailability()) {
    USE_GROQ = true;
    return 'groq';
  }
  if (await checkIoNetAvailability()) {
    USE_GROQ = false;
    return 'io_net';
  }
  return null;
}

// Генерация через AI с фолбэком
async function generateWithFallback(messages, retryCount = 0) {
  if (retryCount > 3) {
    console.error('❌ Превышено количество попыток переключения API');
    throw new Error('Сервис временно недоступен');
  }

  const api = await getAvailableApi();
  console.log(`🤖 Используем API: ${api || 'none'}`);

  if (api === 'groq') {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages,
          max_tokens: 4000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq error: ${response.status}`);
      }

      const result = await response.json();
      const usage = result.usage;
      const tokensUsed = usage?.total_tokens || 0;
      groqTokensUsed += tokensUsed;
      console.log(`📊 Groq: использовано токенов: ${tokensUsed}, всего сегодня: ${groqTokensUsed}`);

      // Проверка дневного лимита
      if (groqTokensUsed >= GROQ_DAILY_LIMIT) {
        console.warn('⚠️ Groq: Достигнут дневной лимит, пробуем io.net');
        USE_GROQ = false;
        groqTokensUsed = 0;
        return generateWithFallback(messages, retryCount + 1);
      }

      return result.choices?.[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error(`❌ Groq ошибка: ${error.message}`);
      USE_GROQ = false;
      return generateWithFallback(messages, retryCount + 1);
    }
  } else if (api === 'io_net') {
    try {
      const response = await fetch('https://api.intelligence.io.solutions/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.IO_NET_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'moonshotai/Kimi-K2-Instruct-0905',
          messages,
          max_tokens: 4000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`io.net error: ${response.status}`);
      }

      const result = await response.json();
      const usage = result.usage;
      const tokensUsed = usage?.total_tokens || 0;
      ioNetTokensUsed += tokensUsed;
      console.log(`📊 io.net: использовано токенов: ${tokensUsed}, всего сегодня: ${ioNetTokensUsed}`);

      // Проверка дневного лимита
      if (ioNetTokensUsed >= IO_NET_DAILY_LIMIT) {
        console.warn('⚠️ io.net: Достигнут дневной лимит, пробуем Groq');
        USE_GROQ = true;
        ioNetTokensUsed = 0;
        return generateWithFallback(messages, retryCount + 1);
      }

      return result.choices?.[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error(`❌ io.net ошибка: ${error.message}`);
      USE_GROQ = true;
      return generateWithFallback(messages, retryCount + 1);
    }
  } else {
    throw new Error('Нет доступного API');
  }
}

// Формирование промпта для AI
function createPrompt(formData) {
  return `
Ты — профессиональный врач-реабилитолог с 20-летним стажем. Составь персональный комплекс из 10-15 упражнений для пациента.

📋 ДАННЫЕ ПАЦИЕНТА:
- Имя: ${formData.clientName}
- Возраст: ${formData.age} лет
- Рост: ${formData.height} см
- Вес: ${formData.weight} кг
- Ситуация: ${formData.conditions}${formData.otherDetails ? ` (${formData.otherDetails})` : ''}
- Время с момента события: ${formData.timePassed}
${formData.chronicDiseases ? `- Хронические заболевания: ${formData.chronicDiseases}${formData.chronicOtherDetails ? ` (${formData.chronicOtherDetails})` : ''}` : ''}
${formData.strokeSymptoms && formData.strokeSymptoms.length > 0 ? `- Симптомы после инсульта: ${formData.strokeSymptoms.join(', ')}` : ''}
${formData.heartAttackSymptoms && formData.heartAttackSymptoms.length > 0 ? `- Симптомы после инфаркта: ${formData.heartAttackSymptoms.join(', ')}` : ''}
${formData.traumaArea ? `- Область травмы: ${formData.traumaArea}${formData.traumaOtherDetails ? ` (${formData.traumaOtherDetails})` : ''}` : ''}
- Предпочтительный формат: ${formData.format}
${formData.comment ? `- Комментарий пациента: ${formData.comment}` : ''}

📝 ТРЕБОВАНИЯ К КОМПЛЕКСУ:
1. Ровно 10-15 упражнений
2. Каждое упражнение должно содержать:
   - Название
   - Исходное положение
   - Пошаговое выполнение
   - Количество повторений (3 подхода по 10-15 раз, или время выполнения)
   - Важные указания по технике безопасности
3. Упражнения должны быть безопасными для домашнего выполнения
4. Учитывай возраст и хронические заболевания
5. В начале — разминка (3-5 упражнений), затем основная часть, в конце — заминка
6. Все инструкции на русском языке

⚠️ ВАЖНО:
- Если острый период (менее 1 месяца) — упражнения максимально щадящие
- Если возраст 70+ — добавить указания об использовании опоры
- При хронических заболеваниях — избегать противопоказанных движений

📄 ФОРМАТ ОТВЕТА:
Верни ТОЛЬКО текст комплекса упражнений в следующем формате (без лишних слов):

ПЕРСОНАЛЬНЫЙ КОМПЛЕКС УПРАЖНЕНИЙ
=================================
Пациент: [Имя]
Возраст: [возраст] лет
Дата: [текущая дата]

📋 ВАША СИТУАЦИЯ:
[Краткое описание ситуации]

⚠️ ВАЖНЫЕ УКАЗАНИЯ:
[Индивидуальные предупреждения]

🔥 РАЗМИНКА (5-7 минут):
1. [Название упражнения]
   Исходное положение: [описание]
   Выполнение: [пошагово]
   Повторения: [кол-во]

[и так далее...]

📋 ОСНОВНОЙ КОМПЛЕКС:
[Упражнения 4-12...]

🧘 ЗАМИНКА И РАССЛАБЛЕНИЕ:
[Упражнения 13-15...]

💡 ОБЩИЕ РЕКОМЕНДАЦИИ:
• Начинайте с минимальной нагрузки
• Следите за самочувствием во время упражнений
• При дискомфорте прекратите занятие
• Занимайтесь регулярно, лучше в одно и то же время
• Перед началом занятий проконсультируйтесь с врачом

📞 Для персональной консультации: +7 (953) 790-20-10
`.trim();
}

// Fallback генерация (если AI недоступен)
function generateFallbackRecommendations(data) {
  const conditions = data.conditions || '';
  const timePassed = data.timePassed || '';
  const age = parseInt(data.age) || 60;

  let rec = [];

  rec.push('ПЕРСОНАЛЬНЫЙ КОМПЛЕКС УПРАЖНЕНИЙ');
  rec.push('=================================');
  rec.push(`Пациент: ${data.clientName}`);
  rec.push(`Возраст: ${data.age} лет`);
  rec.push(`Дата: ${new Date().toLocaleDateString('ru-RU')}`);
  rec.push('');
  rec.push('📋 ВАША СИТУАЦИЯ:');
  rec.push(`${conditions}${data.otherDetails ? ` — ${data.otherDetails}` : ''}`);
  rec.push(`Время с момента события: ${timePassed}`);
  rec.push('');

  rec.push('🔥 РАЗМИНКА (5-7 минут):');
  rec.push('');
  rec.push('1. Дыхательные упражнения');
  rec.push('   Исходное положение: Сидя или стоя, спина прямая');
  rec.push('   Выполнение: Глубокий вдох через нос, медленный выдох через рот');
  rec.push('   Повторения: 10-15 раз');
  rec.push('');
  rec.push('2. Наклоны головы');
  rec.push('   Исходное положение: Сидя, руки на коленях');
  rec.push('   Выполнение: Медленные наклоны головы вперёд-назад, затем влево-вправо');
  rec.push('   Повторения: по 5-7 раз в каждую сторону');
  rec.push('');
  rec.push('3. Вращения в плечах');
  rec.push('   Исходное положение: Стоя, ноги на ширине плеч');
  rec.push('   Выполнение: Круговые движения плечами вперёд и назад');
  rec.push('   Повторения: по 10 раз в каждую сторону');
  rec.push('');

  rec.push('📋 ОСНОВНОЙ КОМПЛЕКС:');
  rec.push('');

  if (conditions.includes('Инсульт') || conditions.includes('stroke')) {
    rec.push('4. Упражнения для рук');
    rec.push('   Исходное положение: Сидя на стуле');
    rec.push('   Выполнение: Сжимание и разжимание кулаков, подъём рук вперёд');
    rec.push('   Повторения: 10-15 раз');
    rec.push('');
    rec.push('5. Упражнения для ног');
    rec.push('   Исходное положение: Сидя на стуле');
    rec.push('   Выполнение: Подъём коленей, перекаты с пятки на носок');
    rec.push('   Повторения: 10-15 раз');
    rec.push('');
    rec.push('6. Баланс');
    rec.push('   Исходное положение: Стоя с опорой');
    rec.push('   Выполнение: Стояние на одной ноге (с поддержкой)');
    rec.push('   Повторения: по 10-15 секунд на каждую ногу');
  } else if (conditions.includes('Инфаркт') || conditions.includes('heart_attack')) {
    rec.push('4. Лёгкая кардионагрузка');
    rec.push('   Исходное положение: Стоя');
    rec.push('   Выполнение: Ходьба на месте с высоким подниманием колен');
    rec.push('   Повторения: 2-3 минуты');
    rec.push('');
    rec.push('5. Упражнения для рук');
    rec.push('   Исходное положение: Стоя, ноги на ширине плеч');
    rec.push('   Выполнение: Подъём рук в стороны и опускание');
    rec.push('   Повторения: 10-12 раз');
    rec.push('');
    rec.push('6. Полуприседания');
    rec.push('   Исходное положение: Стоя с опорой на спинку стула');
    rec.push('   Выполнение: Небольшие приседания на 1/4 амплитуды');
    rec.push('   Повторения: 8-10 раз');
  } else if (conditions.includes('Травма') || conditions.includes('trauma')) {
    rec.push('4. Лёгкая растяжка');
    rec.push('   Исходное положение: Сидя или лёжа');
    rec.push('   Выполнение: Медленное растяжение мышц в безопасной амплитуде');
    rec.push('   Повторения: удерживать 15-20 секунд');
    rec.push('');
    rec.push('5. Изометрические упражнения');
    rec.push('   Исходное положение: Удобное положение');
    rec.push('   Выполнение: Напряжение мышц без движения в суставе');
    rec.push('   Повторения: 5-7 секунд напряжения, 10 секунд отдыха');
    rec.push('');
    rec.push('6. Статические позы');
    rec.push('   Исходное положение: С опорой');
    rec.push('   Выполнение: Удержание положения с постепенным увеличением времени');
    rec.push('   Повторения: 15-30 секунд');
  } else {
    rec.push('4. Мягкая растяжка');
    rec.push('   Исходное положение: Стоя или сидя');
    rec.push('   Выполнение: Наклоны корпуса, вращения в суставах');
    rec.push('   Повторения: по 8-10 раз');
    rec.push('');
    rec.push('5. Упражнения для кора');
    rec.push('   Исходное положение: Лёжа на спине');
    rec.push('   Выполнение: Подъём таза, удержание напряжения пресса');
    rec.push('   Повторения: 8-10 раз');
    rec.push('');
    rec.push('6. Баланс и координация');
    rec.push('   Исходное положение: Стоя с опорой');
    rec.push('   Выполнение: Стояние на одной ноге, перенос веса');
    rec.push('   Повторения: по 10-15 секунд');
  }

  rec.push('');
  rec.push('🧘 ЗАМИНКА И РАССЛАБЛЕНИЕ:');
  rec.push('');
  rec.push('12. Глубокое дыхание');
  rec.push('    Исходное положение: Лёжа или сидя в удобной позе');
  rec.push('    Выполнение: Медленное диафрагмальное дыхание');
  rec.push('    Повторения: 2-3 минуты');
  rec.push('');
  rec.push('13. Прогрессивная релаксация');
  rec.push('    Исходное положение: Лёжа на спине');
  rec.push('    Выполнение: Последовательное напряжение и расслабление мышц');
  rec.push('    Повторения: от ног к голове, по 5 секунд');
  rec.push('');
  rec.push('14-15. Медленная растяжка всех групп мышц');
  rec.push('    Исходное положение: Удобное положение');
  rec.push('    Выполнение: Плавное растяжение с фиксацией 20-30 секунд');
  rec.push('');

  rec.push('⚠️ ВАЖНЫЕ УКАЗАНИЯ:');
  if (timePassed.includes('Острый') || timePassed.includes('acute') || timePassed.includes('1 месяца')) {
    rec.push('- В острый период занимайтесь ТОЛЬКО под наблюдением врача!');
  }
  if (age > 70) {
    rec.push('- Используйте опору при выполнении упражнений');
    rec.push('- Делайте перерывы каждые 5 минут');
  }
  rec.push('- Начинайте с минимальной нагрузки');
  rec.push('- При дискомфорте прекратите занятие');
  rec.push('');

  rec.push('💡 ОБЩИЕ РЕКОМЕНДАЦИИ:');
  rec.push('• Начинайте с минимальной нагрузки');
  rec.push('• Следите за самочувствием во время упражнений');
  rec.push('• При дискомфорте прекратите занятие');
  rec.push('• Занимайтесь регулярно, лучше в одно и то же время');
  rec.push('');
  rec.push('📞 Для персональной консультации: +7 (953) 790-20-10');

  return rec.join('\n');
}

// POST /api/send-email
router.post('/send-email', async (req, res) => {
  // CORS
  const origin = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    console.log('📬 Получена заявка от:', formData.clientName, formData.clientEmail);

    // Валидация
    if (!formData.clientName || !formData.clientEmail || !formData.phone) {
      return res.status(400).json({ error: 'Не заполнены обязательные поля' });
    }

    // Генерация комплекса через AI с фолбэком
    console.log('🤖 Генерация упражнений через AI...');
    let exercisePlan;

    try {
      const prompt = createPrompt(formData);
      const messages = [
        {
          role: 'system',
          content: 'Ты — профессиональный врач-реабилитолог. Составляешь безопасные и эффективные комплексы упражнений для реабилитации.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      exercisePlan = await generateWithFallback(messages);
      console.log('✅ Упражнения сгенерированы через AI');
    } catch (aiError) {
      console.error('❌ Ошибка AI, используем запасной вариант:', aiError.message);
      exercisePlan = generateFallbackRecommendations(formData);
    }

    // === ОТПРАВКА ЧЕРЕZ TELEGRAM (вместо email) ===
    const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || '@cigunrehab';

    if (!botToken) {
      console.error('❌ TELEGRAM_BOT_TOKEN не задан!');
      throw new Error('Не настроен Telegram бот. Добавьте TOKEN в переменные окружения.');
    }

    // Формируем сообщение для инструктора
    const instructorMessage = `
🔔 *НОВАЯ ЗАЯВКА НА РЕАБИЛИТАЦИЮ*

👤 *Клиент:* ${formData.clientName}
📱 *Телефон:* ${formData.phone}
✉️ *Email:* ${formData.clientEmail}

📊 *Анкета:*
- Возраст: ${formData.age} лет
- Рост/Вес: ${formData.height} см / ${formData.weight} кг
- Ситуация: ${formData.conditions}${formData.otherDetails ? ` — ${formData.otherDetails}` : ''}
- Время прошло: ${formData.timePassed}
- Хронические заболевания: ${formData.chronicDiseases || 'Нет'}
- Формат: ${formData.format}
- Комментарий: ${formData.comment || 'Нет'}

📋 *СГЕНЕРИРОВАННЫЙ КОМПЛЕКС:*
${exercisePlan.substring(0, 2000)}${exercisePlan.length > 2000 ? '...' : ''}
    `.trim();

    // Отправка уведомления инструктору
    console.log('📤 Отправка уведомления инструктору в Telegram...');
    
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: instructorMessage,
          parse_mode: 'Markdown',
        }),
      });
      console.log('✅ Уведомление инструктору отправлено');
    } catch (tgError) {
      console.error('⚠️ Не удалось отправить в Telegram:', tgError.message);
      // Не прерываем процесс, продолжаем
    }

    // Отправка комплекса клиенту (в личные сообщения через бота)
    // Для этого нужно чтобы клиент сначала запустил бота
    // Поэтому отправляем только инструктору, а клиенту показываем на экране

    console.log('✅ Заявка успешно обработана');

    return res.status(200).json({
      success: true,
      message: 'Заявка отправлена инструктору. Комплекс будет отправлен на email.',
      exercisePlan: exercisePlan, // Возвращаем комплекс для отображения
    });
  } catch (error) {
    console.error('❌ Ошибка:', error);
    console.error('❌ Stack:', error.stack);
    return res.status(500).json({
      error: error.message || 'Не удалось отправить заявку',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
