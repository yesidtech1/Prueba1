import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-gray-950 dark:via-slate-950 dark:to-gray-900 flex items-center justify-center p-6">
      
      <div className="max-w-md w-full text-center space-y-10">
        
        {/* Logo y Título */}
        <div className="flex flex-col items-center gap-5">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center text-5xl shadow-2xl shadow-blue-500/30">
            🏥
          </div>
          
          <div>
            <h1 className="text-5xl font-bold tracking-tighter text-gray-900 dark:text-white">
              SaludVital
            </h1>
            <p className="text-2xl font-light text-blue-600 dark:text-blue-500 mt-1">
              Exámenes Médicos
            </p>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Tu salud, más simple y digital.
        </p>

        {/* Botones de Login y Registro - Muy centrados */}
        <div className="flex flex-col items-center gap-4 pt-6 max-w-[280px] mx-auto">
          {!hasEnvVars ? (
            <div className="text-amber-600 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-2xl py-4 px-6 text-sm w-full">
              Configura tus variables de entorno de Supabase
            </div>
          ) : (
            <Suspense fallback={
              <div className="h-14 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            }>
              <AuthButton />
            </Suspense>
          )}
        </div>

        {/* Pie de página */}
        <div className="pt-8 text-xs text-gray-500 dark:text-gray-400">
          Resultados seguros • Confidencialidad garantizada
        </div>
      </div>
    </main>
  );
}