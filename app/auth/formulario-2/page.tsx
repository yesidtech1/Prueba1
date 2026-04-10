'use client';

import React, { useState } from 'react';

interface FormData {
  pff1: string;
  pff2: string;
  pff3: string;
  pff4: string;
  pff5: string;
}

const EncuestaFuncionamientoFamiliar: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    pff1: '', pff2: '', pff3: '', pff4: '', pff5: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de guardado (luego lo conectaremos a Supabase)
    setTimeout(() => {
      console.log('Datos guardados:', formData);
      setSuccess(true);
      setLoading(false);
      
      alert('¡Sección guardada correctamente! 🎉');
    }, 800);
  };

  const options = [
    { value: '1', label: '1 - Nunca' },
    { value: '2', label: '2 - Muy rara vez' },
    { value: '3', label: '3 - Algunas veces' },
    { value: '4', label: '4 - Casi siempre' },
    { value: '5', label: '5 - Siempre' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">👨‍👩‍👧‍👦</div>
            <h1 className="text-3xl font-bold text-gray-800">Funcionamiento Familiar</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 2 de 11 • Valoración del Funcionamiento Familiar</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-6">
            <h2 className="text-white text-2xl font-semibold">2. Valoración de Funcionamiento Familiar</h2>
            <p className="text-purple-100 mt-1">Indica qué tan satisfecho/a estás con cada aspecto</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            
            {/* Pregunta 1 */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-800 leading-relaxed">
                A. Me satisface la ayuda que recibo de mi familia cuando tengo algún problema y/o necesidad.
              </label>
              <div className="grid grid-cols-5 gap-3">
                {options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${
                      formData.pff1 === opt.value 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pff1"
                      value={opt.value}
                      checked={formData.pff1 === opt.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="text-2xl font-bold text-gray-700">{opt.value}</span>
                    <span className="text-xs text-center text-gray-500 mt-1 leading-tight">{opt.label.split(' - ')[1]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pregunta 2 */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-800 leading-relaxed">
                B. Me satisface la participación que mi familia me brinda y permite.
              </label>
              <div className="grid grid-cols-5 gap-3">
                {options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${
                      formData.pff2 === opt.value 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pff2"
                      value={opt.value}
                      checked={formData.pff2 === opt.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="text-2xl font-bold text-gray-700">{opt.value}</span>
                    <span className="text-xs text-center text-gray-500 mt-1 leading-tight">{opt.label.split(' - ')[1]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pregunta 3 */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-800 leading-relaxed">
                C. Me satisface como mi familia acepta y apoya mis deseos de emprendimiento y nuevas actividades.
              </label>
              <div className="grid grid-cols-5 gap-3">
                {options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${
                      formData.pff3 === opt.value 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pff3"
                      value={opt.value}
                      checked={formData.pff3 === opt.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="text-2xl font-bold text-gray-700">{opt.value}</span>
                    <span className="text-xs text-center text-gray-500 mt-1 leading-tight">{opt.label.split(' - ')[1]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pregunta 4 */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-800 leading-relaxed">
                D. Me satisface como mi familia expresa afectos y responde a mis emociones (rabia, tristeza, amor).
              </label>
              <div className="grid grid-cols-5 gap-3">
                {options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${
                      formData.pff4 === opt.value 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pff4"
                      value={opt.value}
                      checked={formData.pff4 === opt.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="text-2xl font-bold text-gray-700">{opt.value}</span>
                    <span className="text-xs text-center text-gray-500 mt-1 leading-tight">{opt.label.split(' - ')[1]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pregunta 5 */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-800 leading-relaxed">
                E. Me satisface como compartimos en mi familia el tiempo para estudiar juntos, los espacios en la casa y el dinero.
              </label>
              <div className="grid grid-cols-5 gap-3">
                {options.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${
                      formData.pff5 === opt.value 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pff5"
                      value={opt.value}
                      checked={formData.pff5 === opt.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="text-2xl font-bold text-gray-700">{opt.value}</span>
                    <span className="text-xs text-center text-gray-500 mt-1 leading-tight">{opt.label.split(' - ')[1]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:opacity-70 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg shadow-purple-500/30 transition-all duration-200 active:scale-[0.98]"
              >
                {loading ? 'Guardando...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Sección 2 de 11 • Funcionamiento Familiar
        </p>
      </div>
    </div>
  );
};

export default EncuestaFuncionamientoFamiliar;