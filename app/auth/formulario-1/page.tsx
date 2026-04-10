'use client';

import React, { useState } from 'react';

interface FormData {
  sexo: string;
  edad: string;
  estrato: string;
  estadoCivil: string;
  tieneHijos: string;
  numeroHijos: string;
  universidad: string;
  carrera: string;
  semestre: string;
  creditos: string;
  materias: string;
  promedioAcumulado: string;
  trabajaActual: string;
  tipoVinculacion: string;
  condicionPermanente: string;
}

const EncuestaDemografica: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    sexo: '',
    edad: '',
    estrato: '',
    estadoCivil: '',
    tieneHijos: '',
    numeroHijos: '',
    universidad: '',
    carrera: '',
    semestre: '',
    creditos: '',
    materias: '',
    promedioAcumulado: '',
    trabajaActual: '',
    tipoVinculacion: '',
    condicionPermanente: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    alert('¡Formulario enviado correctamente!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl">📋</div>
            <h1 className="text-3xl font-bold text-gray-800">Encuesta Estudiantil</h1>
          </div>
          <p className="text-gray-600 text-lg">Datos Sociodemográficos y Perfil Académico</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6">
            <h2 className="text-white text-2xl font-semibold">Sección 1: Información Personal</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">1. Sexo</label>
                <select 
                  name="sexo" 
                  value={formData.sexo} 
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="1">Hombre</option>
                  <option value="2">Mujer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">2. Edad</label>
                <input 
                  type="number" 
                  name="edad" 
                  value={formData.edad} 
                  onChange={handleChange}
                  placeholder="Ej: 21"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  required 
                />
              </div>
            </div>

            {/* Estrato */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">3. Estrato socioeconómico</label>
              <input 
                type="number" 
                name="estrato" 
                value={formData.estrato} 
                onChange={handleChange}
                min="1" 
                max="6"
                placeholder="1 - 6"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                required 
              />
            </div>

            {/* Estado Civil */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">4. Estado Civil</label>
              <select 
                name="estadoCivil" 
                value={formData.estadoCivil} 
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                required
              >
                <option value="">Seleccionar</option>
                <option value="1">Soltero/a</option>
                <option value="2">Casado/a</option>
                <option value="3">Unión Libre</option>
                <option value="4">Separado/a</option>
                <option value="5">Viudo/a</option>
              </select>
            </div>

            {/* Hijos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">5. ¿Tienes hijos?</label>
                <select 
                  name="tieneHijos" 
                  value={formData.tieneHijos} 
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="1">Sí</option>
                  <option value="2">No</option>
                </select>
              </div>

              {formData.tieneHijos === '1' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">6. ¿Cuántos hijos?</label>
                  <select 
                    name="numeroHijos" 
                    value={formData.numeroHijos} 
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="1">Uno</option>
                    <option value="2">Dos</option>
                    <option value="3">Tres</option>
                    <option value="4">Más de tres</option>
                  </select>
                </div>
              )}
            </div>

            {/* Universidad y Carrera */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">7. Universidad</label>
                <input 
                  type="text" 
                  name="universidad" 
                  value={formData.universidad} 
                  onChange={handleChange}
                  placeholder="Nombre de tu universidad"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">8. Carrera</label>
                <input 
                  type="text" 
                  name="carrera" 
                  value={formData.carrera} 
                  onChange={handleChange}
                  placeholder="Ej: Psicología, Ingeniería..."
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">9. Semestre</label>
                <input 
                  type="text" 
                  name="semestre" 
                  value={formData.semestre} 
                  onChange={handleChange}
                  placeholder="5to"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Créditos</label>
                <input 
                  type="number" 
                  name="creditos" 
                  value={formData.creditos} 
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Materias</label>
                <input 
                  type="number" 
                  name="materias" 
                  value={formData.materias} 
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>
            </div>

            {/* Promedio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">11. Promedio Acumulado</label>
              <input 
                type="text" 
                name="promedioAcumulado" 
                value={formData.promedioAcumulado} 
                onChange={handleChange}
                placeholder="Ej: 4.35"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                required 
              />
            </div>

            {/* Trabajo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">12. ¿Trabajas actualmente?</label>
                <select 
                  name="trabajaActual" 
                  value={formData.trabajaActual} 
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="1">Sí</option>
                  <option value="2">No</option>
                </select>
              </div>

              {formData.trabajaActual === '1' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">13. Tipo de vinculación</label>
                  <select 
                    name="tipoVinculacion" 
                    value={formData.tipoVinculacion} 
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    required
                  >
                    <option value="">Seleccionar</option>
                    <option value="1">Fines de semana</option>
                    <option value="2">Por horas</option>
                    <option value="3">Medio tiempo</option>
                    <option value="4">Tiempo completo</option>
                  </select>
                </div>
              )}
            </div>

            {/* Condición Permanente */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">14. ¿Tienes alguna condición permanente?</label>
              <select 
                name="condicionPermanente" 
                value={formData.condicionPermanente} 
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                required
              >
                <option value="">Seleccionar</option>
                <option value="1">Dificultad física y/o movilidad</option>
                <option value="2">Mudez o dificultad en el habla</option>
                <option value="3">Sordera o dificultad auditiva</option>
                <option value="4">Ceguera o dificultad visual</option>
                <option value="5">Ninguna</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-4 rounded-2xl text-lg shadow-lg shadow-indigo-500/30 transition-all duration-200 active:scale-[0.98]"
              >
                Guardar y Continuar →
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Sección 1 de 11 • Datos Sociodemográficos
        </p>
      </div>
    </div>
  );
};

export default EncuestaDemografica;