'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  ptabaco1: string; ptabaco2: string; ptabaco3: string; ptabaco4: string; ptabaco5: string;
  ptabaco6: string; ptabaco7: string; ptabaco8: string; ptabaco9: string; ptabaco10: string;
  ptabaco11: string; ptabaco12: string; ptabaco13: string; ptabaco14: string;
  ptabaco15: string[]; 
  ptabaco16: string[]; 
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
          if (data[key] !== null && data[key] !== undefined) {
            if (key === 'ptabaco15' || key === 'ptabaco16') {
              // Manejo seguro de arrays desde JSON o String
              try {
                savedData[key] = Array.isArray(data[key]) ? data[key] : JSON.parse(data[key] || '[]');
              } catch { savedData[key] = []; }
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
          current_step: 12, 
          is_completed: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      router.push('/dashboard?finish=true');

    } catch (error: any) {
      alert('Error al finalizar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* === BARRA DE PROGRESO FINAL (100%) === */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-rose-600 uppercase tracking-wider">Última Etapa</span>
            <span className="text-sm font-bold text-gray-500">100%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-full w-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-6 text-white text-center">
            <h2 className="text-2xl font-bold uppercase tracking-tight">11. Percepción y Comportamiento</h2>
            <p className="text-rose-100 text-sm mt-1 opacity-90">Última sección del cuestionario</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Preguntas Sí/No (1-9) */}
            <div className="space-y-4">
              {[
                { id: 'ptabaco1', text: '1. ¿Ha fumado alguna vez por más de 6 meses en su vida?' },
                { id: 'ptabaco2', text: '2. ¿Ha fumado de manera continua durante los últimos 6 meses?' },
                { id: 'ptabaco3', text: '3. ¿Ha intentado dejar de fumar?' },
                { id: 'ptabaco4', text: '4. ¿Algún familiar o amigo le ha sugerido dejar de fumar?' },
                { id: 'ptabaco5', text: '5. ¿Algún profesional de la salud le ha sugerido dejar de fumar?' },
                { id: 'ptabaco6', text: '6. ¿Siente dificultad para dejar de fumar en lugares prohibidos?' },
                { id: 'ptabaco7', text: '7. ¿El consumo de tabaco le ha generado problemas de salud?' },
                { id: 'ptabaco8', text: '8. ¿Tiene dificultad para dejar de fumar incluso si está enfermo?' },
                { id: 'ptabaco9', text: '9. ¿Desearía dejar de fumar?' },
              ].map((q) => (
                <div key={q.id} className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-white transition-all">
                  <p className="text-gray-800 font-semibold flex-1 leading-tight">{q.text}</p>
                  <div className="flex gap-2">
                    {['1', '2'].map(v => (
                      <label key={v} className={`w-24 py-3 rounded-xl border-2 text-center cursor-pointer font-bold transition-all ${
                        formData[q.id] === v ? 'border-rose-600 bg-rose-600 text-white' : 'border-gray-200 bg-white text-gray-400'
                      }`}>
                        <input type="radio" name={q.id} value={v} onChange={handleChange} checked={formData[q.id] === v} className="hidden" required />
                        {v === '1' ? 'SÍ' : 'NO'}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Selectores (10-14) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              {[
                { id: 'ptabaco10', label: '10. ¿Hace cuánto empezó a fumar?', options: ['Menos de 1 año', '1-3 años', '3-5 años', 'Más de 5 años'] },
                { id: 'ptabaco11', label: '11. Tiempo máximo que ha fumado', options: ['1 año o menos', '1-5 años', 'Más de 5 años'] },
                { id: 'ptabaco12', label: '12. Cigarrillos en un día normal', options: ['10 o menos', '11 a 20', '21 a 30', '31 o más'] },
                { id: 'ptabaco13', label: '13. ¿Cómo suele fumar los cigarrillos?', options: ['Mantiene humo en la boca', 'Traga el humo', 'Aspira profundamente'] },
                { id: 'ptabaco14', label: '14. Tiempo al despertar para el primero', options: ['Alrededor de 5 min', '30 min a 1 hora', 'Más de 1 hora'] },
              ].map(s => (
                <div key={s.id} className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 ml-1">{s.label}</label>
                  <select name={s.id} value={formData[s.id]} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-50 outline-none font-medium text-gray-700" required>
                    <option value="">Seleccione...</option>
                    {s.options.map((opt, i) => <option key={i} value={String(i+1)}>{opt}</option>)}
                  </select>
                </div>
              ))}
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 ml-1">17. ¿A cuál odiaría más renunciar?</label>
                <select name="ptabaco17" value={formData.ptabaco17} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-50 outline-none font-medium text-gray-700" required>
                  <option value="">Seleccione...</option>
                  <option value="1">Al primero de la mañana</option>
                  <option value="2">Al que acompaña placer</option>
                  <option value="4">Al de después del almuerzo</option>
                  <option value="5">Al último de la noche</option>
                  <option value="6">Al que acompaña preocupaciones</option>
                </select>
              </div>
            </div>

            {/* Checkboxes Selección Múltiple (15-16) */}
            <div className="space-y-6 pt-6">
              {[
                { id: 'ptabaco15', label: '15. Debido a su forma de fumar ha experimentado:', options: ['Agitación extrema', 'Tos constante', 'Congestión', 'Enfermedad grave', 'Cambio en sabor de alimentos'] },
                { id: 'ptabaco16', label: '16. Al intentar dejar de fumar experimenta:', options: ['Irritabilidad', 'Dificultad concentración', 'Dolor de cabeza', 'Tensión o Ansiedad', 'Somnolencia', 'Ideas incontrolables'] }
              ].map((section) => (
                <div key={section.id} className="p-6 bg-rose-50/50 rounded-2xl border border-rose-100">
                  <p className="font-bold text-rose-900 mb-4">{section.label}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {section.options.map((opt, i) => (
                      <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        formData[section.id].includes(String(i+1)) ? 'bg-white border-rose-400 shadow-sm' : 'bg-transparent border-gray-100 hover:border-rose-200'
                      }`}>
                        <input 
                          type="checkbox" 
                          checked={formData[section.id].includes(String(i+1))} 
                          onChange={() => handleCheckboxChange(section.id as any, String(i+1))} 
                          className="w-5 h-5 accent-rose-600 rounded" 
                        />
                        <span className={`text-sm font-medium ${formData[section.id].includes(String(i+1)) ? 'text-rose-700' : 'text-gray-500'}`}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black py-6 rounded-2xl text-2xl shadow-2xl shadow-rose-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Procesando Finalización...' : '🚀 FINALIZAR Y ENVIAR ENCUESTA'}
              </button>
              <p className="text-center text-gray-400 text-xs mt-4 font-bold tracking-widest">SUS DATOS SERÁN GUARDADOS DE FORMA SEGURA</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EncuestaPercepcionTabaco;