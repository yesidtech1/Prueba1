'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  ctabaco1: string;
  ctabaco2: string;
  ctabaco3: string;
  ctabaco4: string;
  ctabaco5: string;
  ctabaco6: string;
  ctabaco7: string;
  [key: string]: string;
}

const supabase = createClient();

const EncuestaConsumoTabaco: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    ctabaco1: '',
    ctabaco2: '',
    ctabaco3: '',
    ctabaco4: '',
    ctabaco5: '',
    ctabaco6: '',
    ctabaco7: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
          current_step: 11,
          updated_at: new Date(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      router.push('/auth/formulario-11');

    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la sección de tabaco.');
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white text-2xl">🚬</div>
            <h1 className="text-3xl font-bold text-gray-800">Consumo de Tabaco</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 10 de 11 • Detalles sobre el consumo</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="w-full bg-gray-100 h-2">
            <div className="bg-sky-600 h-2 w-[90%] transition-all duration-500"></div>
          </div>
          <div className="bg-gradient-to-r from-sky-600 to-cyan-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-semibold">10. Detalles de Consumo</h2>
            <p className="opacity-90">Información sobre hábitos y entorno</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Pregunta 1 */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-lg font-medium text-gray-800 mb-4">1. ¿Usted fuma actualmente (último mes)?</label>
              <div className="flex gap-4">
                {['1', '2'].map((val) => (
                  <label key={val} className={`flex-1 py-4 rounded-xl border-2 text-center cursor-pointer transition-all font-bold ${
                    formData.ctabaco1 === val 
                      ? (val === '1' ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-emerald-600 bg-emerald-50 text-emerald-700')
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                    <input type="radio" name="ctabaco1" value={val} checked={formData.ctabaco1 === val} onChange={handleChange} className="hidden" required />
                    {val === '1' ? 'SÍ' : 'NO'}
                  </label>
                ))}
              </div>
            </div>

            {/* Bloque condicional si fuma */}
            {formData.ctabaco1 === '1' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-3">2. ¿Qué tipo de cigarrillo usa?</label>
                  <select name="ctabaco2" value={formData.ctabaco2} onChange={handleChange} className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-sky-200 outline-none" required>
                    <option value="">Seleccione tipo</option>
                    <option value="1">Tradicional</option>
                    <option value="2">Eléctrico</option>
                    <option value="3">Vapeador</option>
                    <option value="4">Oral (chicles/bandas nicotina)</option>
                    <option value="5">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-3">3. El primer consumo fue con:</label>
                  <select name="ctabaco3" value={formData.ctabaco3} onChange={handleChange} className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-sky-200 outline-none" required>
                    <option value="">Seleccione dispositivo inicial</option>
                    <option value="1">Tradicional</option>
                    <option value="2">Eléctrico</option>
                    <option value="3">Vapeador</option>
                    <option value="4">Oral</option>
                    <option value="5">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-3">4. ¿A qué edad comenzó el consumo?</label>
                  <input type="number" name="ctabaco4" value={formData.ctabaco4} onChange={handleChange} placeholder="Ej. 18" className="w-full px-5 py-4 border border-gray-200 rounded-2xl" required />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-800 mb-3">5. ¿Consumía tradicional antes del electrónico?</label>
                  <div className="flex gap-4">
                    {['1', '2'].map(v => (
                      <label key={v} className={`flex-1 py-3 rounded-xl border-2 text-center cursor-pointer ${formData.ctabaco5 === v ? 'border-sky-600 bg-sky-50' : 'bg-white border-gray-200'}`}>
                        <input type="radio" name="ctabaco5" value={v} onChange={handleChange} checked={formData.ctabaco5 === v} className="hidden" required />
                        {v === '1' ? 'Sí' : 'No'}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Entorno Social */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="block font-medium text-gray-800 mb-3 text-sm">6. ¿Familiar consume cigarrillo electrónico?</label>
                <div className="flex gap-3">
                  {['1', '2'].map(v => (
                    <label key={v} className={`flex-1 py-2 rounded-lg border-2 text-center cursor-pointer text-sm ${formData.ctabaco6 === v ? 'border-sky-600 bg-sky-50' : 'bg-white'}`}>
                      <input type="radio" name="ctabaco6" value={v} onChange={handleChange} checked={formData.ctabaco6 === v} className="hidden" required />
                      {v === '1' ? 'Sí' : 'No'}
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="block font-medium text-gray-800 mb-3 text-sm">7. ¿Amigo consume cigarrillo electrónico?</label>
                <div className="flex gap-3">
                  {['1', '2'].map(v => (
                    <label key={v} className={`flex-1 py-2 rounded-lg border-2 text-center cursor-pointer text-sm ${formData.ctabaco7 === v ? 'border-sky-600 bg-sky-50' : 'bg-white'}`}>
                      <input type="radio" name="ctabaco7" value={v} onChange={handleChange} checked={formData.ctabaco7 === v} className="hidden" required />
                      {v === '1' ? 'Sí' : 'No'}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-bold py-5 rounded-2xl text-xl shadow-lg transition-all active:scale-95">
              {loading ? 'Guardando...' : 'Guardar y Continuar →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EncuestaConsumoTabaco;