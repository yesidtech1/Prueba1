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
      if (!user) throw new Error("Sin sesión");

      const dataToSave = Object.keys(formData).reduce((acc, key) => {
        acc[key.toLowerCase()] = formData[key];
        return acc;
      }, {} as any);

      const { error } = await supabase
        .from('encuestas')
        .upsert({
          user_id: user.id,
          ...dataToSave,
          current_step: 9,
          updated_at: new Date(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      router.push('/auth/formulario-9');

    } catch (error: unknown) {
      console.error('Error:', error);
      alert('Error al guardar la sección de consumo.');
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
    { id: 'consum7', name: 'Sedantes o pastillas para dormir (diazepam, alprazolam, etc.)' },
    { id: 'consum8', name: 'Alucinógenos (LSD, hongos, ketamina)' },
    { id: 'consum9', name: 'Opiáceos (heroína, morfina, codeína, etc.)' },
  ];

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white text-2xl">🌿</div>
            <h1 className="text-3xl font-bold text-gray-800">Consumo de Sustancias</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 8 de 11 • Consumo de Sustancias Psicoactivas</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Barra de progreso al 72% */}
          <div className="w-full bg-gray-100 h-2">
            <div className="bg-violet-600 h-2 w-[72%] transition-all duration-500"></div>
          </div>
          
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-semibold">8. Consumo de Sustancias Psicoactivas</h2>
            <p className="opacity-90 mt-1">¿Ha consumido alguna vez las siguientes sustancias?</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {substances.map((sub, index) => (
              <div key={sub.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
                <p className="text-lg text-gray-800 flex-1">
                  {index + 1}. {sub.name}
                </p>
                
                <div className="flex gap-4">
                  <label className={`px-8 py-4 rounded-2xl border-2 cursor-pointer font-medium transition-all min-w-[100px] text-center ${
                    formData[sub.id] === '1' ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input type="radio" name={sub.id} value="1" checked={formData[sub.id] === '1'} onChange={handleChange} className="hidden" required />
                    Sí
                  </label>

                  <label className={`px-8 py-4 rounded-2xl border-2 cursor-pointer font-medium transition-all min-w-[100px] text-center ${
                    formData[sub.id] === '2' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input type="radio" name={sub.id} value="2" checked={formData[sub.id] === '2'} onChange={handleChange} className="hidden" />
                    No
                  </label>
                </div>
              </div>
            ))}

            <div className="pt-8">
              <button disabled={loading} className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-5 rounded-2xl text-lg shadow-lg transition-all active:scale-[0.98]">
                {loading ? 'Guardando...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EncuestaConsumoSustancias;