'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface FormData {
  csust1: string; csust2: string; csust3: string; csust4: string; csust5: string;
  csust6: string; csust7: string; csust8: string; csust9: string;
  [key: string]: string;
}

// const supabase = createClient();

const EncuestaFrecuenciaConsumo: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    csust1: '', csust2: '', csust3: '', csust4: '', csust5: '',
    csust6: '', csust7: '', csust8: '', csust9: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión no encontrada");

      const { data: currentRecord } = await supabase
        .from('encuestas')
        .select('current_step')
        .eq('user_id', user.id)
        .single();

      const nextStep = 10;
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
      router.push('/auth/formularios/formulario-10');

    } catch (error: any) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const frequencyOptions = [
    { value: '1', label: 'La semana pasada' },
    { value: '2', label: 'Último mes' },
    { value: '3', label: 'Último año' },
    { value: '4', label: 'Alguna vez en la vida' },
    { value: '5', label: 'Nunca he consumido' },
  ];

  const substances = [
    { id: 'csust1', name: 'Tabaco (cigarrillos, puros, etc.)' },
    { id: 'csust2', name: 'Bebidas alcohólicas' },
    { id: 'csust3', name: 'Cannabis (marihuana, mota, etc.)' },
    { id: 'csust4', name: 'Cocaína (coca, crack)' },
    { id: 'csust5', name: 'Estimulantes (speed, éxtasis, anfetaminas)' },
    { id: 'csust6', name: 'Inhalantes (pegamento, gasolina, etc.)' },
    { id: 'csust7', name: 'Sedantes o pastillas para dormir' },
    { id: 'csust8', name: 'Alucinógenos (LSD, hongos, ketamina)' },
    { id: 'csust9', name: 'Opiáceos (heroína, morfina, etc.)' },
  ];

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* === BARRA DE PROGRESO (81% para Sección 9) === */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-amber-600 uppercase tracking-wider">Progreso de la encuesta</span>
            <span className="text-sm font-bold text-gray-500">81%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-1000 ease-out"
              style={{ width: '81%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right font-medium">Sección 9 de 11 • Frecuencia de Consumo</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6 text-white text-center">
            <h2 className="text-2xl font-bold uppercase tracking-tight">9. Frecuencia de Consumo</h2>
            <p className="text-amber-100 text-sm mt-1 opacity-90">Indique la última vez que consumió cada sustancia</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {substances.map((sub, index) => (
                <div key={sub.id} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col justify-between hover:bg-white hover:shadow-md transition-all duration-300">
                  <p className="font-bold text-gray-800 mb-4 leading-tight">
                    <span className="text-amber-500 mr-2">{index + 1}.</span> {sub.name}
                  </p>
                  <div className="relative">
                    <select
                      name={sub.id}
                      value={formData[sub.id]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-50 transition-all appearance-none text-gray-700 font-medium cursor-pointer"
                      required
                    >
                      <option value="">Selecciona una opción...</option>
                      {frequencyOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-5 rounded-2xl text-xl shadow-xl shadow-amber-100 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Guardando respuestas...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-gray-400 text-xs uppercase tracking-widest">Siguiente: Formulario 10</p>
      </div>
    </div>
  );
};

export default EncuestaFrecuenciaConsumo;