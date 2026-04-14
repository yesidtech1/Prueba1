import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BarChart3, ArrowRight, ClipboardList } from "lucide-react";

// 1. Componente de Acciones del Usuario (Bienvenida + Accesos Directos)
async function UserActions() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Paciente";

  if (!user) {
    return (
      <p className="text-xl font-light text-blue-600 dark:text-blue-500 italic">
        Exámenes Médicos Digitales
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
        Bienvenido de nuevo, <span className="text-indigo-600 dark:text-indigo-400 font-bold">{userName}</span>
      </p>
      
      {/* Contenedor de Botones de Acción */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        {/* Botón 1: Estadísticas */}
        <Link 
          href="/auth/dashboard" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95 group"
        >
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Estadísticas
        </Link>

        {/* Botón 2: Ir al Formulario 11 */}
        <Link 
          href="/auth/formularios/formulario-11" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl font-bold shadow-sm hover:shadow-md hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all active:scale-95 group"
        >
          <ClipboardList className="w-5 h-5" />
          Cuestionario
          <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

// 2. Componente Principal (Página de Inicio)
export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center p-6 overflow-hidden">
      
      {/* Decoración de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/40 dark:bg-indigo-900/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-2xl w-full">
        <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/40 dark:border-gray-800 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] rounded-[3rem] p-8 md:p-14 text-center space-y-10">
          
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative w-28 h-28 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl transition-transform hover:scale-105 duration-300">
                🏥
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
                Salud<span className="text-blue-600">Vital</span>
              </h1>
              
              <Suspense fallback={<div className="h-20 w-64 bg-gray-200/50 animate-pulse mx-auto rounded-xl" />}>
                <UserActions />
              </Suspense>
            </div>
          </div>

          <p className="max-w-sm mx-auto text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            Tu historial de salud centralizado, seguro y siempre a tu alcance.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4 max-w-[320px] mx-auto">
            {!hasEnvVars ? (
              <div className="text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl py-4 px-6 text-sm w-full font-bold">
                ⚠️ Configura tus variables de entorno
              </div>
            ) : (
              <div className="w-full">
                <Suspense fallback={<div className="h-16 w-full bg-gray-100 rounded-2xl animate-pulse" />}>
                  <AuthButton />
                </Suspense>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}