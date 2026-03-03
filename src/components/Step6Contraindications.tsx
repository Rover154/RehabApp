import { useState } from 'react';
import { ArrowRight, ArrowLeft, Pill } from 'lucide-react';

interface Step6ContraindicationsProps {
  onNext: (conditions: string[], otherDetails: string) => void;
  onBack?: () => void;
}

const chronicDiseases = [
  { id: 'hypertension', label: 'Гипертония' },
  { id: 'asthma', label: 'Астма' },
  { id: 'diabetes', label: 'Диабет' },
  { id: 'other', label: 'Другое' },
];

export function Step6Contraindications({ onNext, onBack }: Step6ContraindicationsProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherDetails, setOtherDetails] = useState('');
  const showOtherInput = selected.includes('other');

  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSubmit = () => {
    if (showOtherInput && !otherDetails.trim()) return;
    onNext(selected, otherDetails);
  };

  return (
    <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Pill className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Хронические заболевания</h2>
      </div>
      <p className="text-center text-gray-500 mb-6">Выберите все подходящие варианты</p>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {chronicDiseases.map(({ id, label }) => (
          <div key={id} onClick={() => toggle(id)} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${selected.includes(id) ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-500'}`}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selected.includes(id) ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
              {selected.includes(id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-gray-700">{label}</span>
          </div>
        ))}
      </div>

      {showOtherInput && (
        <div className="mb-6">
          <label htmlFor="chronic-other" className="block text-sm font-medium text-gray-700 mb-2">Опишите заболевание *</label>
          <textarea 
            id="chronic-other" 
            name="otherDetails" 
            rows={2} 
            value={otherDetails} 
            onChange={(e) => setOtherDetails(e.target.value)} 
            className="input-field" 
            placeholder="Подробности..." 
            aria-required="true"
          />
        </div>
      )}

      <div className="flex gap-3 mt-6 justify-center">
        {onBack && <button type="button" onClick={onBack} className="btn-secondary flex-1 max-w-xs flex items-center justify-center"><ArrowLeft className="mr-2 w-5 h-5 inline" /> Назад</button>}
        <button type="button" onClick={handleSubmit} className="btn-primary flex-1 max-w-xs flex items-center justify-center">Далее <ArrowRight className="ml-2 w-5 h-5 inline" /></button>
      </div>
    </div>
  );
}
