import { useState } from 'react';
import { ArrowRight, ArrowLeft, User, Ruler, Weight } from 'lucide-react';
import { validateName, validateAge, validateHeight, validateWeight } from '../utils/validate';

interface Step2PersonalInfoProps {
  onNext: (data: { name: string; age: string; height: string; weight: string }) => void;
  onBack?: () => void;
}

export function Step2PersonalInfo({ onNext, onBack }: Step2PersonalInfoProps) {
  const [data, setData] = useState({ name: '', age: '', height: '', weight: '' });
  const [errors, setErrors] = useState<Partial<typeof data>>({});

  const validate = (): boolean => {
    const newErrors: Partial<typeof data> = {};
    if (!validateName(data.name)) newErrors.name = 'Введите имя (минимум 2 символа)';
    if (!validateAge(data.age)) newErrors.age = 'Введите возраст (1-111 лет)';
    if (!validateHeight(data.height)) newErrors.height = 'Введите рост (3 цифры, см)';
    if (!validateWeight(data.weight)) newErrors.weight = 'Введите вес (2-3 цифры, кг)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext(data);
  };

  return (
    <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Расскажите немного о себе</h2>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="space-y-2">
          <label htmlFor="name-input" className="block text-sm font-medium text-gray-700">Ваше имя *</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              id="name-input" 
              name="name" 
              type="text" 
              autoComplete="name"
              placeholder="Иван Иванов" 
              value={data.name} 
              onChange={(e) => setData({ ...data, name: e.target.value })} 
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
          </div>
          {errors.name && <p id="name-error" className="text-sm text-red-600" role="alert">{errors.name}</p>}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="age-input" className="block text-sm font-medium text-gray-700">Возраст * (лет)</label>
            <div className="relative">
              <input 
                id="age-input" 
                name="age" 
                type="number" 
                autoComplete="age"
                placeholder="45" 
                min="1" 
                max="111" 
                value={data.age} 
                onChange={(e) => setData({ ...data, age: e.target.value })} 
                className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none ${errors.age ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
                aria-invalid={!!errors.age}
                aria-describedby={errors.age ? 'age-error' : undefined}
              />
            </div>
            {errors.age && <p id="age-error" className="text-sm text-red-600" role="alert">{errors.age}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="height-input" className="block text-sm font-medium text-gray-700">Рост * (см)</label>
            <div className="relative">
              <Ruler className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                id="height-input" 
                name="height" 
                type="text" 
                autoComplete="height"
                placeholder="175" 
                maxLength={3} 
                value={data.height} 
                onChange={(e) => setData({ ...data, height: e.target.value.replace(/\D/g, '') })} 
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none ${errors.height ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
                aria-invalid={!!errors.height}
                aria-describedby={errors.height ? 'height-error' : undefined}
              />
            </div>
            {errors.height && <p id="height-error" className="text-sm text-red-600" role="alert">{errors.height}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="weight-input" className="block text-sm font-medium text-gray-700">Вес * (кг)</label>
            <div className="relative">
              <Weight className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                id="weight-input" 
                name="weight" 
                type="text" 
                autoComplete="weight"
                placeholder="70" 
                maxLength={3} 
                value={data.weight} 
                onChange={(e) => setData({ ...data, weight: e.target.value.replace(/\D/g, '') })} 
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 outline-none ${errors.weight ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
                aria-invalid={!!errors.weight}
                aria-describedby={errors.weight ? 'weight-error' : undefined}
              />
            </div>
            {errors.weight && <p id="weight-error" className="text-sm text-red-600" role="alert">{errors.weight}</p>}
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-center">
          {onBack && <button type="button" onClick={onBack} className="btn-secondary flex-1 max-w-xs flex items-center justify-center"><ArrowLeft className="mr-2 w-5 h-5" /> Назад</button>}
          <button type="submit" className="btn-primary flex-1 max-w-xs flex items-center justify-center">Далее <ArrowRight className="ml-2 w-5 h-5" /></button>
        </div>
      </form>
    </div>
  );
}
