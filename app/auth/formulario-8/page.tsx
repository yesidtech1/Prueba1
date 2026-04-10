'use client';

import React, { useState } from 'react';

interface FormData {
  consum1: string; consum2: string; consum3: string; consum4: string; consum5: string;
  consum6: string; consum7: string; consum8: string; consum9: string;
}

const EncuestaConsumoSustancias: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    consum1: '', consum2: '', consum3: '', consum4: '', consum5: '',
    consum6: '', consum7: '', consum8: '', consum9: '',
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
      console.log('Consumo de Sustancias:', formData);
      setLoading(false);
      alert('¡Sección de Consumo de Sustancias guardada correctamente! 🎉');
    }, 1000);
  };

  const substances = [
    { id: 'consum1', name: 'Tabaco (cigarrillos, puros, etc.)' },
    { id: 'consum2', name: 'Bebidas alcohólicas (cerveza, vino, licores)' },
    { id: 'consum3', name: 'Cannabis (marihuana, mota, hachís)' },
    { id: 'consum4', name: 'Cocaína (coca, crack)' },
    { id: 'consum5', name: 'Estimulantes (anfetaminas, éxtasis, speed)' },
    { id: 'consum6', name: 'Inhalantes (pegamento, gasolina, óxido nitroso)' },
    { id: 'consum7', name: 'Sedantes o pastillas para dormir (diazepam, alprazolam, etc.)' },
    { id: 'consum8', name: 'Alucinógenos (LSD, hongos, ketamina)' },
    { id: 'consum9', name: 'Opiáceos (heroína, morfina, codeína, etc.)' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white text-2xl">🌿</div>
            <h1 className="text-3xl font-bold text-gray-800">Consumo de Sustancias</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 8 de 11 • Consumo de Sustancias Psicoactivas</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-6">
            <h2 className="text-white text-2xl font-semibold">8. Consumo de Sustancias Psicoactivas</h2>
            <p className="text-violet-100 mt-1">¿Ha consumido alguna vez las siguientes sustancias?</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {substances.map((sub, index) => (
              <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
                <p className="text-lg text-gray-800 flex-1">
                  {index + 1}. {sub.name}
                </p>
                
                <div className="flex gap-6">
                  <label className={`px-8 py-4 rounded-2xl border-2 cursor-pointer font-medium transition-all ${
                    formData[sub.id as keyof FormData] === '1' 
                      ? 'border-violet-600 bg-violet-50 text-violet-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name={sub.id}
                      value="1"
                      checked={formData[sub.id as keyof FormData] === '1'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    Sí
                  </label>

                  <label className={`px-8 py-4 rounded-2xl border-2 cursor-pointer font-medium transition-all ${
                    formData[sub.id as keyof FormData] === '2' 
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name={sub.id}
                      value="2"
                      checked={formData[sub.id as keyof FormData] === '2'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    No
                  </label>
                </div>
              </div>
            ))}

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg transition-all"
              >
                {loading ? 'Guardando...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Sección 8 de 11 • Consumo de Sustancias Psicoactivas
        </p>
      </div>
    </div>
  );
};

export default EncuestaConsumoSustancias;