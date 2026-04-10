'use client';

import React, { useState } from 'react';

interface FormData {
  ctabaco1: string;
  ctabaco2: string;
  ctabaco3: string;
  ctabaco4: string;
  ctabaco5: string;
  ctabaco6: string;
  ctabaco7: string;
}

const EncuestaConsumoTabaco: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    ctabaco1: '',
    ctabaco2: '',
    ctabaco3: '',
    ctabaco4: '',
    ctabaco5: '',
    ctabaco6: '',
    ctabaco7: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log('Consumo de Tabaco:', formData);
      setLoading(false);
      alert('¡Sección 10 - Consumo de Tabaco guardada correctamente! 🎉');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white text-2xl">🚬</div>
            <h1 className="text-3xl font-bold text-gray-800">Consumo de Tabaco</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 10 de 11 • Detalles sobre el consumo de tabaco</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-sky-600 to-cyan-600 px-8 py-6">
            <h2 className="text-white text-2xl font-semibold">10. Consumo de Tabaco</h2>
            <p className="text-sky-100 mt-1">Responde solo si consumes o has consumido tabaco</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Pregunta 1 */}
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-3">
                1. ¿Usted fuma actualmente (último mes)?
              </label>
              <div className="flex gap-6">
                <label className={`px-8 py-4 rounded-2xl border-2 cursor-pointer font-medium transition-all ${
                  formData.ctabaco1 === '1' ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input type="radio" name="ctabaco1" value="1" checked={formData.ctabaco1 === '1'} onChange={handleChange} className="hidden" />
                  Sí
                </label>
                <label className={`px-8 py-4 rounded-2xl border-2 cursor-pointer font-medium transition-all ${
                  formData.ctabaco1 === '2' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input type="radio" name="ctabaco1" value="2" checked={formData.ctabaco1 === '2'} onChange={handleChange} className="hidden" />
                  No
                </label>
              </div>
            </div>

            {/* Pregunta 2 - Solo si fuma */}
            {formData.ctabaco1 === '1' && (
              <>
                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-3">2. ¿Qué tipo de cigarrillo usa?</label>
                  <select name="ctabaco2" value={formData.ctabaco2} onChange={handleChange} className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-sky-500" required>
                    <option value="">Seleccione</option>
                    <option value="1">Tradicional</option>
                    <option value="2">Eléctrico</option>
                    <option value="3">Vapeador</option>
                    <option value="4">Oral (cicles o bandas de nicotina)</option>
                    <option value="5">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-3">3. El primer consumo de cigarrillo lo hizo con:</label>
                  <select name="ctabaco3" value={formData.ctabaco3} onChange={handleChange} className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-sky-500" required>
                    <option value="">Seleccione</option>
                    <option value="1">Tradicional</option>
                    <option value="2">Eléctrico</option>
                    <option value="3">Vapeador</option>
                    <option value="4">Oral</option>
                    <option value="5">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-3">4. ¿A qué edad comenzó el consumo?</label>
                  <input 
                    type="number" 
                    name="ctabaco4" 
                    value={formData.ctabaco4} 
                    onChange={handleChange}
                    placeholder="Edad aproximada" 
                    className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-sky-500" 
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-3">5. ¿Consumía cigarrillo tradicional antes de usar cigarrillo electrónico?</label>
                  <div className="flex gap-6">
                    <label className={`px-8 py-4 rounded-2xl border-2 cursor-pointer ${formData.ctabaco5 === '1' ? 'border-sky-600 bg-sky-50' : ''}`}>
                      <input type="radio" name="ctabaco5" value="1" onChange={handleChange} /> Sí
                    </label>
                    <label className={`px-8 py-4 rounded-2xl border-2 cursor-pointer ${formData.ctabaco5 === '2' ? 'border-sky-600 bg-sky-50' : ''}`}>
                      <input type="radio" name="ctabaco5" value="2" onChange={handleChange} /> No
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Preguntas sobre entorno */}
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-3">6. ¿Al menos un familiar consume cigarrillo electrónico?</label>
              <div className="flex gap-6">
                <label className={`px-8 py-4 rounded-2xl border-2 cursor-pointer ${formData.ctabaco6 === '1' ? 'border-sky-600 bg-sky-50' : ''}`}>
                  <input type="radio" name="ctabaco6" value="1" onChange={handleChange} /> Sí
                </label>
                <label className={`px-8 py-4 rounded-2xl border-2 cursor-pointer ${formData.ctabaco6 === '2' ? 'border-sky-600 bg-sky-50' : ''}`}>
                  <input type="radio" name="ctabaco6" value="2" onChange={handleChange} /> No
                </label>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-800 mb-3">7. ¿Al menos un amigo consume cigarrillo electrónico?</label>
              <div className="flex gap-6">
                <label className={`px-8 py-4 rounded-2xl border-2 cursor-pointer ${formData.ctabaco7 === '1' ? 'border-sky-600 bg-sky-50' : ''}`}>
                  <input type="radio" name="ctabaco7" value="1" onChange={handleChange} /> Sí
                </label>
                <label className={`px-8 py-4 rounded-2xl border-2 cursor-pointer ${formData.ctabaco7 === '2' ? 'border-sky-600 bg-sky-50' : ''}`}>
                  <input type="radio" name="ctabaco7" value="2" onChange={handleChange} /> No
                </label>
              </div>
            </div>

            {/* Botón Final */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 disabled:opacity-70 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg transition-all"
              >
                {loading ? 'Guardando...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Sección 10 de 11 • Consumo de Tabaco
        </p>
      </div>
    </div>
  );
};

export default EncuestaConsumoTabaco;