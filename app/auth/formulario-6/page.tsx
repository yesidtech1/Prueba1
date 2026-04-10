'use client';

import React, { useState } from 'react';

interface FormData {
  eplut1: string; eplut2: string; eplut3: string; eplut4: string; eplut5: string;
  eplut6: string; eplut7: string; eplut8: string; eplut9: string; eplut10: string;
  eplut11: string; eplut12: string; eplut13: string; eplut14: string; eplut15: string;
}

const EncuestaPlutchick: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    eplut1: '', eplut2: '', eplut3: '', eplut4: '', eplut5: '',
    eplut6: '', eplut7: '', eplut8: '', eplut9: '', eplut10: '',
    eplut11: '', eplut12: '', eplut13: '', eplut14: '', eplut15: '',
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
      console.log('Datos Escala de Plutchick:', formData);
      setLoading(false);
      alert('¡Escala de Plutchick guardada correctamente! 🎉');
    }, 1000);
  };

  const questions = [
    { id: 'eplut1', text: '¿Toma de forma habitual algún medicamento como aspirinas o pastillas para dormir?' },
    { id: 'eplut2', text: '¿Tiene dificultades para conciliar el sueño?' },
    { id: 'eplut3', text: '¿A veces nota que podría perder el control sobre sí mismo/a?' },
    { id: 'eplut4', text: '¿Tiene poco interés en relacionarse con la gente?' },
    { id: 'eplut5', text: '¿Ve su futuro con más pesimismo que optimismo?' },
    { id: 'eplut6', text: '¿Se ha sentido alguna vez inútil o inservible?' },
    { id: 'eplut7', text: '¿Ve su futuro sin ninguna esperanza?' },
    { id: 'eplut8', text: '¿Se ha sentido alguna vez fracasado/a, que sólo quería meterse en la cama y abandonarlo todo?' },
    { id: 'eplut9', text: '¿Está deprimido/a ahora?' },
    { id: 'eplut10', text: '¿Está usted separado/a, divorciado/a o viudo/a?' },
    { id: 'eplut11', text: '¿Sabe si alguien de su familia ha intentado suicidarse alguna vez?' },
    { id: 'eplut12', text: '¿Alguna vez se ha sentido tan enfadado/a que habría sido capaz de matar a alguien?' },
    { id: 'eplut13', text: '¿Ha pensado alguna vez en suicidarse?' },
    { id: 'eplut14', text: '¿Le ha comentado a alguien, en alguna ocasión, que quería suicidarse?' },
    { id: 'eplut15', text: '¿Ha intentado alguna vez quitarse la vida?' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white text-2xl">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-800">Escala de Plutchick</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 6 de 11 • Evaluación de Riesgo Suicida</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 px-8 py-6">
            <h2 className="text-white text-2xl font-semibold">6. Escala de Plutchick</h2>
            <p className="text-rose-100 mt-1">Responda Sí o No según corresponda</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {questions.map((q, index) => (
              <div key={q.id} className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
                <p className="flex-1 text-lg text-gray-800 leading-relaxed">
                  {index + 1}. {q.text}
                </p>
                
                <div className="flex gap-4">
                  <label className={`flex-1 md:flex-none px-8 py-4 rounded-2xl border-2 cursor-pointer transition-all text-center font-medium ${
                    formData[q.id as keyof FormData] === '1'
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name={q.id}
                      value="1"
                      checked={formData[q.id as keyof FormData] === '1'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    Sí
                  </label>

                  <label className={`flex-1 md:flex-none px-8 py-4 rounded-2xl border-2 cursor-pointer transition-all text-center font-medium ${
                    formData[q.id as keyof FormData] === '2'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name={q.id}
                      value="2"
                      checked={formData[q.id as keyof FormData] === '2'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    No
                  </label>
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-70 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg shadow-red-500/30 transition-all duration-200"
              >
                {loading ? 'Guardando respuestas...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Sección 6 de 11 • Escala de Plutchick
        </p>
      </div>
    </div>
  );
};

export default EncuestaPlutchick;