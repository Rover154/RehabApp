import { useState } from 'react';
// @ts-ignore - pdfmake не имеет типов TypeScript
import pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CheckCircle, MessageCircle, Download, Copy, Check, FileText, Video, Loader } from 'lucide-react';

interface Step9ResultProps {
  name: string;
  phone: string;
  email: string;
  exercisePlan?: string;
  onBuy: () => void;
  onVideoRequest: () => void;
  isSendingPdf?: boolean;
  isRequestingVideo?: boolean;
}

export function Step9Result({
  name,
  phone,
  email,
  exercisePlan,
  onBuy,
  onVideoRequest,
  isSendingPdf = false,
  isRequestingVideo = false
}: Step9ResultProps) {
  const [copied, setCopied] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  const handleCopy = async () => {
    if (exercisePlan) {
      await navigator.clipboard.writeText(exercisePlan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPdf = () => {
    if (!exercisePlan) return;

    // Поддержка кириллицы через pdfmake
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    // Форматируем дату правильно (ru-RU)
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const docDefinition = {
      content: [
        // Заголовок
        {
          text: 'RehabApp',
          style: 'header',
          color: '#16a34a'
        },
        {
          text: 'Персональный комплекс упражнений',
          style: 'subheader',
          color: '#666666'
        },
        {
          text: '\nДата формирования: ' + formattedDate,
          style: 'date',
          color: '#999999'
        },
        {
          text: '\n'
        },
        // Информация о клиенте
        {
          style: 'infoTable',
          table: {
            widths: ['auto', '*'],
            body: [
              ['Клиент:', name],
              ['Email:', email],
              ['Телефон:', phone],
              ['Дата:', formattedDate]
            ]
          },
          layout: 'noBorders'
        },
        {
          text: '\n'
        },
        // Разделительная линия
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#16a34a' }]
        },
        {
          text: '\n'
        },
        // Основной текст комплекса
        {
          text: exercisePlan,
          style: 'content'
        }
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          margin: [0, 0, 0, 5]
        },
        subheader: {
          fontSize: 14,
          margin: [0, 0, 0, 10]
        },
        date: {
          fontSize: 10,
          italic: true,
          margin: [0, 0, 0, 10]
        },
        infoTable: {
          fontSize: 11,
          margin: [0, 0, 0, 10]
        },
        content: {
          fontSize: 11,
          lineHeight: 1.5
        }
      },
      pageMargins: [20, 20, 20, 20]
    };

    pdfMake.createPdf(docDefinition).download(`Комплекс_упражнений_${name.replace(/\s+/g, '_')}_${currentDate.toISOString().split('T')[0]}.pdf`);
    setPdfGenerated(true);
  };

  const handleGetPdf = () => {
    // Отправка запроса на генерацию PDF и отправку в Telegram
    onBuy();
  };

  return (
    <div className="card animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{name}, анкета заполнена!</h2>
        <p className="text-gray-600 max-w-md mx-auto text-sm">
          Выберите способ получения комплекса упражнений
        </p>
      </div>

      {/* Отображение комплекса упражнений (после оплаты) */}
      {exercisePlan ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">📋 Ваш комплекс упражнений:</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Копировать текст"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Скопировано!' : 'Копировать'}
              </button>
              <button
                onClick={handleDownloadPdf}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Скачать PDF"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {exercisePlan}
            </pre>
          </div>
          {pdfGenerated && (
            <p className="text-xs text-green-600 mt-2 text-center">✅ PDF файл скачан</p>
          )}
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-gray-700">
            💰 Комплекс упражнений будет показан здесь после оплаты 299 руб.
          </p>
        </div>
      )}

      {/* Кнопки действий */}
      <div className="space-y-3">
        {/* Кнопка получения PDF */}
        <button
          onClick={handleGetPdf}
          disabled={isSendingPdf || !!exercisePlan}
          className={`w-full py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
            exercisePlan
              ? 'bg-gray-400 cursor-not-allowed'
              : isSendingPdf
              ? 'bg-red-600 text-white scale-95'
              : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-xl active:scale-95'
          }`}
        >
          {isSendingPdf ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              ОТПРАВКА ЗАПРОСА...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              {exercisePlan ? 'КОМПЛЕКС ПОЛУЧЕН' : 'ПОЛУЧИТЬ КОМПЛЕКС В PDF'}
            </>
          )}
        </button>

        {/* Кнопка получения видео */}
        <button
          onClick={onVideoRequest}
          disabled={isRequestingVideo}
          className={`w-full py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
            isRequestingVideo
              ? 'bg-blue-400 text-white scale-95'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl active:scale-95'
          }`}
        >
          {isRequestingVideo ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              ОТПРАВКА ЗАПРОСА...
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              ПОЛУЧИТЬ КОМПЛЕКС С ВИДЕО
            </>
          )}
        </button>

        {/* Кнопка Telegram бота */}
        <a
          href="https://t.me/cigunrehab_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary w-full flex items-center justify-center"
        >
          <MessageCircle className="mr-2 w-5 h-5" />
          ПОЛУЧИТЬ БЕСПЛАТНО
        </a>
        <p className="text-xs text-gray-500 text-center">
          3-4 простых упражнения в Telegram боте
        </p>

        {/* Блок для будущей оплаты */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-xs text-gray-500 text-center">
            💳 Оплата будет добавлена позже. Сейчас комплекс доступен бесплатно.
          </p>
        </div>
      </div>

      {/* Контакты */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">Если есть вопросы — свяжитесь с нами:</p>
        <a href="tel:+79537902010" className="text-base font-semibold text-green-600 hover:text-green-700">
          8-953-790-20-10
        </a>
      </div>
    </div>
  );
}
