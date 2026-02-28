import { CheckCircle, Mail, MessageCircle } from 'lucide-react';

interface Step9ResultProps {
  name: string;
  onBuy: () => void;
  isBuying?: boolean;
}

export function Step9Result({ name, onBuy, isBuying = false }: Step9ResultProps) {
  return (
    <div className="card animate-in fade-in zoom-in duration-500 text-center">
      <div className="mb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{name}, ваша программа готова!</h2>
        <p className="text-gray-600 max-w-md mx-auto text-sm">
          Спасибо за заполнение анкеты. Мы подготовим для вас персональный комплекс из 10-15 упражнений для самостоятельных занятий.
        </p>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <button 
          onClick={onBuy} 
          disabled={isBuying}
          className={`w-full font-semibold rounded-xl transition-all duration-200 shadow-lg flex flex-col items-center justify-center py-3 ${
            isBuying 
              ? 'bg-red-600 text-white scale-95' 
              : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-xl active:bg-red-600 active:scale-95'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="flex items-center">
            <Mail className="mr-2 w-5 h-5" />
            ПРИОБРЕСТИ МЕТОДИЧКУ
          </span>
          <span className="text-sm mt-1">за 0 руб.</span>
        </button>

        <a href="https://t.me/cigunrehab_bot" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full flex items-center justify-center">
          <MessageCircle className="mr-2 w-5 h-5" />
          ПОЛУЧИТЬ БЕСПЛАТНО
        </a>
        <p className="text-xs text-gray-500">с помощью Telegram бота 3-4 простых упражнения</p>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">Если есть вопросы — свяжитесь с нами:</p>
        <a href="tel:+79537902010" className="text-base font-semibold text-green-600 hover:text-green-700">8-953-790-20-10</a>
      </div>
    </div>
  );
}
