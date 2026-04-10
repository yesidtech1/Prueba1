'use client';

import React, { useState } from 'react';

interface FormData {
  csust1: string; csust2: string; csust3: string; csust4: string; csust5: string;
  csust6: string; csust7: string; csust8: string; csust9: string;
}

const EncuestaFrecuenciaConsumo: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    csust1: '', csust2: '', csust3: '', csust4: '', csust5: '',
    csust6: '', csust7: '', csust8: '', csust9: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log('Frecuencia de Consumo:', formData);
      setLoading(false);
      alert('¡Sección 9 guardada correctamente! 🎉');
    }, 1000);
  };

  const frequencyOptions = [
    { value: '1', label: 'La semana pasada' },
    { value: '2', label: 'Último mes' },
    { value: '3', label: 'Último año' },
    { value: '4', label: 'Alguna vez en la vida' },
  ];

  const substances = [
    { id: 'csust1', name: 'Tabaco (cigarrillos, puros, etc.)' },
    { id: 'csust2', name: 'Bebidas alcohólicas' },
    { id: 'csust3', name: 'Cannabis (marihuana, mota, etc.)' },
    { id: 'csust4', name: 'Cocaína (coca, crack)' },
    { id: 'csust5', name: 'Estimulantes (speed, éxtasis, anfetaminas)' },
    { id: 'csust6', name: 'Inhalantes (pegamento, gasolina, etc.)' },
    { id: 'csust7', name: 'Sedantes o pastillas para dormir' },
    { id: 'csust8', name: 'Alucinógenos (LSD, hongos, ketamina)' },
    { id: 'csust9', name: 'Opiáceos (heroína, morfina, etc.)' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white text-2xl">📅</div>
            <h1 className="text-3xl font-bold text-gray-800">Frecuencia de Consumo</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 9 de 11 • ¿Con qué frecuencia has consumido?</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6">
            <h2 className="text-white text-2xl font-semibold">9. Frecuencia de Consumo de Sustancias</h2>
            <p className="text-amber-100 mt-1">Solo para las sustancias que marcaste como `Si` anteriormente</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {substances.map((sub, index) => (
              <div key={sub.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="font-medium text-gray-800 mb-4">
                  {index + 1}. {sub.name}
                </p>
                
                <select
                  name={sub.id}
                  value={formData[sub.id as keyof FormData]}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                  required
                >
                  <option value="">Selecciona la frecuencia</option>
                  {frequencyOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-70 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg transition-all"
              >
                {loading ? 'Guardando...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Sección 9 de 11 • Frecuencia de Consumo
        </p>
      </div>
    </div>
  );
};

export default EncuestaFrecuenciaConsumo;