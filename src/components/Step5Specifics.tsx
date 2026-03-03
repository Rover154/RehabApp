import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Step5SpecificsProps {
  conditions: string[];
  onNext: (data: { strokeSymptoms: string[]; heartAttackSymptoms: string[]; traumaArea: string; traumaOtherDetails: string }) => void;
  onBack?: () => void;
}

const strokeSymptoms = [
  'Слабость или неподвижность руки',
  'Слабость или неподвижность ноги',
  'Проблемы с равновесием / координацией',
  'Нарушения речи',
  'Проблемы с памятью / вниманием',
  'Головокружения',
  'Тревожность, страх повторного инсульта',
  'Общая слабость, утомляемость',
];

const heartAttackSymptoms = [
  'Одышка при небольшой нагрузке',
  'Страх физической активности',
  'Быстрая утомляемость',
  'Учащённое сердцебиение',
  'Тревожность, панические атаки',
  'Нарушения сна',
  'Повышенное давление',
  'Боли в груди при нагрузке',
];

const traumaAreas = [
  { id: 'arm', label: 'Рука / плечо' },
  { id: 'leg', label: 'Нога / колено / голеностоп' },
  { id: 'back', label: 'Спина / позвоночник' },
  { id: 'neck', label: 'Шея' },
  { id: 'hip', label: 'Тазобедренный сустав' },
  { id: 'other', label: 'Другое' },
];

export function Step5Specifics({ conditions, onNext, onBack }: Step5SpecificsProps) {
  const [strokeSymptomsSelected, setStrokeSymptomsSelected] = useState<string[]>([]);
  const [heartAttackSymptomsSelected, setHeartAttackSymptomsSelected] = useState<string[]>([]);
  const [traumaArea, setTraumaArea] = useState('');
  const [traumaOtherDetails, setTraumaOtherDetails] = useState('');

  const showStroke = conditions.includes('stroke');
  const showHeartAttack = conditions.includes('heart_attack');
  const showTrauma = conditions.includes('trauma');

  const toggleStroke = (s: string) => setStrokeSymptomsSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleHeartAttack = (s: string) => setHeartAttackSymptomsSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSubmit = () => {
    if (showStroke && strokeSymptomsSelected.length === 0) return;
    if (showHeartAttack && heartAttackSymptomsSelected.length === 0) return;
    if (showTrauma && !traumaArea) return;
    if (showTrauma && traumaArea === 'other' && !traumaOtherDetails.trim()) return;
    onNext({ strokeSymptoms: strokeSymptomsSelected, heartAttackSymptoms: heartAttackSymptomsSelected, traumaArea, traumaOtherDetails });
  };

  return (
    <div className="card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Что беспокоит сейчас?</h2>
      <p className="text-center text-gray-500 mb-6">Выберите все подходящие варианты</p>

      {showStroke && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">После инсульта:</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {strokeSymptoms.map(s => (
              <div key={s} onClick={() => toggleStroke(s)} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${strokeSymptomsSelected.includes(s) ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-500'}`}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${strokeSymptomsSelected.includes(s) ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
                  {strokeSymptomsSelected.includes(s) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-sm text-gray-700">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showHeartAttack && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">После инфаркта:</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {heartAttackSymptoms.map(s => (
              <div key={s} onClick={() => toggleHeartAttack(s)} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${heartAttackSymptomsSelected.includes(s) ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-500'}`}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${heartAttackSymptomsSelected.includes(s) ? 'border-green-600 bg-green-600' : 'border-gray-300'}`}>
                  {heartAttackSymptomsSelected.includes(s) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-sm text-gray-700">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showTrauma && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Область травмы:</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {traumaAreas.map(({ id, label }) => (
              <div key={id} onClick={() => setTraumaArea(id)} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${traumaArea === id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-500'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${traumaArea === id ? 'border-green-600' : 'border-gray-300'}`}>
                  {traumaArea === id && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                </div>
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            ))}
          </div>
          {traumaArea === 'other' && (
            <div className="mt-3">
              <label htmlFor="trauma-other" className="block text-sm font-medium text-gray-700 mb-2">Опишите область травмы *</label>
              <textarea 
                id="trauma-other" 
                name="traumaOtherDetails" 
                rows={2} 
                value={traumaOtherDetails} 
                onChange={(e) => setTraumaOtherDetails(e.target.value)} 
                className="input-field" 
                placeholder="Опишите область травмы *" 
                aria-required="true"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 mt-6 justify-center">
        {onBack && <button type="button" onClick={onBack} className="btn-secondary flex-1 max-w-xs flex items-center justify-center"><ArrowLeft className="mr-2 w-5 h-5 inline" /> Назад</button>}
        <button type="button" onClick={handleSubmit} className="btn-primary flex-1 max-w-xs flex items-center justify-center">Далее <ArrowRight className="ml-2 w-5 h-5 inline" /></button>
      </div>
    </div>
  );
}
