'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  csust1: string; csust2: string; csust3: string; csust4: string; csust5: string;
  csust6: string; csust7: string; csust8: string; csust9: string;
  [key: string]: string;
}

const supabase = createClient();

const EncuestaFrecuenciaConsumo: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    csust1: '', csust2: '', csust3: '', csust4: '', csust5: '',
    csust6: '', csust7: '', csust8: '', csust9: '',
  });

  // --- RECUPERAR DATOS ---
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

      const dataToSave = Object.keys(formData).reduce((acc, key) => {
        acc[key.toLowerCase()] = formData[key];
        return acc;
      }, {} as any);

      const { error } = await supabase
        .from('encuestas')
        .upsert({
          user_id: user.id,
          ...dataToSave,
          current_step: 10, // Siguiente paso
          updated_at: new Date(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      router.push('/auth/formulario-10');

    } catch (error: unknown) {
      console.error('Error al guardar sesión 9:', error);
      alert('Hubo un error al guardar la frecuencia de consumo.');
    } finally {
      setLoading(false);
    }
  };

  const frequencyOptions = [
    { value: '1', label: 'La semana pasada' },
    { value: '2', label: 'Último mes' },
    { value: '3', label: 'Último año' },
    { value: '4', label: 'Alguna vez en la vida' },
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white text-2xl">📅</div>
            <h1 className="text-3xl font-bold text-gray-800">Frecuencia de Consumo</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 9 de 11 • ¿Con qué frecuencia has consumido?</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="w-full bg-gray-100 h-2">
            <div className="bg-amber-600 h-2 w-[81%] transition-all duration-500"></div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-semibold">9. Frecuencia de Consumo de Sustancias</h2>
            <p className="opacity-90 mt-1">Indica la última vez que consumiste cada sustancia</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {substances.map((sub, index) => (
              <div key={sub.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-amber-200 transition-all">
                <p className="font-medium text-gray-800 mb-4">
                  {index + 1}. {sub.name}
                </p>
                <select
                  name={sub.id}
                  value={formData[sub.id]}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all appearance-none"
                  required
                >
                  <option value="">Selecciona la frecuencia</option>
                  {frequencyOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}

            <div className="pt-8">
              <button disabled={loading} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-5 rounded-2xl text-lg shadow-lg transition-all active:scale-[0.98]">
                {loading ? 'Guardando...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EncuestaFrecuenciaConsumo;