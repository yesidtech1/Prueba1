'use client';

import React, { useState } from 'react';

interface FormData {
  psd1: string; psd2: string; psd3: string; psd4: string; psd5: string;
  psd6: string; psd7: string; psd8: string; psd9: string; psd10: string;
  psd11: string; psd12: string; psd13: string; psd14: string; psd15: string;
  psd16: string; psd17: string; psd18: string; psd19: string; psd20: string;
}

const EncuestaSintomasDepresivos: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    psd1: '', psd2: '', psd3: '', psd4: '', psd5: '',
    psd6: '', psd7: '', psd8: '', psd9: '', psd10: '',
    psd11: '', psd12: '', psd13: '', psd14: '', psd15: '',
    psd16: '', psd17: '', psd18: '', psd19: '', psd20: '',
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
      console.log('Datos Síntomas Depresivos:', formData);
      setLoading(false);
      alert('¡Sección de Síntomas Depresivos guardada correctamente! 🎉');
    }, 1000);
  };

  const depressionOptions = [
    { value: '1', label: 'Nada o pocas veces' },
    { value: '2', label: 'Algunas veces' },
    { value: '3', label: 'Muchas veces' },
    { value: '4', label: 'La mayoría de las veces o siempre' },
  ];

  const questions = [
    { id: 'psd1', text: 'Me siento triste y deprimido.' },
    { id: 'psd2', text: 'Por las mañanas me siento mejor que por las tardes.' },
    { id: 'psd3', text: 'Frecuentemente tengo ganas de llorar y a veces lloro.' },
    { id: 'psd4', text: 'Me cuesta mucho dormir o duermo mal por la noche.' },
    { id: 'psd5', text: 'Ahora tengo tanto apetito como antes.' },
    { id: 'psd6', text: 'Todavía siento atracción por hombres o mujeres atractivos.' },
    { id: 'psd7', text: 'Creo que estoy adelgazando.' },
    { id: 'psd8', text: 'Tengo problemas de estreñimiento.' },
    { id: 'psd9', text: 'Mi corazón late más rápido de lo acostumbrado (taquicardia).' },
    { id: 'psd10', text: 'Me canso por cualquier cosa.' },
    { id: 'psd11', text: 'Mi mente está tan despierta como antes.' },
    { id: 'psd12', text: 'Hago las cosas con la misma facilidad de antes.' },
    { id: 'psd13', text: 'Me siento agitado e intranquilo y no puedo estar quieto.' },
    { id: 'psd14', text: 'Tengo esperanza y confianza en el futuro.' },
    { id: 'psd15', text: 'Me siento más irritable que habitualmente.' },
    { id: 'psd16', text: 'Encuentro fácil tomar decisiones.' },
    { id: 'psd17', text: 'Me creo útil y necesario para la gente.' },
    { id: 'psd18', text: 'Encuentro agradable vivir, mi vida es plena.' },
    { id: 'psd19', text: 'Creo que sería mejor para los demás si me muriera.' },
    { id: 'psd20', text: 'Me gustan las mismas cosas que habitualmente me agradaban.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white text-2xl">😔</div>
            <h1 className="text-3xl font-bold text-gray-800">Síntomas Depresivos</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 5 de 11 • Evaluación de Depresión</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6">
            <h2 className="text-white text-2xl font-semibold">5. Síntomas Depresivos (PSD)</h2>
            <p className="text-amber-100 mt-1">Según cómo te has sentido en las últimas dos semanas</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b border-gray-100 pb-10 last:border-b-0 last:pb-0">
                <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
                  {index + 1}. {q.text}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {depressionOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 text-center min-h-[110px] ${
                        formData[q.id as keyof FormData] === option.value
                          ? 'border-amber-600 bg-amber-50 shadow-sm'
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
                      <div className="text-sm text-gray-600 leading-tight text-center">{option.label}</div>
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
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-70 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg shadow-amber-500/30 transition-all duration-200"
              >
                {loading ? 'Guardando respuestas...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Sección 5 de 11 • Síntomas Depresivos
        </p>
      </div>
    </div>
  );
};

export default EncuestaSintomasDepresivos;