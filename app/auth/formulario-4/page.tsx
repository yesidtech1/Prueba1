'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  pzung1: string;
  pzung2: string;
  pzung3: string;
  pzung4: string;
  pzung5: string;
  pzung6: string;
  pzung7: string;
  pzung8: string;
  pzung9: string;
  pzung10: string;
  pzung11: string;
  pzung12: string;
  pzung13: string;
  pzung14: string;
  pzung15: string;
  pzung16: string;
  pzung17: string;
  pzung18: string;
  pzung19: string;
  pzung20: string;
}

const supabase = createClient();

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

  // --- LÓGICA DE RECUPERACIÓN DE PROGRESO ---
  useEffect(() => {
    const checkProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('encuestas')
        .select('current_step, pzung1, pzung2, pzung3, pzung4, pzung5, pzung6, pzung7, pzung8, pzung9, pzung10, pzung11, pzung12, pzung13, pzung14, pzung15, pzung16, pzung17, pzung18, pzung19, pzung20')
        .eq('user_id', user.id)
        .single();

      if (data && data.current_step > 4) {
        router.push(`/auth/formulario-${data.current_step}`);
        return;
      }

      if (data) {
        setFormData(prev => {
          const updated = { ...prev };
          const keys = Object.keys(prev) as Array<keyof FormData>;

          keys.forEach((key) => {
            const dbKey = key.toLowerCase() as keyof typeof data;
            const value = data[dbKey];
            if (value !== null && value !== undefined) {
              updated[key] = String(value);
            }
          });

          return updated;
        });
      }

      setIsChecking(false);
    };

    checkProgress();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as keyof FormData]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión activa");

      const dataToSave = Object.keys(formData).reduce((acc, key) => {
        acc[key.toLowerCase()] = formData[key as keyof FormData];
        return acc;
      }, {} as Record<string, string>);

      const { error } = await supabase
        .from('encuestas')
        .upsert({
          user_id: user.id,
          ...dataToSave,
          current_step: 5,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      router.push('/auth/formulario-5');

    } catch (error: any) {
      console.error(error);
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

  const questions: Array<{ id: keyof FormData; text: string }> = [
    { id: 'pzung1', text: 'Me siento más nervioso y ansioso que de costumbre.' },
    { id: 'pzung2', text: 'Me siento con temor sin razón.' },
    // ... (el resto de preguntas se mantienen igual)
    { id: 'pzung20', text: 'Tengo pesadillas.' },
  ];

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          
          {/* === BARRA DE PROGRESO === */}
          <div className="w-full bg-gray-100 h-2">
            <div className="bg-rose-600 h-2 w-[36%] transition-all duration-500"></div> {/* Ajusta el % según el paso */}
          </div>

          <div className="bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-6">
            <h2 className="text-white text-2xl font-semibold">4. Escala de Zung (Ansiedad)</h2>
            <p className="text-rose-100 mt-1">Según cómo te has sentido en la última semana</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b border-gray-100 pb-10 last:border-b-0 last:pb-0">
                <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
                  {index + 1}. {q.text}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {zungOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 text-center min-h-[110px] ${
                        formData[q.id] === option.value
                          ? 'border-rose-600 bg-rose-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={option.value}
                        checked={formData[q.id] === option.value}
                        onChange={handleChange}
                        className="hidden"
                        required
                      />
                      <div className="font-bold text-2xl text-gray-700 mb-1">{option.value}</div>
                      <div className="text-sm text-gray-600 leading-tight">{option.label}</div>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-70 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg shadow-rose-500/30 transition-all duration-200"
              >
                {loading ? 'Guardando respuestas...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">Sección 4 de 11 • Escala de Zung</p>
      </div>
    </div>
  );
};

export default EncuestaZung;