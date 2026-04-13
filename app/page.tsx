import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

// 1. Este componente vive aquí mismo, arriba o abajo del Home.
// Su única misión es traer el nombre del usuario sin bloquear el resto de la página.
async function WelcomeMessage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Extraemos el nombre
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Paciente";

  if (!user) {
    return (
      <p className="text-xl font-light text-blue-600 dark:text-blue-500 italic">
        Exámenes Médicos Digitales
      </p>
    );
  }

  return (
    <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
      Bienvenido de nuevo, <span className="text-indigo-600 dark:text-indigo-400">{userName}</span>
    </p>
  );
}

// 2. Tu componente principal (La página)
export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center p-6 overflow-hidden">
      
      {/* Decoración de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/50 dark:bg-blue-900/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/50 dark:bg-indigo-900/20 rounded-full blur-[120px] -z-10" />

      <div className="max-w-2xl w-full">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-2xl rounded-[2.5rem] p-8 md:p-12 text-center space-y-8">
          
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-28 h-28 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center text-5xl shadow-xl">
              🏥
            </div>
            
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
                Salud<span className="text-blue-600">Vital</span>
              </h1>
              
              {/* Aquí usamos el componente de arriba envuelto en Suspense */}
              <Suspense fallback={<div className="h-7 w-48 bg-gray-200/50 animate-pulse mx-auto rounded-lg" />}>
                <WelcomeMessage />
              </Suspense>
            </div>
          </div>

          <p className="max-w-sm mx-auto text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            Tu historial de salud centralizado, seguro y siempre a tu alcance.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4 max-w-[320px] mx-auto">
            {!hasEnvVars ? (
              <div className="text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl py-4 px-6 text-sm w-full font-medium">
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