'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface FormData {
  psd1: string; psd2: string; psd3: string; psd4: string; psd5: string;
  psd6: string; psd7: string; psd8: string; psd9: string; psd10: string;
  psd11: string; psd12: string; psd13: string; psd14: string; psd15: string;
  psd16: string; psd17: string; psd18: string; psd19: string; psd20: string;
  [key: string]: string;
}

// const supabase = createClient();

const EncuestaSintomasDepresivos: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    psd1: '', psd2: '', psd3: '', psd4: '', psd5: '',
    psd6: '', psd7: '', psd8: '', psd9: '', psd10: '',
    psd11: '', psd12: '', psd13: '', psd14: '', psd15: '',
    psd16: '', psd17: '', psd18: '', psd19: '', psd20: '',
  });

  // --- LÓGICA DE RECUPERACIÓN DE PROGRESO ---
  useEffect(() => {
    const checkProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');

      const { data } = await supabase
        .from('encuestas')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        const savedData: any = {};
        Object.keys(formData).forEach(key => {
          const dbKey = key.toLowerCase();
          if (data[dbKey] !== null && data[dbKey] !== undefined) {
            savedData[key] = String(data[dbKey]);
          }
        });
        setFormData(prev => ({ ...prev, ...savedData }));
      }
      setIsChecking(false);
    };
    checkProgress();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión de usuario");

      // Consultar paso actual para no retroceder el progreso global
      const { data: currentRecord } = await supabase
        .from('encuestas')
        .select('current_step')
        .eq('user_id', user.id)
        .single();

      const nextStep = 6;
      const stepToSave = Math.max(currentRecord?.current_step || 0, nextStep);

      // Normalizamos las llaves a minúsculas para la base de datos
      const dataToSave = Object.keys(formData).reduce((acc, key) => {
        acc[key.toLowerCase()] = formData[key];
        return acc;
      }, {} as any);

      const { error } = await supabase
        .from('encuestas')
        .upsert({
          user_id: user.id,
          ...dataToSave,
          current_step: stepToSave,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      router.push('/auth/formularios/formulario-6');

    } catch (error: any) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const depressionOptions = [
    { value: '1', label: 'Nada o pocas veces' },
    { value: '2', label: 'Algunas veces' },
    { value: '3', label: 'Muchas veces' },
    { value: '4', label: 'La mayoría o siempre' },
  ];

  const questions = [
    { id: 'psd1', text: 'Me siento triste y deprimido.' },
    { id: 'psd2', text: 'Por las mañanas me siento mejor que por las tardes.' },
    { id: 'psd3', text: 'Frecuentemente tengo ganas de llorar y a veces lloro.' },
    { id: 'psd4', text: 'Me cuesta mucho dormir o duermo mal por la noche.' },
    { id: 'psd5', text: 'Ahora tengo tanto apetito como antes.' },
    { id: 'psd6', text: 'Todavía siento atracción por personas atractivas.' },
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

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* === BARRA DE PROGRESO (45% para Sección 5) === */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-amber-600 uppercase tracking-wider">Progreso de la encuesta</span>
            <span className="text-sm font-bold text-gray-500">45%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-1000 ease-out"
              style={{ width: '45%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right font-medium">Estás en la sección 5 de 11</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6 text-white text-center">
            <h2 className="text-2xl font-semibold uppercase tracking-tight">5. Síntomas Depresivos (PSD)</h2>
            <p className="text-amber-100 text-sm mt-1">Considera cómo te has sentido en las últimas dos semanas</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b border-gray-100 pb-10 last:border-0">
                <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-600 mr-3 text-sm font-bold">{index + 1}</span>
                  {q.text}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {depressionOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-95 text-center min-h-[100px] ${
                        formData[q.id] === opt.value 
                        ? 'border-amber-600 bg-amber-50 shadow-inner' 
                        : 'border-gray-50 bg-gray-50 hover:border-amber-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.value}
                        checked={formData[q.id] === opt.value}
                        onChange={handleChange}
                        className="hidden"
                        required
                      />
                      <span className={`text-xl font-black ${formData[q.id] === opt.value ? 'text-amber-700' : 'text-gray-300'}`}>
                        {opt.value}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-500 mt-1 leading-tight">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-5 rounded-2xl text-xl shadow-lg shadow-amber-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Guardando respuestas...' : 'Guardar y Continuar →'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-400 text-xs uppercase tracking-widest">Sección 5 de 11 • Escala PSD</p>
      </div>
    </div>
  );
};

export default EncuestaSintomasDepresivos;