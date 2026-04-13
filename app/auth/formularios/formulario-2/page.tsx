'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  pff1: string;
  pff2: string;
  pff3: string;
  pff4: string;
  pff5: string;
  current_step?: number;
  [key: string]: string | number | undefined;
}

const supabase = createClient();

const EncuestaFamiliar: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  const [formData, setFormData] = useState<FormData>({
    pff1: '', 
    pff2: '', 
    pff3: '', 
    pff4: '', 
    pff5: '',
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
        const savedData: Partial<FormData> = {};
        (['pff1', 'pff2', 'pff3', 'pff4', 'pff5'] as const).forEach((key) => {
          if (data[key] !== null && data[key] !== undefined) {
            savedData[key] = String(data[key]);
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
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión");

      // Consultar paso actual para no retroceder el progreso global
      const { data: currentRecord } = await supabase
        .from('encuestas')
        .select('current_step')
        .eq('user_id', user.id)
        .single();

      const nextStep = 3;
      const stepToSave = Math.max(currentRecord?.current_step || 0, nextStep);

      const { error } = await supabase
        .from('encuestas')
        .upsert({
          user_id: user.id,
          ...formData,
          current_step: stepToSave,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      router.push('/auth/formularios/formulario-3');

    } catch (error: any) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const questions = [
    { id: 'pff1', label: '1. ¿Estás satisfecho con la ayuda que recibes de tu familia cuando tienes algún problema?' },
    { id: 'pff2', label: '2. ¿Estás satisfecho con la forma en que tu familia conversa contigo y comparte tus problemas?' },
    { id: 'pff3', label: '3. ¿Estás satisfecho con la forma en que tu familia acepta y apoya tus deseos de realizar nuevas actividades o cambios en tu vida?' },
    { id: 'pff4', label: '4. ¿Estás satisfecho con la forma en que tu familia expresa afecto y responde a tus emociones (angustia, amor, rabia)?' },
    { id: 'pff5', label: '5. ¿Estás satisfecho con la forma en que tú y tu familia comparten el tiempo juntos?' },
  ];

  const options = [
    { value: '1', label: 'Nunca' },
    { value: '2', label: 'Casi nunca' },
    { value: '3', label: 'A veces' },
    { value: '4', label: 'Casi siempre' },
    { value: '5', label: 'Siempre' },
  ];

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 py-12 px-4 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* === CONTENEDOR DE BARRA DE PROGRESO === */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-violet-600 uppercase tracking-wider">Progreso de la encuesta</span>
            <span className="text-sm font-bold text-gray-500">18%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-violet-500 h-full transition-all duration-1000 ease-out"
              style={{ width: '18%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right font-medium">Estás en la sección 2 de 11</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-6 text-white text-center">
            <h2 className="text-2xl font-semibold uppercase tracking-tight">2. Funcionamiento Familiar (APGAR)</h2>
            <p className="text-purple-100 text-sm mt-1">Evalúa tu percepción sobre tu entorno familiar actual</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b border-gray-100 pb-10 last:border-0">
                <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-purple-600 mr-3 text-sm font-bold">{index + 1}</span>
                  {q.label.replace(/^\d+\.\s/, '')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-95 ${
                        formData[q.id] === opt.value 
                        ? 'border-violet-600 bg-violet-50 shadow-inner' 
                        : 'border-gray-50 bg-gray-50 hover:border-violet-200'
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
                      <span className={`text-xl font-black ${formData[q.id] === opt.value ? 'text-violet-700' : 'text-gray-300'}`}>
                        {opt.value}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-500 text-center mt-1 leading-tight">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold py-5 rounded-2xl text-xl shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando respuestas...' : 'Guardar y Continuar →'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-400 text-xs uppercase tracking-widest">Sección 2 de 11</p>
      </div>
    </div>
  );
};

export default EncuestaFamiliar;