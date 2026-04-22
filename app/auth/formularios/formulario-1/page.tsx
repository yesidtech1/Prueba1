'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface FormData {
  sexo: string;
  edad: string;
  estrato: string;
  estado_civil: string;
  tiene_hijos: string;
  numero_hijos: string;
  universidad: string;
  carrera: string;
  semestre: string;
  creditos: string;
  materias: string;
  promedio_acumulado: string;
  trabaja_actual: string;
  tipo_vinculacion: string;
  condicion_permanente: string;
  [key: string]: string;
}

// const supabase = createClient();

const EncuestaDemografica: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    sexo: '', edad: '', estrato: '', estado_civil: '', tiene_hijos: '',
    numero_hijos: '', universidad: '', carrera: '', semestre: '',
    creditos: '', materias: '', promedio_acumulado: '', trabaja_actual: '',
    tipo_vinculacion: '', condicion_permanente: '',
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
          if (data[key] !== null && data[key] !== undefined) {
            savedData[key] = String(data[key]);
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
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión");

      const { data: currentRecord } = await supabase
        .from('encuestas')
        .select('current_step')
        .eq('user_id', user.id)
        .single();

      const nextStep = 2;
      const stepToSave = Math.max(currentRecord?.current_step || 0, nextStep);

      const { error } = await supabase
        .from('encuestas')
        .upsert({
          user_id: user.id,
          ...formData,
          current_step: stepToSave,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;
      router.push('/auth/formularios/formulario-2');

    } catch (error: any) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* === CONTENEDOR DE BARRA DE PROGRESO === */}
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Progreso de la encuesta</span>
            <span className="text-sm font-bold text-gray-500">9%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full transition-all duration-1000 ease-out"
              style={{ width: '9%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right font-medium">Estás en la sección 1 de 11</p>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl">📋</div>
            <h1 className="text-3xl font-bold text-gray-800">Encuesta Estudiantil</h1>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6 text-white">
            <h2 className="text-2xl font-semibold text-center uppercase tracking-tight">1. Información Personal y Académica</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">1. Sexo</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all" required>
                  <option value="">Seleccionar</option>
                  <option value="1">Hombre</option>
                  <option value="2">Mujer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">2. Edad (años cumplidos)</label>
                <input type="number" name="edad" value={formData.edad} onChange={handleChange} placeholder="Ej: 21" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-50 pt-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">3. Estrato socioeconómico</label>
                <select name="estrato" value={formData.estrato} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none" required>
                  <option value="">Seleccionar</option>
                  {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">4. Estado Civil</label>
                <select name="estado_civil" value={formData.estado_civil} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none" required>
                  <option value="">Seleccionar</option>
                  <option value="1">Soltero/a</option>
                  <option value="2">Casado/a</option>
                  <option value="3">Unión Libre</option>
                  <option value="4">Separado/a / Divorciado/a</option>
                  <option value="5">Viudo/a</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-50 pt-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">5. ¿Tienes hijos?</label>
                <select name="tiene_hijos" value={formData.tiene_hijos} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none" required>
                  <option value="">Seleccionar</option>
                  <option value="1">Sí</option>
                  <option value="2">No</option>
                </select>
              </div>
              {formData.tiene_hijos === '1' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">6. ¿Cuántos hijos?</label>
                  <select name="numero_hijos" value={formData.numero_hijos} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none" required>
                    <option value="">Seleccionar</option>
                    <option value="1">Uno</option>
                    <option value="2">Dos</option>
                    <option value="3">Tres</option>
                    <option value="4">Más de tres</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-50 pt-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">7. Universidad</label>
                <input type="text" name="universidad" value={formData.universidad} onChange={handleChange} placeholder="Nombre de tu universidad" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-200" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">8. Carrera</label>
                <input type="text" name="carrera" value={formData.carrera} onChange={handleChange} placeholder="Ej: Psicología" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-200" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">9. Semestre</label>
                <input type="number" name="semestre" value={formData.semestre} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">10. Créditos</label>
                <input type="number" name="creditos" value={formData.creditos} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">11. Materias</label>
                <input type="number" name="materias" value={formData.materias} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none" required />
              </div>
            </div>

            <div className="border-t border-gray-50 pt-8 text-center">
              <label className="block text-sm font-bold text-gray-700 mb-2">12. Promedio Acumulado</label>
              <input type="number" step="0.1" name="promedio_acumulado" value={formData.promedio_acumulado} onChange={handleChange} placeholder="Ej: 4.2" className="max-w-xs mx-auto w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-200 text-center text-xl font-bold" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-50 pt-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">13. ¿Trabajas actualmente?</label>
                <select name="trabaja_actual" value={formData.trabaja_actual} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none" required>
                  <option value="">Seleccionar</option>
                  <option value="1">Sí</option>
                  <option value="2">No</option>
                </select>
              </div>
              {formData.trabaja_actual === '1' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">14. Tipo de vinculación</label>
                  <select name="tipo_vinculacion" value={formData.tipo_vinculacion} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none" required>
                    <option value="">Seleccionar</option>
                    <option value="1">Fines de semana</option>
                    <option value="2">Por horas</option>
                    <option value="3">Medio tiempo</option>
                    <option value="4">Tiempo completo</option>
                  </select>
                </div>
              )}
            </div>

            <div className="border-t border-gray-50 pt-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">15. ¿Tienes alguna condición permanente?</label>
              <select name="condicion_permanente" value={formData.condicion_permanente} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-200 outline-none" required>
                <option value="">Seleccionar</option>
                <option value="1">Dificultad física y/o movilidad</option>
                <option value="2">Mudez o dificultad en el habla</option>
                <option value="3">Sordera o dificultad auditiva</option>
                <option value="4">Ceguera o dificultad visual</option>
                <option value="5">Ninguna</option>
              </select>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-5 rounded-2xl text-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50">
              {isSubmitting ? "Guardando..." : "Guardar y Continuar →"}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-400 text-xs uppercase tracking-widest">Sección 1 de 11</p>
      </div>
    </div>
  );
};

export default EncuestaDemografica;