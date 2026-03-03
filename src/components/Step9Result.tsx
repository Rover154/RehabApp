import { useState } from 'react';
import { CheckCircle, Mail, MessageCircle, Download, Copy, Check } from 'lucide-react';

interface Step9ResultProps {
  name: string;
  exercisePlan?: string;
  onBuy: () => void;
  isBuying?: boolean;
}

export function Step9Result({ name, exercisePlan, onBuy, isBuying = false }: Step9ResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (exercisePlan) {
      await navigator.clipboard.writeText(exercisePlan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (exercisePlan) {
      const blob = new Blob([exercisePlan], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Комплекс_упражнений_${name}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="card animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{name}, ваша программа готова!</h2>
        <p className="text-gray-600 max-w-md mx-auto text-sm">
          На основе ваших данных мы составили персональный комплекс упражнений.
        </p>
      </div>

      {/* Отображение комплекса упражнений */}
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
                onClick={handleDownload}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Скачать файл"
              >
                <Download className="w-4 h-4" />
                Скачать
              </button>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
              {exercisePlan}
            </pre>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-gray-700">
            ⏳ Комплекс упражнений будет сгенерирован и показан здесь после отправки заявки.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex gap-3">
          <button
            onClick={onBuy}
            disabled={isBuying}
            className={`btn-primary flex-1 flex items-center justify-center ${
              isBuying ? 'scale-95' : ''
            }`}
          >
            <Mail className="mr-2 w-5 h-5" />
            {isBuying ? 'ОТПРАВЛЕНО!' : 'ПОЛУЧИТЬ ПОЛНУЮ ВЕРСИЮ'}
          </button>

          <a
            href="https://t.me/cigunrehab_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 flex items-center justify-center"
          >
            <MessageCircle className="mr-2 w-5 h-5" />
            TELEGRAM БОТ
          </a>
        </div>
        <p className="text-xs text-gray-500 text-center">
          Полная версия (10-15 упражнений) доступна после оплаты
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">Если есть вопросы — свяжитесь с нами:</p>
        <a href="tel:+79537902010" className="text-base font-semibold text-green-600 hover:text-green-700">
          8-953-790-20-10
        </a>
      </div>
    </div>
  );
}
