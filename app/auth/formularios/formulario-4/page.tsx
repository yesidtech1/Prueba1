'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface FormData {
  pzung1: string; pzung2: string; pzung3: string; pzung4: string; pzung5: string;
  pzung6: string; pzung7: string; pzung8: string; pzung9: string; pzung10: string;
  pzung11: string; pzung12: string; pzung13: string; pzung14: string; pzung15: string;
  pzung16: string; pzung17: string; pzung18: string; pzung19: string; pzung20: string;
}

// const supabase = createClient();

const EncuestaZung: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    pzung1: '', pzung2: '', pzung3: '', pzung4: '', pzung5: '',
    pzung6: '', pzung7: '', pzung8: '', pzung9: '', pzung10: '',
    pzung11: '', pzung12: '', pzung13: '', pzung14: '', pzung15: '',
    pzung16: '', pzung17: '', pzung18: '', pzung19: '', pzung20: '',
  });

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
        const keys = Object.keys(formData);
        keys.forEach((key) => {
          const dbValue = data[key.toLowerCase()];
          if (dbValue !== null && dbValue !== undefined) {
            savedData[key] = String(dbValue);
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
      if (!user) throw new Error("No hay sesión activa");

      const { data: surveyData } = await supabase
        .from('encuestas')
        .select('current_step')
        .eq('user_id', user.id)
        .single();

      const nextStep = 5;
      const stepToSave = Math.max(surveyData?.current_step || 0, nextStep);

      const dataToSave: any = {
        user_id: user.id,
        current_step: stepToSave,
        updated_at: new Date().toISOString(),
      };

      Object.keys(formData).forEach(key => {
        dataToSave[key.toLowerCase()] = formData[key as keyof FormData];
      });

      const { error } = await supabase.from('encuestas').upsert(dataToSave, { onConflict: 'user_id' });
      if (error) throw error;
      router.push('/auth/formularios/formulario-5');
    } catch (error: any) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const zungOptions = [
    { value: '1', label: 'Nunca' },
    { value: '2', label: 'Casi nunca' },
    { value: '3', label: 'Casi siempre' },
    { value: '4', label: 'Siempre' },
  ];

  const questions = [
    { id: 'pzung1', text: 'Me siento más nervioso y ansioso que de costumbre.' },
    { id: 'pzung2', text: 'Me siento con temor sin razón.' },
    { id: 'pzung3', text: 'Despierto con facilidad o siento pánico.' },
    { id: 'pzung4', text: 'Me siento como si fuera a reventar y partirme en pedazos.' },
    { id: 'pzung5', text: 'Siento que todo está bien y que nada malo puede sucederme.' },
    { id: 'pzung6', text: 'Me tiemblan los brazos y las piernas.' },
    { id: 'pzung7', text: 'Me mortifican dolores de cabeza, cuello o cintura.' },
    { id: 'pzung8', text: 'Me siento débil y me canso fácilmente.' },
    { id: 'pzung9', text: 'Me siento tranquilo y puedo permanecer en calma fácilmente.' },
    { id: 'pzung10', text: 'Puedo sentir que me late muy rápido el corazón.' },
    { id: 'pzung11', text: 'Sufro de mareos.' },
    { id: 'pzung12', text: 'Sufro de desmayo o siento que me voy a desmayar.' },
    { id: 'pzung13', text: 'Puedo inspirar y expirar fácilmente.' },
    { id: 'pzung14', text: 'Se me adormecen o me hincan los dedos de las manos y pies.' },
    { id: 'pzung15', text: 'Sufro de molestias estomacales o indigestión.' },
    { id: 'pzung16', text: 'Orino con mucha frecuencia.' },
    { id: 'pzung17', text: 'Generalmente mis manos están secas y calientes.' },
    { id: 'pzung18', text: 'Siento bochornos.' },
    { id: 'pzung19', text: 'Me quedo dormido con facilidad y descanso bien durante la noche.' },
    { id: 'pzung20', text: 'Tengo pesadillas.' },
  ];

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-rose-50 py-12 px-4 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* === CONTENEDOR DE BARRA DE PROGRESO === */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-rose-600 uppercase tracking-wider">Progreso de la encuesta</span>
                <span className="text-sm font-bold text-gray-500">36%</span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-full transition-all duration-1000 ease-out"
                    style={{ width: '36%' }}
                ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right font-medium text-balance">Estás en la sección 4 de 11</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-semibold text-center uppercase tracking-tight">4. Escala de Zung (Ansiedad)</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b border-gray-100 pb-10 last:border-0">
                <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-600 mr-3 text-sm font-bold">{index + 1}</span>
                    {q.text}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {zungOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all active:scale-95 ${
                        formData[q.id as keyof FormData] === option.value 
                        ? 'border-rose-600 bg-rose-50 shadow-inner' 
                        : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={option.value}
                        checked={formData[q.id as keyof FormData] === option.value}
                        onChange={handleChange}
                        className="hidden"
                        required
                      />
                      <span className={`text-2xl font-black ${formData[q.id as keyof FormData] === option.value ? 'text-rose-700' : 'text-gray-300'}`}>
                        {option.value}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-500 text-center mt-1 leading-tight">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-5 rounded-2xl text-xl shadow-lg shadow-rose-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Guardando respuestas...' : 'Guardar y Continuar →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EncuestaZung;