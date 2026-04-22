'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface FormData {
  eplut1: string; eplut2: string; eplut3: string; eplut4: string; eplut5: string;
  eplut6: string; eplut7: string; eplut8: string; eplut9: string; eplut10: string;
  eplut11: string; eplut12: string; eplut13: string; eplut14: string; eplut15: string;
  [key: string]: string;
}

// const supabase = createClient();

const EncuestaPlutchick: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    eplut1: '', eplut2: '', eplut3: '', eplut4: '', eplut5: '',
    eplut6: '', eplut7: '', eplut8: '', eplut9: '', eplut10: '',
    eplut11: '', eplut12: '', eplut13: '', eplut14: '', eplut15: '',
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

      const { data: currentRecord } = await supabase
        .from('encuestas')
        .select('current_step')
        .eq('user_id', user.id)
        .single();

      const nextStep = 7;
      const stepToSave = Math.max(currentRecord?.current_step || 0, nextStep);

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
      router.push('/auth/formularios/formulario-7');

    } catch (error: any) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const questions = [
    { id: 'eplut1', text: '¿Toma de forma habitual algún medicamento como aspirinas o pastillas para dormir?' },
    { id: 'eplut2', text: '¿Tiene dificultades para conciliar el sueño?' },
    { id: 'eplut3', text: '¿A veces nota que podría perder el control sobre sí mismo/a?' },
    { id: 'eplut4', text: '¿Tiene poco interés en relacionarse con la gente?' },
    { id: 'eplut5', text: '¿Ve su futuro con más pesimismo que optimismo?' },
    { id: 'eplut6', text: '¿Se ha sentido alguna vez inútil o inservible?' },
    { id: 'eplut7', text: '¿Ve su futuro sin ninguna esperanza?' },
    { id: 'eplut8', text: '¿Se ha sentido alguna vez fracasado/a, que sólo quería meterse en la cama y abandonarlo todo?' },
    { id: 'eplut9', text: '¿Está deprimido/a ahora?' },
    { id: 'eplut10', text: '¿Está usted separado/a, divorciado/a o viudo/a?' },
    { id: 'eplut11', text: '¿Sabe si alguien de su familia ha intentado suicidarse alguna vez?' },
    { id: 'eplut12', text: '¿Alguna vez se ha sentido tan enfadado/a que habría sido capaz de matar a alguien?' },
    { id: 'eplut13', text: '¿Ha pensado alguna vez en suicidarse?' },
    { id: 'eplut14', text: '¿Le ha comentado a alguien, en alguna ocasión, que quería suicidarse?' },
    { id: 'eplut15', text: '¿Ha intentado alguna vez quitarse la vida?' },
  ];

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* === BARRA DE PROGRESO (54% para Sección 6) === */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-red-600 uppercase tracking-wider font-mono">Estado de Evaluación</span>
            <span className="text-sm font-bold text-gray-500">54%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-500 to-rose-500 h-full transition-all duration-1000 ease-out"
              style={{ width: '54%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right font-medium">Sección 6 de 11 • Plutchick</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 px-8 py-6 text-white text-center">
            <h2 className="text-2xl font-bold uppercase tracking-tight">6. Escala de Plutchick</h2>
            <p className="text-rose-100 text-sm mt-1 opacity-90">Responde con total sinceridad. Esta información es confidencial.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {questions.map((q, index) => (
              <div key={q.id} className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                <p className="flex-1 text-lg font-medium text-gray-800 leading-tight">
                  <span className="text-red-500 font-bold mr-2">{index + 1}.</span> {q.text}
                </p>
                <div className="flex gap-3">
                  <label className={`flex-1 md:flex-none px-10 py-3 rounded-xl border-2 cursor-pointer transition-all text-center font-bold ${
                    formData[q.id] === '1' ? 'border-red-600 bg-red-600 text-white shadow-lg' : 'border-gray-200 bg-white text-gray-400 hover:border-red-200'
                  }`}>
                    <input type="radio" name={q.id} value="1" checked={formData[q.id] === '1'} onChange={handleChange} className="hidden" required />
                    SÍ
                  </label>
                  <label className={`flex-1 md:flex-none px-10 py-3 rounded-xl border-2 cursor-pointer transition-all text-center font-bold ${
                    formData[q.id] === '2' ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg' : 'border-gray-200 bg-white text-gray-400 hover:border-emerald-200'
                  }`}>
                    <input type="radio" name={q.id} value="2" checked={formData[q.id] === '2'} onChange={handleChange} className="hidden" />
                    NO
                  </label>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-5 rounded-2xl text-xl shadow-xl shadow-red-200 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-gray-400 text-xs uppercase tracking-widest">Fin de la sección 6</p>
      </div>
    </div>
  );
};

export default EncuestaPlutchick;