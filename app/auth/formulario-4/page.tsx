'use client';

import React, { useState } from 'react';

interface FormData {
  pzung1: string; pzung2: string; pzung3: string; pzung4: string; pzung5: string;
  pzung6: string; pzung7: string; pzung8: string; pzung9: string; pzung10: string;
  pzung11: string; pzung12: string; pzung13: string; pzung14: string; pzung15: string;
  pzung16: string; pzung17: string; pzung18: string; pzung19: string; pzung20: string;
}

const EncuestaZung: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    pzung1: '', pzung2: '', pzung3: '', pzung4: '', pzung5: '',
    pzung6: '', pzung7: '', pzung8: '', pzung9: '', pzung10: '',
    pzung11: '', pzung12: '', pzung13: '', pzung14: '', pzung15: '',
    pzung16: '', pzung17: '', pzung18: '', pzung19: '', pzung20: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log('Datos Escala de Zung:', formData);
      setLoading(false);
      alert('¡Escala de Zung guardada correctamente! 🎉');
    }, 1000);
  };

  const zungOptions = [
    { value: '1', label: 'Nunca' },
    { value: '2', label: 'Casi nunca' },
    { value: '3', label: 'Casi siempre' },
    { value: '4', label: 'Siempre' },
  ];

  const questions = [
    { id: 'pzung1', text: 'Me siento más nervioso y ansioso que de costumbre.' },
    { id: 'pzung2', text: 'Me siento con temor sin razón.' },
    { id: 'pzung3', text: 'Despierto con facilidad o siento pánico.' },
    { id: 'pzung4', text: 'Me siento como si fuera a reventar y partirme en pedazos.' },
    { id: 'pzung5', text: 'Siento que todo está bien y que nada malo puede sucederme.' },
    { id: 'pzung6', text: 'Me tiemblan los brazos y las piernas.' },
    { id: 'pzung7', text: 'Me mortifican dolores de cabeza, cuello o cintura.' },
    { id: 'pzung8', text: 'Me siento débil y me canso fácilmente.' },
    { id: 'pzung9', text: 'Me siento tranquilo y puedo permanecer en calma fácilmente.' },
    { id: 'pzung10', text: 'Puedo sentir que me late muy rápido el corazón.' },
    { id: 'pzung11', text: 'Sufro de mareos.' },
    { id: 'pzung12', text: 'Sufro de desmayo o siento que me voy a desmayar.' },
    { id: 'pzung13', text: 'Puedo inspirar y expirar fácilmente.' },
    { id: 'pzung14', text: 'Se me adormecen o me hincan los dedos de las manos y pies.' },
    { id: 'pzung15', text: 'Sufro de molestias estomacales o indigestión.' },
    { id: 'pzung16', text: 'Orino con mucha frecuencia.' },
    { id: 'pzung17', text: 'Generalmente mis manos están secas y calientes.' },
    { id: 'pzung18', text: 'Siento bochornos.' },
    { id: 'pzung19', text: 'Me quedo dormido con facilidad y descanso bien durante la noche.' },
    { id: 'pzung20', text: 'Tengo pesadillas.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white text-2xl">😟</div>
            <h1 className="text-3xl font-bold text-gray-800">Escala de Zung</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 4 de 11 • Ansiedad</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-6">
            <h2 className="text-white text-2xl font-semibold">4. Escala de Zung (Ansiedad)</h2>
            <p className="text-rose-100 mt-1">Según cómo te has sentido en la última semana</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b border-gray-100 pb-10 last:border-b-0 last:pb-0">
                <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
                  {index + 1}. {q.text}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {zungOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 text-center min-h-[110px] ${
                        formData[q.id as keyof FormData] === option.value
                          ? 'border-rose-600 bg-rose-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={option.value}
                        checked={formData[q.id as keyof FormData] === option.value}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className="font-bold text-2xl text-gray-700 mb-1">{option.value}</div>
                      <div className="text-sm text-gray-600 leading-tight">{option.label}</div>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-70 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg shadow-rose-500/30 transition-all duration-200"
              >
                {loading ? 'Guardando respuestas...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Sección 4 de 11 • Escala de Zung (Ansiedad)
        </p>
      </div>
    </div>
  );
};

export default EncuestaZung;