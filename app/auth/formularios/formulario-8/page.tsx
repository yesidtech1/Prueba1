'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  consum1: string; consum2: string; consum3: string; consum4: string; consum5: string;
  consum6: string; consum7: string; consum8: string; consum9: string;
  [key: string]: string;
}

const supabase = createClient();

const EncuestaConsumoSustancias: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    consum1: '', consum2: '', consum3: '', consum4: '', consum5: '',
    consum6: '', consum7: '', consum8: '', consum9: '',
  });

  // --- RECUPERAR DATOS PREVIOS ---
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
      if (!user) throw new Error("Sin sesión");

      const { data: currentRecord } = await supabase
        .from('encuestas')
        .select('current_step')
        .eq('user_id', user.id)
        .single();

      const nextStep = 9;
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
      router.push('/auth/formularios/formulario-9');

    } catch (error: any) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const substances = [
    { id: 'consum1', name: 'Tabaco (cigarrillos, puros, etc.)' },
    { id: 'consum2', name: 'Bebidas alcohólicas (cerveza, vino, licores)' },
    { id: 'consum3', name: 'Cannabis (marihuana, mota, hachís)' },
    { id: 'consum4', name: 'Cocaína (coca, crack)' },
    { id: 'consum5', name: 'Estimulantes (anfetaminas, éxtasis, speed)' },
    { id: 'consum6', name: 'Inhalantes (pegamento, gasolina, óxido nitroso)' },
    { id: 'consum7', name: 'Sedantes o pastillas para dormir (benzodiacepinas)' },
    { id: 'consum8', name: 'Alucinógenos (LSD, hongos, ketamina)' },
    { id: 'consum9', name: 'Opiáceos (heroína, morfina, codeína, etc.)' },
  ];

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* === BARRA DE PROGRESO (72% para Sección 8) === */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-violet-600 uppercase tracking-wider">Progreso de la encuesta</span>
            <span className="text-sm font-bold text-gray-500">72%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-violet-500 to-purple-500 h-full transition-all duration-1000 ease-out"
              style={{ width: '72%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right font-medium">Sección 8 de 11 • Consumo de Sustancias</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-6 text-white text-center">
            <h2 className="text-2xl font-bold uppercase tracking-tight">8. Consumo de Sustancias Psicoactivas</h2>
            <p className="text-violet-100 text-sm mt-1 opacity-90">Indique si ha consumido alguna vez las siguientes sustancias</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {substances.map((sub, index) => (
              <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                <p className="flex-1 text-lg font-medium text-gray-800 leading-tight">
                  <span className="text-violet-500 font-bold mr-2">{index + 1}.</span> {sub.name}
                </p>
                <div className="flex gap-3">
                  <label className={`flex-1 md:flex-none px-10 py-3 rounded-xl border-2 cursor-pointer transition-all text-center font-bold ${
                    formData[sub.id] === '1' ? 'border-violet-600 bg-violet-600 text-white shadow-lg' : 'border-gray-200 bg-white text-gray-400 hover:border-violet-200'
                  }`}>
                    <input type="radio" name={sub.id} value="1" checked={formData[sub.id] === '1'} onChange={handleChange} className="hidden" required />
                    SÍ
                  </label>
                  <label className={`flex-1 md:flex-none px-10 py-3 rounded-xl border-2 cursor-pointer transition-all text-center font-bold ${
                    formData[sub.id] === '2' ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg' : 'border-gray-200 bg-white text-gray-400 hover:border-emerald-200'
                  }`}>
                    <input type="radio" name={sub.id} value="2" checked={formData[sub.id] === '2'} onChange={handleChange} className="hidden" />
                    NO
                  </label>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-5 rounded-2xl text-xl shadow-xl shadow-violet-200 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-gray-400 text-xs uppercase tracking-widest">Siguiente: Sección 9</p>
      </div>
    </div>
  );
};

export default EncuestaConsumoSustancias;