'use client';

import React, { useState } from 'react';

interface FormData {
  pcsM1: string; pcsM2: string; pcsM3: string; pcsM4: string; pcsM5: string;
  pcsM6: string; pcsM7: string; pcsM8: string; pcsM9: string; pcsM10: string;
  pcsM11: string; pcsM12: string; pcsM13: string; pcsM14: string; pcsM15: string;
  pcsM16: string; pcsM17: string; pcsM18: string; pcsM19: string; pcsM20: string;
  pcsM21: string; pcsM22: string; pcsM23: string; pcsM24: string; pcsM25: string;
  pcsM26: string; pcsM27: string; pcsM28: string; pcsM29: string; pcsM30: string;
  pcsM31: string; pcsM32: string; pcsM33: string; pcsM34: string; pcsM35: string;
  pcsM36: string; pcsM37: string; pcsM38: string; pcsM39: string;
}

const EncuestaSaludMental: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    pcsM1: '', pcsM2: '', pcsM3: '', pcsM4: '', pcsM5: '',
    pcsM6: '', pcsM7: '', pcsM8: '', pcsM9: '', pcsM10: '',
    pcsM11: '', pcsM12: '', pcsM13: '', pcsM14: '', pcsM15: '',
    pcsM16: '', pcsM17: '', pcsM18: '', pcsM19: '', pcsM20: '',
    pcsM21: '', pcsM22: '', pcsM23: '', pcsM24: '', pcsM25: '',
    pcsM26: '', pcsM27: '', pcsM28: '', pcsM29: '', pcsM30: '',
    pcsM31: '', pcsM32: '', pcsM33: '', pcsM34: '', pcsM35: '',
    pcsM36: '', pcsM37: '', pcsM38: '', pcsM39: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log('Datos de Salud Mental:', formData);
      setLoading(false);
      alert('¡Sección de Salud Mental guardada correctamente! 🎉');
    }, 1000);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white text-2xl">🧠</div>
            <h1 className="text-3xl font-bold text-gray-800">Salud Mental</h1>
          </div>
          <p className="text-gray-600 text-lg">Sección 3 de 11 • Condiciones de Salud Mental</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6">
            <h2 className="text-white text-2xl font-semibold">3. Condiciones de Salud Mental</h2>
            <p className="text-teal-100 mt-1">Selecciona la opción que mejor describe tu forma de pensar, sentir o actuar</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-12">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b border-gray-100 pb-10 last:border-b-0 last:pb-0">
                <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
                  {index + 1}. {q.text}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {scaleOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center justify-center p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 text-center ${
                        formData[q.id as keyof FormData] === option.value
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={option.value}
                        checked={formData[q.id as keyof FormData] === option.value}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div>
                        <div className="font-bold text-xl text-gray-700">{option.value}</div>
                        <div className="text-xs text-gray-500 mt-1 leading-tight">{option.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:opacity-70 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg shadow-teal-500/30 transition-all duration-200"
              >
                {loading ? 'Guardando respuestas...' : 'Guardar y Continuar →'}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Sección 3 de 11 • Salud Mental (PCSM)
        </p>
      </div>
    </div>
  );
};

export default EncuestaSaludMental;