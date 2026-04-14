'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  [key: string]: string;
}

const supabase = createClient();

const EncuestaSaludMental: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<FormData>({});

  const scaleOptions = [
    { value: '1', label: 'Siempre o casi siempre' },
    { value: '2', label: 'Con bastante frecuencia' },
    { value: '3', label: 'Algunas veces' },
    { value: '4', label: 'Nunca o casi nada' },
  ];

  const questions = [
    { id: 'pcsM1', text: 'A mí, me resulta especialmente difícil aceptar a los otros cuando tienen actitudes distintas a las mías.' },
    { id: 'pcsM2', text: 'Los problemas me bloquean fácilmente.' },
    { id: 'pcsM3', text: 'A mí, me resulta especialmente difícil escuchar a las personas que me cuentan sus problemas.' },
    { id: 'pcsM4', text: 'Me gusto como soy.' },
    { id: 'pcsM5', text: 'Soy capaz de controlarme cuando experimento emociones negativas.' },
    { id: 'pcsM6', text: 'Me siento a punto de explotar.' },
    { id: 'pcsM7', text: 'Para mí, la vida es aburrida y monótona.' },
    { id: 'pcsM8', text: 'A mí, me resulta especialmente difícil dar apoyo emocional.' },
    { id: 'pcsM9', text: 'Tengo dificultades para establecer relaciones interpersonales profundas y satisfactorias.' },
    { id: 'pcsM10', text: 'Me preocupa mucho lo que los demás piensan de mí.' },
    { id: 'pcsM11', text: 'Creo que tengo mucha capacidad para ponerme en el lugar de los demás y comprender sus respuestas.' },
    { id: 'pcsM12', text: 'Veo mi futuro con pesimismo.' },
    { id: 'pcsM13', text: 'Las opiniones de los demás me influyen mucho a la hora de tomar mis decisiones.' },
    { id: 'pcsM14', text: 'Me considero una persona menos importante que el resto de personas que me rodean.' },
    { id: 'pcsM15', text: 'Soy capaz de tomar decisiones por mí misma/o.' },
    { id: 'pcsM16', text: 'Intento sacar los aspectos positivos de las cosas malas que me suceden.' },
    { id: 'pcsM17', text: 'Intento mejorar como persona.' },
    { id: 'pcsM18', text: 'Me considero "un/a buen/a psicólogo/a".' },
    { id: 'pcsM19', text: 'Me preocupa que la gente me critique.' },
    { id: 'pcsM20', text: 'Creo que soy una persona sociable.' },
    { id: 'pcsM21', text: 'Soy capaz de controlarme cuando tengo pensamientos negativos.' },
    { id: 'pcsM22', text: 'Soy capaz de mantener un buen nivel de autocontrol en las situaciones conflictivas.' },
    { id: 'pcsM23', text: 'Pienso que soy una persona digna de confianza.' },
    { id: 'pcsM24', text: 'A mí, me resulta especialmente difícil entender los sentimientos de los demás.' },
    { id: 'pcsM25', text: 'Pienso en las necesidades de los demás.' },
    { id: 'pcsM26', text: 'Si estoy viviendo presiones exteriores desfavorables soy capaz de continuar manteniendo mi equilibrio personal.' },
    { id: 'pcsM27', text: 'Cuando hay cambios en mi entorno intento adaptarme.' },
    { id: 'pcsM28', text: 'Delante de un problema soy capaz de solicitar información.' },
    { id: 'pcsM29', text: 'Los cambios que ocurren en mi rutina habitual me estimulan.' },
    { id: 'pcsM30', text: 'Tengo dificultades para relacionarme abiertamente con mis profesores/jefes.' },
    { id: 'pcsM31', text: 'Creo que soy un/a inútil y no sirvo para nada.' },
    { id: 'pcsM32', text: 'Trato de desarrollar y potenciar mis buenas aptitudes.' },
    { id: 'pcsM33', text: 'Me resulta difícil tener opiniones personales.' },
    { id: 'pcsM34', text: 'Cuando tengo que tomar decisiones importantes me siento muy insegura/o.' },
    { id: 'pcsM35', text: 'Soy capaz de decir no cuando quiero decir no.' },
    { id: 'pcsM36', text: 'Cuando se me plantea un problema intento buscar posibles soluciones.' },
    { id: 'pcsM37', text: 'Me gusta ayudar a los demás.' },
    { id: 'pcsM38', text: 'Me siento insatisfecha/o conmigo misma/o.' },
    { id: 'pcsM39', text: 'Me siento insatisfecha/o de mi aspecto físico.' },
  ];

  useEffect(() => {
    const checkProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');

      const { data } = await supabase.from('encuestas').select('*').eq('user_id', user.id).single();

      if (data) {
        const savedData: any = {};
        questions.forEach(q => {
          const valueFromDB = data[q.id.toLowerCase()];
          if (valueFromDB !== undefined && valueFromDB !== null) {
            savedData[q.id] = String(valueFromDB);
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
      if (!user) throw new Error("No hay sesión");

      const { data: currentRecord } = await supabase
        .from('encuestas')
        .select('current_step')
        .eq('user_id', user.id)
        .single();

      const nextStep = 4;
      const stepToSave = Math.max(currentRecord?.current_step || 0, nextStep);

      const dataToSave: any = {
        user_id: user.id,
        current_step: stepToSave,
        updated_at: new Date(),
      };

      Object.keys(formData).forEach(key => {
        dataToSave[key] = formData[key];
      });

      const { error } = await supabase.from('encuestas').upsert(dataToSave, { onConflict: 'user_id' });

      if (error) throw error;
      router.push('/auth/formularios/formulario-4');
    } catch (error) {
      console.error(error);
      alert('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* === CONTENEDOR DE BARRA DE PROGRESO === */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-teal-600 uppercase tracking-wider">Progreso de la encuesta</span>
            <span className="text-sm font-bold text-gray-500">27%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-1000 ease-out"
              style={{ width: '27%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right font-medium">Estás en la sección 3 de 11</p>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white text-2xl">🧠</div>
            <h1 className="text-3xl font-bold text-gray-800">Salud Mental</h1>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-semibold">3. Condiciones de Salud Mental</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b border-gray-100 pb-10 last:border-0">
                <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-600 mr-3 text-sm font-bold">{index + 1}</span>
                  {q.text}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {scaleOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-95 ${
                        formData[q.id] === option.value ? 'border-teal-600 bg-teal-50 shadow-inner' : 'border-gray-200'
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
                      <span className={`text-xl font-bold ${formData[q.id] === option.value ? 'text-teal-700' : 'text-gray-400'}`}>
                        {option.value}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-500 text-center mt-1">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold py-5 rounded-2xl text-xl shadow-lg hover:scale-[1.01] transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar y Continuar →'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-400 text-xs uppercase tracking-widest">Sección 3 de 11</p>
      </div>
    </div>
  );
};

export default EncuestaSaludMental;