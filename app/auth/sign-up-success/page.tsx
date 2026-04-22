"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Home, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

// const supabase = createClient();

export default function SignUpSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("encuestas")
          .select("current_step, is_completed")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setStep(data.current_step || 1);
          setHasStarted(true);
          if (data.current_step >= 12 || data.is_completed) {
            setIsFinished(true);
          }
        }
      } catch (error) {
        console.error("Error cargando progreso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [router]);

  return (
    <div className="min-h-svh bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-white/20">
        
        {/* ✅ Icono Dinámico */}
        <div className={`mx-auto w-24 h-24 rounded-3xl flex items-center justify-center transition-all shadow-inner ${
          isFinished ? 'bg-green-100 rotate-12' : hasStarted ? 'bg-blue-100' : 'bg-rose-100'
        }`}>
          {loading ? (
            <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
          ) : isFinished ? (
            <span className="text-4xl">🏆</span>
          ) : hasStarted ? (
            <span className="text-4xl">🚀</span>
          ) : (
            <span className="text-4xl">✨</span>
          )}
        </div>

        {/* 🧠 Texto Dinámico */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-gray-900 leading-tight">
            {loading ? "Verificando..." : isFinished ? "¡Cuestionario Completado!" : hasStarted ? "¡Qué bueno verte!" : "¡Bienvenido!"}
          </h1>
          <p className="text-gray-500 font-medium">
            {loading 
              ? "Estamos verificando tu progreso..." 
              : isFinished 
                ? "Has finalizado todas las secciones con éxito. ¿Qué deseas hacer ahora?" 
                : hasStarted 
                  ? `Te quedaste en la sección ${step}. Continuemos para terminar.` 
                  : "Ya puedes comenzar tu cuestionario de caracterización de SaludVital."}
          </p>
        </div>

        {/* 🚀 ACCIONES */}
        <div className="space-y-3">
          {loading ? (
             <Button disabled className="w-full py-7 rounded-2xl">
               <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando...
             </Button>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Botón de Acción Principal */}
              {isFinished ? (
                <Button 
                  onClick={() => router.push('/auth/formularios/formulario-11')}
                  variant="outline"
                  className="w-full text-lg py-7 rounded-2xl border-2 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5 text-gray-500" />
                  Revisar Formulario 11
                </Button>
              ) : (
                <Button
                  onClick={() => router.push(`/auth/formularios/formulario-${step}`)}
                  className="w-full text-lg py-7 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  {hasStarted ? "Continuar donde lo dejé" : "Iniciar Cuestionario Ahora"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}

              {/* ✅ Botón Volver al Inicio (Siempre visible después de cargar) */}
              <Button 
                onClick={() => router.push('/')}
                variant="ghost"
                className="w-full text-base py-6 rounded-2xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Volver al Inicio
              </Button>
            </div>
          )}
        </div>

        {hasStarted && !isFinished && (
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Tu progreso se guarda automáticamente
            </p>
        )}
      </div>
    </div>
  );
}