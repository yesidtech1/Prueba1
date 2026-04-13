'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  pff1: string;
  pff2: string;
  pff3: string;
  pff4: string;
  pff5: string;
  [key: string]: string;
}

const supabase = createClient();

const EncuestaFamiliar: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    pff1: '', pff2: '', pff3: '', pff4: '', pff5: '',
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
        .select('current_step, pff1, pff2, pff3, pff4, pff5')
        .eq('user_id', user.id)
        .single();

      // Redirección si ya va mucho más adelante (opcional)
      if (data && data.current_step > 2) {
        // Podrías dejar que edite, o mandarlo directo al paso actual:
        // router.push(`/auth/formulario-${data.current_step}`);
      }

      if (data) {
        const savedData: any = {};
        Object.keys(formData).forEach(key => {
          if (data[key]) savedData[key] = String(data[key]);
        });
        setFormData(prev => ({ ...prev, ...savedData }));
      }
      
      setIsChecking(false);
    };

    checkProgress();
  }, [router]);

  const questions = [
    { id: 'pff1', label: '1. ¿Estás satisfecho con la ayuda que recibes de tu familia cuando tienes algún problema?' },
    { id: 'pff2', label: '2. ¿Estás satisfecho con la forma en que tu familia conversa contigo y comparte tus problemas?' },
    { id: 'pff3', label: '3. ¿Estás satisfecho con la forma en que tu familia acepta y apoya tus deseos de realizar nuevas actividades o cambios en tu vida?' },
    { id: 'pff4', label: '4. ¿Estás satisfecho con la forma en que tu familia expresa afecto y responde a tus emociones (angustia, amor, rabia)?' },
    { id: 'pff5', label: '5. ¿Estás satisfecho con la forma en que tú y tu familia comparten el tiempo juntos?' },
  ];

  const options = [
    { value: '1', label: 'Nunca' },
    { value: '2', label: 'Casi nunca' },
    { value: '3', label: 'A veces' },
    { value: '4', label: 'Casi siempre' },
    { value: '5', label: 'Siempre' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión");

      const { error } = await supabase
        .from('encuestas')
        .upsert({
          user_id: user.id,
          ...formData,
          current_step: 3, // 👈 Marcamos que la siguiente es la 3
          updated_at: new Date(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      router.push('/auth/formulario-3');

    } catch (error: any) {
      console.error('Error:', error.message);
      alert('Error al guardar: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="w-full bg-gray-100 h-2">
            <div className="bg-violet-600 h-2 w-[18%] transition-all duration-500"></div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-6">
            <h2 className="text-white text-2xl font-semibold">Sección 2: Funcionamiento Familiar (APGAR)</h2>
            <p className="text-purple-100 text-sm mt-1">Evalúa tu percepción sobre tu entorno familiar.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {questions.map((q) => (
              <div key={q.id} className="space-y-4">
                <p className="text-gray-800 font-medium text-lg">{q.label}</p>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData[q.id] === opt.value
                          ? 'border-violet-600 bg-violet-50'
                          : 'border-gray-100 bg-gray-50 hover:border-violet-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.value}
                        checked={formData[q.id] === opt.value}
                        onChange={handleChange}
                        className="hidden"
                        required
                      />
                      <span className={`text-xl font-bold ${formData[q.id] === opt.value ? 'text-violet-600' : 'text-gray-400'}`}>
                        {opt.value}
                      </span>
                      <span className="text-xs text-center text-gray-500 mt-1">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg shadow-purple-500/30 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : "Guardar y Continuar →"}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-gray-500 text-sm mt-8">Sección 2 de 11 • APGAR Familiar</p>
      </div>
    </div>
  );
};

export default EncuestaFamiliar;