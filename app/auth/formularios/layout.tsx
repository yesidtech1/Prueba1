"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Home, LogOut } from "lucide-react"; // Importamos iconos

const supabase = createClient();

export default function FormLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [maxStep, setMaxStep] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const currentStep = parseInt(pathname.split('-').pop() || '0');

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('encuestas')
          .select('current_step, is_completed')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setMaxStep(data.is_completed ? 11 : data.current_step);
        }
      }
      setLoading(false);
    };
    checkStatus();
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const prevRoute = `/auth/formularios/formulario-${currentStep - 1}`;
  const nextRoute = `/auth/formularios/formulario-${currentStep + 1}`;

  const canGoForward = currentStep < maxStep;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* HEADER / NAVBAR */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="font-bold text-gray-700 hidden sm:inline">Encuesta de Salud</span>
          </div>

          {/* ✅ BOTÓN VOLVER AL INICIO */}
          <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" /> {/* Separador visual */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
          >
            <Home className="h-4 w-4" />
            <span className="text-sm hidden md:inline">Inicio</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-600 font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          <span className="text-sm">Cerrar Sesión</span>
          <LogOut className="h-4 w-4" />
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow py-10 mb-20"> {/* mb-20 para que el contenido no quede oculto tras la barra inferior */}
        {children}
      </main>

      {/* BARRA DE NAVEGACIÓN INFERIOR */}
      {currentStep > 0 && !loading && (
        <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            
            {/* Botón ATRÁS */}
            {currentStep > 1 ? (
              <button
                onClick={() => router.push(prevRoute)}
                className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all"
              >
                ← Anterior
              </button>
            ) : <div />}

            {/* Botón ADELANTE DINÁMICO */}
            {canGoForward ? (
              <button
                onClick={() => router.push(nextRoute)}
                className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all active:scale-95"
              >
                Siguiente →
              </button>
            ) : (
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-4">
                Guarda para habilitar siguiente
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}