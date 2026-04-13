'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  ptabaco1: string; ptabaco2: string; ptabaco3: string; ptabaco4: string; ptabaco5: string;
  ptabaco6: string; ptabaco7: string; ptabaco8: string; ptabaco9: string; ptabaco10: string;
  ptabaco11: string; ptabaco12: string; ptabaco13: string; ptabaco14: string;
  ptabaco15: string[]; // Selección múltiple
  ptabaco16: string[]; // Selección múltiple
  ptabaco17: string;
  [key: string]: any;
}

const supabase = createClient();

const EncuestaPercepcionTabaco: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    ptabaco1: '', ptabaco2: '', ptabaco3: '', ptabaco4: '', ptabaco5: '',
    ptabaco6: '', ptabaco7: '', ptabaco8: '', ptabaco9: '', ptabaco10: '',
    ptabaco11: '', ptabaco12: '', ptabaco13: '', ptabaco14: '',
    ptabaco15: [], ptabaco16: [], ptabaco17: '',
  });

  useEffect(() => {
    const checkProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');

      const { data } = await supabase.from('encuestas').select('*').eq('user_id', user.id).single();

      if (data) {
        const savedData: any = {};
        Object.keys(formData).forEach(key => {
          if (data[key]) {
            // Manejar arrays si vienen como string de la DB
            if (key === 'ptabaco15' || key === 'ptabaco16') {
              savedData[key] = Array.isArray(data[key]) ? data[key] : JSON.parse(data[key] || '[]');
            } else {
              savedData[key] = String(data[key]);
            }
          }
        });
        setFormData(prev => ({ ...prev, ...savedData }));
      }
      setIsChecking(false);
    };
    checkProgress();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (id: 'ptabaco15' | 'ptabaco16', value: string) => {
    setFormData(prev => {
      const current = prev[id] as string[];
      const next = current.includes(value) 
        ? current.filter(v => v !== value) 
        : [...current, value];
      return { ...prev, [id]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sin sesión");

      const { error } = await supabase
        .from('encuestas')
        .upsert({
          user_id: user.id,
          ...formData,
          ptabaco15: JSON.stringify(formData.ptabaco15),
          ptabaco16: JSON.stringify(formData.ptabaco16),
          current_step: 12, // 12 significará "Finalizado"
          is_completed: true,
          updated_at: new Date(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      alert('🎉 ¡Encuesta completada con éxito!');
      router.push('/dashboard'); // O una página de agradecimiento

    } catch (error) {
      console.error(error);
      alert('Error al finalizar la encuesta.');
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white text-2xl">💭</div>
            <h1 className="text-3xl font-bold text-gray-800">Percepción de Tabaco</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 11 de 11 • Finalización del proceso</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="w-full bg-gray-100 h-2"><div className="bg-rose-600 h-2 w-full"></div></div>
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-semibold">11. Percepción y Comportamiento</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Preguntas Binarias (1-9) */}
            {[
              { id: 'ptabaco1', text: '1. ¿Ha fumado alguna vez por más de 6 meses en su vida?' },
              { id: 'ptabaco2', text: '2. ¿Ha fumado de manera continua durante los últimos 6 meses?' },
              { id: 'ptabaco3', text: '3. ¿Ha intentado dejar de fumar?' },
              { id: 'ptabaco4', text: '4. ¿Familiar o amigo le ha sugerido dejar de fumar?' },
              { id: 'ptabaco5', text: '5. ¿Profesional de la salud le ha sugerido dejar de fumar?' },
              { id: 'ptabaco6', text: '6. ¿Dificultad para dejar de fumar donde está prohibido?' },
              { id: 'ptabaco7', text: '7. ¿Fumar le ha generado problemas de salud?' },
              { id: 'ptabaco8', text: '8. ¿Dificultad para dejar de fumar aunque esté enfermo?' },
              { id: 'ptabaco9', text: '9. ¿Desearía dejar de fumar?' },
            ].map((q) => (
              <div key={q.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-800 font-medium">{q.text}</p>
                <div className="flex gap-4">
                  {['1', '2'].map(v => (
                    <label key={v} className={`px-6 py-3 rounded-xl border-2 cursor-pointer transition-all ${formData[q.id] === v ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold' : 'border-gray-200 bg-white'}`}>
                      <input type="radio" name={q.id} value={v} onChange={handleChange} checked={formData[q.id] === v} className="hidden" required />
                      {v === '1' ? 'Sí' : 'No'}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Selects (10-14) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'ptabaco10', label: '10. ¿Hace cuánto empezó a fumar?', options: ['Menos de 1 año', '1-3 años', '3-5 años', 'Más de 5 años'] },
                { id: 'ptabaco11', label: '11. Tiempo máximo que ha fumado', options: ['1 año o menos', '1-5 años', 'Más de 5 años'] },
                { id: 'ptabaco12', label: '12. Cigarrillos en un día normal', options: ['10 o menos', '11 a 20', '21 a 30', '31 o más'] },
                { id: 'ptabaco13', label: '13. ¿Cómo fuma los cigarrillos?', options: ['Humo en la boca', 'Traga el humo', 'Aspira profundamente'] },
                { id: 'ptabaco14', label: '14. Tiempo al despertar para primer cigarrillo', options: ['Alrededor de 5 min', '30 min a 1 hora', '1 hora o más'] },
              ].map(s => (
                <div key={s.id}>
                  <label className="block text-gray-700 font-medium mb-2">{s.label}</label>
                  <select name={s.id} value={formData[s.id]} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-xl" required>
                    <option value="">Seleccione...</option>
                    {s.options.map((opt, i) => <option key={i} value={String(i+1)}>{opt}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* SELECCIÓN MÚLTIPLE (15 y 16) */}
            <div className="space-y-6">
              <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                <p className="font-bold text-gray-800 mb-4">15. Debido a su forma de fumar ha experimentado: (Múltiple)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Agitación extrema ante actividad física', 'Tos constante', 'Congestión', 'Enfermedad grave', 'Cambio en sabor de alimentos'
                  ].map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:bg-rose-100 transition-colors">
                      <input type="checkbox" checked={formData.ptabaco15.includes(String(i+1))} onChange={() => handleCheckboxChange('ptabaco15', String(i+1))} className="w-5 h-5 accent-rose-600" />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                <p className="font-bold text-gray-800 mb-4">16. Al dejar de fumar experimenta: (Múltiple)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Irritabilidad o impaciencia', 'Dificultad para concentrase', 'Dolor de cabeza', 'Tensión o ansiedad', 'Somnolencia', 'Ideas incontrolables'
                  ].map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:bg-rose-100 transition-colors">
                      <input type="checkbox" checked={formData.ptabaco16.includes(String(i+1))} onChange={() => handleCheckboxChange('ptabaco16', String(i+1))} className="w-5 h-5 accent-rose-600" />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Pregunta 17 */}
            <div>
              <label className="block text-lg font-medium mb-3">17. ¿A qué cigarrillo odiaría más renunciar?</label>
              <select name="ptabaco17" value={formData.ptabaco17} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-200 outline-none" required>
                <option value="">Seleccione...</option>
                <option value="1">Al primero de la mañana</option>
                <option value="2">Al que acompaña actividad placentera</option>
                <option value="3">Al de antes de actividad importante</option>
                <option value="4">Al de después del almuerzo</option>
                <option value="5">Al último de la noche</option>
                <option value="6">Al que acompaña cuando estoy preocupado</option>
              </select>
            </div>

            <button disabled={loading} className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-6 rounded-2xl text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
              {loading ? 'Finalizando...' : 'Finalizar Encuesta y Enviar Todo'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EncuestaPercepcionTabaco;