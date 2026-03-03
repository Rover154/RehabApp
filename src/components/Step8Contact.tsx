import { useState } from 'react';
import { ArrowRight, ArrowLeft, User, Phone, Mail, MessageSquare, Loader } from 'lucide-react';
import { validateName, validatePhone, validateEmail } from '../utils/validate';

interface Step8ContactProps {
  initialName: string;
  onNext: (data: { name: string; phone: string; email: string; comment: string; consent: boolean }) => void;
  onBack?: () => void;
}

export function Step8Contact({ initialName, onNext, onBack }: Step8ContactProps) {
  const [data, setData] = useState({ name: initialName, phone: '', email: '', comment: '', consent: false });
  const [errors, setErrors] = useState<Partial<typeof data>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<typeof data> = {};
    if (!validateName(data.name)) newErrors.name = 'Введите ваше имя';
    if (!validatePhone(data.phone)) newErrors.phone = 'Введите корректный номер телефона';
    if (!validateEmail(data.email)) newErrors.email = 'Введите корректный email';
    if (!data.consent) newErrors.consent = true as any;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      onNext(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Как с вами связаться для отправки рекомендации?</h2>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="space-y-2">
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">Ваше имя *</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              id="contact-name" 
              name="name" 
              type="text" 
              autoComplete="name"
              value={data.name} 
              onChange={(e) => setData({ ...data, name: e.target.value })} 
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
            />
          </div>
          {errors.name && <p id="contact-name-error" className="text-sm text-red-600" role="alert">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700">Телефон *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              id="contact-phone" 
              name="phone" 
              type="tel" 
              autoComplete="tel"
              placeholder="+7 (999) 000-00-00" 
              value={data.phone} 
              onChange={(e) => setData({ ...data, phone: e.target.value })} 
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            />
          </div>
          {errors.phone && <p id="contact-phone-error" className="text-sm text-red-600" role="alert">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">Email для получения методички *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              id="contact-email" 
              name="email" 
              type="email" 
              autoComplete="email"
              placeholder="example@mail.ru" 
              value={data.email} 
              onChange={(e) => setData({ ...data, email: e.target.value })} 
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
            />
          </div>
          {errors.email && <p id="contact-email-error" className="text-sm text-red-600" role="alert">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-comment" className="block text-sm font-medium text-gray-700">Комментарий (по желанию)</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea 
              id="contact-comment" 
              name="comment" 
              rows={3} 
              value={data.comment} 
              onChange={(e) => setData({ ...data, comment: e.target.value })} 
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none" 
            />
          </div>
        </div>

        <div className="flex items-start">
          <input 
            type="checkbox" 
            id="contact-consent" 
            name="consent" 
            checked={data.consent} 
            onChange={(e) => setData({ ...data, consent: e.target.checked })} 
            className={`flex-shrink-0 h-6 w-6 rounded border transition-colors cursor-pointer ${data.consent ? 'bg-green-600 border-green-600' : 'border-gray-300 bg-white'} ${errors.consent ? 'ring-2 ring-red-500' : ''}`} 
            aria-invalid={!!errors.consent}
          />
          <label htmlFor="contact-consent" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
            Согласен на обработку персональных данных
          </label>
          {errors.consent && <p className="text-red-600 text-xs mt-1 ml-3" role="alert">Необходимо согласие</p>}
        </div>

        <div className="flex gap-3 mt-6 justify-center">
          {onBack && <button type="button" onClick={onBack} className="btn-secondary flex-1 max-w-xs flex items-center justify-center"><ArrowLeft className="mr-2 w-5 h-5" /> Назад</button>}
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 max-w-xs flex items-center justify-center font-bold uppercase">
            {isSubmitting ? <Loader className="w-5 h-5 animate-spin mr-2" /> : <ArrowRight className="ml-2 w-5 h-5" />}
            {isSubmitting ? 'ОТПРАВКА...' : 'ПОЛУЧИТЬ РЕКОМЕНДАЦИЮ'}
          </button>
        </div>
      </form>
    </div>
  );
}
