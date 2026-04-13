'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  resil1: string; resil2: string; resil3: string; resil4: string; resil5: string;
  resil6: string; resil7: string; resil8: string; resil9: string; resil10: string;
  resil11: string; resil12: string; resil13: string; resil14: string; resil15: string;
  resil16: string; resil17: string; resil18: string; resil19: string; resil20: string;
  resil21: string; resil22: string; resil23: string; resil24: string; resil25: string;
  [key: string]: string;
}

const supabase = createClient();

const EncuestaResiliencia: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    resil1: '', resil2: '', resil3: '', resil4: '', resil5: '',
    resil6: '', resil7: '', resil8: '', resil9: '', resil10: '',
    resil11: '', resil12: '', resil13: '', resil14: '', resil15: '',
    resil16: '', resil17: '', resil18: '', resil19: '', resil20: '',
    resil21: '', resil22: '', resil23: '', resil24: '', resil25: '',
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
        Object.keys(formData).forEach(key => {
          const dbKey = key.toLowerCase();
          if (data[dbKey]) savedData[key] = String(data[dbKey]);
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

      const dataToSave = Object.keys(formData).reduce((acc, key) => {
        acc[key.toLowerCase()] = formData[key];
        return acc;
      }, {} as any);

      const { error } = await supabase
        .from('encuestas')
        .upsert({
          user_id: user.id,
          ...dataToSave,
          current_step: 8,
          updated_at: new Date(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      router.push('/auth/formulario-8');

    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Error desconocido";
      console.error('Error:', msg);
      alert('Error al guardar la sección de resiliencia.');
    } finally {
      setLoading(false);
    }
  };

  const resilienceOptions = [
    { value: '1', label: 'Totalmente en desacuerdo' },
    { value: '2', label: 'Muy en desacuerdo' },
    { value: '3', label: 'En desacuerdo' },
    { value: '4', label: 'Ni de acuerdo ni en desacuerdo' },
    { value: '5', label: 'De acuerdo' },
    { value: '6', label: 'Muy de acuerdo' },
    { value: '7', label: 'Totalmente de acuerdo' },
  ];

  const questions = [
    { id: 'resil1', text: 'Cuando hago planes los llevo a cabo.' },
    { id: 'resil2', text: 'Usualmente me las arreglo de un modo o de otro.' },
    { id: 'resil3', text: 'Puedo depender de mí misma/o más que de otros.' },
    { id: 'resil4', text: 'Mantenerme interesada/o en las cosas es importante para mí.' },
    { id: 'resil5', text: 'Puedo valerme por mí misma/o si tengo que hacerlo.' },
    { id: 'resil6', text: 'Me siento orgullosa/o que he logrado cosas en mi vida.' },
    { id: 'resil7', text: 'Usualmente tomo las cosas como vienen.' },
    { id: 'resil8', text: 'Soy amiga/o de mí misma/o.' },
    { id: 'resil9', text: 'Siento que puedo manejar muchas cosas al mismo tiempo.' },
    { id: 'resil10', text: 'Soy determinada/o.' },
    { id: 'resil11', text: 'Raramente me pregunto cuál es el propósito de todo.' },
    { id: 'resil12', text: 'Tomo las cosas un día a la vez.' },
    { id: 'resil13', text: 'Puedo salir de tiempos difíciles porque he pasado por tiempos difíciles.' },
    { id: 'resil14', text: 'Soy disciplinada/o.' },
    { id: 'resil15', text: 'Mantengo interés en las cosas.' },
    { id: 'resil16', text: 'Usualmente puedo encontrar algo de que reírme.' },
    { id: 'resil17', text: 'Mi confianza en mí misma/o me hace salir de tiempos difíciles.' },
    { id: 'resil18', text: 'En una emergencia, soy alguien en quien la gente puede contar.' },
    { id: 'resil19', text: 'Usualmente puedo ver una situación de muchas maneras.' },
    { id: 'resil20', text: 'A veces me esfuerzo en hacer cosas quiera o no.' },
    { id: 'resil21', text: 'Mi vida tiene sentido.' },
    { id: 'resil22', text: 'No sigo pensando en cosas en que no puedo hacer nada.' },
    { id: 'resil23', text: 'Cuando estoy en una situación difícil, usualmente encuentro una salida.' },
    { id: 'resil24', text: 'Tengo suficiente energía para hacer lo que tengo que hacer.' },
    { id: 'resil25', text: 'Está bien si hay personas que no me quieren.' },
  ];

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl">💪</div>
            <h1 className="text-3xl font-bold text-gray-800">Escala de Resiliencia</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 7 de 11 • Evaluación de Resiliencia</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="w-full bg-gray-100 h-2">
            <div className="bg-emerald-600 h-2 w-[63%] transition-all duration-500"></div>
          </div>
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-semibold">7. Escala de Resiliencia</h2>
            <p className="opacity-90">Indica qué tan de acuerdo o en desacuerdo estás con cada afirmación</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b border-gray-100 pb-10 last:border-b-0 last:pb-0">
                <p className="text-lg font-medium text-gray-800 mb-6">{index + 1}. {q.text}</p>
                <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                  {resilienceOptions.map((opt) => (
                    <label key={opt.value} className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      formData[q.id] === opt.value ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input type="radio" name={q.id} value={opt.value} checked={formData[q.id] === opt.value} onChange={handleChange} className="hidden" required />
                      <span className="font-bold text-xl">{opt.value}</span>
                      <span className="text-[8px] uppercase text-center font-bold text-gray-400 leading-tight">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl text-xl shadow-lg transition-all">
              {loading ? 'Guardando...' : 'Guardar y Continuar →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EncuestaResiliencia;