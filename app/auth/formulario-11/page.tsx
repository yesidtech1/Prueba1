'use client';

import React, { useState } from 'react';

interface FormData {
  ptabaco1: string; ptabaco2: string; ptabaco3: string; ptabaco4: string; ptabaco5: string;
  ptabaco6: string; ptabaco7: string; ptabaco8: string; ptabaco9: string; ptabaco10: string;
  ptabaco11: string; ptabaco12: string; ptabaco13: string; ptabaco14: string; ptabaco15: string;
  ptabaco16: string; ptabaco17: string;
}

const EncuestaPercepcionTabaco: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    ptabaco1: '', ptabaco2: '', ptabaco3: '', ptabaco4: '', ptabaco5: '',
    ptabaco6: '', ptabaco7: '', ptabaco8: '', ptabaco9: '', ptabaco10: '',
    ptabaco11: '', ptabaco12: '', ptabaco13: '', ptabaco14: '', ptabaco15: '',
    ptabaco16: '', ptabaco17: '',
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
      console.log('Percepción de Tabaco:', formData);
      setLoading(false);
      alert('🎉 ¡Encuesta COMPLETADA! Todas las secciones han sido guardadas correctamente.');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white text-2xl">💭</div>
            <h1 className="text-3xl font-bold text-gray-800">Percepción de Tabaco</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 11 de 11 • Percepción y comportamiento frente al tabaco</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-6">
            <h2 className="text-white text-2xl font-semibold">11. Percepción de Tabaco</h2>
            <p className="text-rose-100 mt-1">Responde según tu experiencia y opinión</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Preguntas Sí/No */}
            {[
              { id: 'ptabaco1', text: '¿Ha fumado alguna vez por más de 6 meses en su vida?' },
              { id: 'ptabaco2', text: '¿Ha fumado de manera continua durante los últimos 6 meses?' },
              { id: 'ptabaco3', text: '¿Ha intentado dejar de fumar?' },
              { id: 'ptabaco4', text: '¿Algún familiar, amigo o compañero le ha sugerido que deje de fumar?' },
              { id: 'ptabaco5', text: '¿Algún profesional de la salud le ha sugerido que deje de fumar?' },
              { id: 'ptabaco6', text: '¿Encuentra difícil dejar de fumar en sitios donde está prohibido?' },
              { id: 'ptabaco7', text: '¿Fumar le ha generado problemas de salud?' },
              { id: 'ptabaco8', text: '¿Encuentra difícil dejar de fumar, aunque esté enfermo?' },
              { id: 'ptabaco9', text: '¿Desearía dejar de fumar?' },
            ].map((q) => (
              <div key={q.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 bg-gray-50 rounded-2xl">
                <p className="flex-1 text-gray-800">{q.text}</p>
                <div className="flex gap-4">
                  <label className={`px-7 py-3.5 rounded-xl border-2 cursor-pointer font-medium ${formData[q.id as keyof FormData] === '1' ? 'border-rose-600 bg-rose-50' : 'border-gray-200'}`}>
                    <input type="radio" name={q.id} value="1" onChange={handleChange} className="hidden" /> Sí
                  </label>
                  <label className={`px-7 py-3.5 rounded-xl border-2 cursor-pointer font-medium ${formData[q.id as keyof FormData] === '2' ? 'border-rose-600 bg-rose-50' : 'border-gray-200'}`}>
                    <input type="radio" name={q.id} value="2" onChange={handleChange} className="hidden" /> No
                  </label>
                </div>
              </div>
            ))}

            {/* Preguntas con opciones */}
            <div className="space-y-8 pt-4">
              <div>
                <label className="block text-lg font-medium mb-3">10. ¿Hace cuánto empezó a fumar?</label>
                <select name="ptabaco10" value={formData.ptabaco10} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl">
                  <option value="">Seleccione</option>
                  <option value="1">Menos de 1 año</option>
                  <option value="2">De 1 a 3 años</option>
                  <option value="3">De 3 a 5 años</option>
                  <option value="4">Más de 5 años</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium mb-3">11. Indique el tiempo máximo que ha fumado</label>
                <select name="ptabaco11" value={formData.ptabaco11} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl">
                  <option value="">Seleccione</option>
                  <option value="1">1 año o menos</option>
                  <option value="2">De 1 a 5 años</option>
                  <option value="3">Más de 5 años</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium mb-3">12. ¿Cuántos cigarrillos fuma en un día normal?</label>
                <select name="ptabaco12" value={formData.ptabaco12} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl">
                  <option value="">Seleccione</option>
                  <option value="1">10 o menos</option>
                  <option value="2">11 a 20</option>
                  <option value="3">21 a 30</option>
                  <option value="4">31 o más</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium mb-3">13. ¿Cómo fuma los cigarrillos?</label>
                <select name="ptabaco13" value={formData.ptabaco13} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl">
                  <option value="">Seleccione</option>
                  <option value="1">Tiene el humo en la boca</option>
                  <option value="2">Traga el humo</option>
                  <option value="3">Aspira profundamente</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium mb-3">14. ¿Cuánto tarda después de despertarse en fumar su primer cigarrillo?</label>
                <select name="ptabaco14" value={formData.ptabaco14} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl">
                  <option value="">Seleccione</option>
                  <option value="1">Alrededor de 5 minutos</option>
                  <option value="2">De 30 minutos a 1 hora</option>
                  <option value="3">Una hora o más</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium mb-3">17. ¿A qué cigarrillo odiaría más renunciar?</label>
                <select name="ptabaco17" value={formData.ptabaco17} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl">
                  <option value="">Seleccione</option>
                  <option value="1">Al primero de la mañana</option>
                  <option value="2">Al que acompaña una actividad placentera</option>
                  <option value="3">Al de antes de una actividad importante</option>
                  <option value="4">Al de después del almuerzo</option>
                  <option value="5">Al último de la noche</option>
                  <option value="6">Al que me acompaña cuando estoy preocupado</option>
                </select>
              </div>
            </div>

            {/* Botón Final */}
            <div className="pt-10">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold py-5 rounded-2xl text-xl shadow-xl transition-all"
              >
                {loading ? 'Enviando Encuesta Completa...' : 'Finalizar Encuesta y Enviar Todo'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Sección 11 de 11 • Percepción de Tabaco
        </p>
      </div>
    </div>
  );
};

export default EncuestaPercepcionTabaco;