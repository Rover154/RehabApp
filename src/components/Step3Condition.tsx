import { useState } from 'react';
import { ArrowRight, ArrowLeft, Brain, Heart, Bandage, Pill } from 'lucide-react';

interface Step3ConditionProps {
  onNext: (conditions: string[], otherDetails: string) => void;
  onBack?: () => void;
}

const conditions = [
  { id: 'stroke', label: 'Инсульт', icon: Brain },
  { id: 'heart_attack', label: 'Инфаркт', icon: Heart },
  { id: 'trauma', label: 'Травма', icon: Bandage },
  { id: 'other', label: 'Другое', icon: Pill },
];

export function Step3Condition({ onNext, onBack }: Step3ConditionProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherDetails, setOtherDetails] = useState('');
  const showOtherInput = selected.includes('other');

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    if (showOtherInput && !otherDetails.trim()) return;
    onNext(selected, otherDetails);
  };

  return (
    <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Что произошло?</h2>
      <p className="text-center text-gray-500 mb-6">Можно выбрать несколько вариантов</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {conditions.map(({ id, label, icon: Icon }) => (
          <div key={id} onClick={() => toggle(id)} className={`option-card flex flex-col items-center justify-center min-h-[140px] ${selected.includes(id) ? 'selected' : ''}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${selected.includes(id) ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <Icon className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-gray-900 text-center">{label}</h3>
          </div>
        ))}
      </div>

      {showOtherInput && (
        <div className="mb-6">
          <label htmlFor="condition-other" className="block text-sm font-medium text-gray-700 mb-2">Опишите вашу ситуацию *</label>
          <textarea 
            id="condition-other" 
            name="otherDetails" 
            rows={3} 
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
        <button type="button" onClick={handleSubmit} disabled={selected.length === 0 || (showOtherInput && !otherDetails.trim())} className="btn-primary flex-1 max-w-xs flex items-center justify-center">Далее <ArrowRight className="ml-2 w-5 h-5 inline" /></button>
      </div>
    </div>
  );
}
