'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

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

// const supabase = createClient();

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

      const { data: currentRecord } = await supabase
        .from('encuestas')
        .select('current_step')
        .eq('user_id', user.id)
        .single();

      const nextStep = 11;
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
      router.push('/auth/formularios/formulario-11');

    } catch (error: any) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* === BARRA DE PROGRESO (90% para Sección 10) === */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-sky-600 uppercase tracking-wider">Progreso Final</span>
            <span className="text-sm font-bold text-gray-500">90%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-sky-500 to-cyan-500 h-full transition-all duration-1000 ease-out"
              style={{ width: '90%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right font-medium">Sección 10 de 11 • Detalles de Consumo</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-sky-600 to-cyan-600 px-8 py-6 text-white text-center">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white">10. Consumo de Tabaco y Dispositivos</h2>
            <p className="text-sky-100 text-sm mt-1 opacity-90">Hábitos, entorno y dispositivos electrónicos</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Pregunta 1: Filtro principal */}
            <div className="bg-gray-50 p-8 rounded-2xl border-2 border-dashed border-gray-200">
              <label className="block text-xl font-bold text-gray-800 mb-6 text-center">
                1. ¿Usted fuma actualmente (último mes)?
              </label>
              <div className="flex gap-4 max-w-md mx-auto">
                {[
                  { val: '1', label: 'SÍ', color: 'sky' },
                  { val: '2', label: 'NO', color: 'emerald' }
                ].map((item) => (
                  <label key={item.val} className={`flex-1 py-5 rounded-2xl border-2 text-center cursor-pointer transition-all font-black text-xl shadow-sm ${
                    formData.ctabaco1 === item.val 
                      ? (item.val === '1' ? 'border-sky-600 bg-sky-600 text-white shadow-sky-100' : 'border-emerald-600 bg-emerald-600 text-white shadow-emerald-100')
                      : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                  }`}>
                    <input type="radio" name="ctabaco1" value={item.val} checked={formData.ctabaco1 === item.val} onChange={handleChange} className="hidden" required />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Bloque condicional: Solo si fuma */}
            {formData.ctabaco1 === '1' && (
              <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">2. ¿Qué tipo de cigarrillo usa?</label>
                    <select name="ctabaco2" value={formData.ctabaco2} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium" required>
                      <option value="">Seleccione tipo...</option>
                      <option value="1">Tradicional (Combustión)</option>
                      <option value="2">Cigarrillo Electrónico</option>
                      <option value="3">Vapeador</option>
                      <option value="4">Sistemas Orales (Nicotina)</option>
                      <option value="5">Otro</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">3. El primer consumo fue con:</label>
                    <select name="ctabaco3" value={formData.ctabaco3} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-sky-100 outline-none transition-all font-medium" required>
                      <option value="">Seleccione dispositivo...</option>
                      <option value="1">Tradicional</option>
                      <option value="2">Cigarrillo Electrónico</option>
                      <option value="3">Vapeador</option>
                      <option value="4">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 ml-1">4. ¿A qué edad comenzó el consumo?</label>
                    <input type="number" name="ctabaco4" value={formData.ctabaco4} onChange={handleChange} placeholder="Ej. 18" min="5" max="99" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-sky-100 transition-all font-medium" required />
                  </div>

                  <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                    <label className="block text-xs font-black text-sky-800 uppercase mb-3 text-center">5. ¿Consumía tradicional antes del electrónico?</label>
                    <div className="flex gap-2">
                      {['1', '2'].map(v => (
                        <label key={v} className={`flex-1 py-2 rounded-xl border-2 text-center cursor-pointer font-bold text-sm transition-all ${formData.ctabaco5 === v ? 'border-sky-600 bg-white text-sky-700' : 'bg-transparent border-transparent text-gray-400'}`}>
                          <input type="radio" name="ctabaco5" value={v} onChange={handleChange} checked={formData.ctabaco5 === v} className="hidden" required />
                          {v === '1' ? 'SÍ' : 'NO'}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Entorno Social - Siempre visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                <label className="block font-bold text-gray-800 mb-4 leading-tight">6. ¿Algún familiar consume cigarrillo electrónico?</label>
                <div className="flex gap-3">
                  {['1', '2'].map(v => (
                    <label key={v} className={`flex-1 py-3 rounded-xl border-2 text-center cursor-pointer font-bold transition-all ${formData.ctabaco6 === v ? 'border-sky-600 bg-sky-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                      <input type="radio" name="ctabaco6" value={v} onChange={handleChange} checked={formData.ctabaco6 === v} className="hidden" required />
                      {v === '1' ? 'SÍ' : 'NO'}
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                <label className="block font-bold text-gray-800 mb-4 leading-tight">7. ¿Algún amigo consume cigarrillo electrónico?</label>
                <div className="flex gap-3">
                  {['1', '2'].map(v => (
                    <label key={v} className={`flex-1 py-3 rounded-xl border-2 text-center cursor-pointer font-bold transition-all ${formData.ctabaco7 === v ? 'border-sky-600 bg-sky-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                      <input type="radio" name="ctabaco7" value={v} onChange={handleChange} checked={formData.ctabaco7 === v} className="hidden" required />
                      {v === '1' ? 'SÍ' : 'NO'}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold py-5 rounded-2xl text-xl shadow-xl shadow-sky-100 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Siguiente Paso →'}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-gray-400 text-xs uppercase tracking-widest">¡Casi terminamos!</p>
      </div>
    </div>
  );
};

export default EncuestaConsumoTabaco;