"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function SignUpSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);

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
          .select("current_step")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setStep(data.current_step || 1);
          setHasStarted(true);
        }
      } catch (error) {
        console.error("Error cargando progreso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [router]);

  const handleNavigation = () => {
    // Si el step es 1, va al formulario-1, si es 2 al formulario-2, etc.
    router.push(`/auth/formulario-${step}`);
  };

  return (
    <div className="min-h-svh bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-md w-full">
        
        {/* ✅ Icono Dinámico */}
        <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-colors ${hasStarted ? 'bg-blue-100' : 'bg-green-100'}`}>
          {loading ? (
            <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
          ) : hasStarted ? (
            <span className="text-4xl">🚀</span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 h-14 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* 🧠 Texto Dinámico */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {loading ? "Cargando..." : hasStarted ? "¡Bienvenido de nuevo!" : "¡Todo listo!"}
          </h1>
          <p className="text-gray-600">
            {loading 
              ? "Estamos verificando tu progreso..." 
              : hasStarted 
                ? `Te quedaste en la sección ${step}. Haz clic abajo para continuar.` 
                : "Ya puedes comenzar tu cuestionario de caracterización."}
          </p>
        </div>

        {/* 🚀 BOTÓN PRINCIPAL DINÁMICO */}
        <Button
          onClick={handleNavigation}
          disabled={loading}
          className="w-full text-lg py-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
          size="lg"
          variant={hasStarted ? "default" : "outline"} // Cambia el estilo si ya empezó
        >
          {loading ? (
            "Verificando..."
          ) : hasStarted ? (
            <>
              Continuar cuestionario
              <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              Iniciar cuestionario
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>

        {hasStarted && (
           <p className="text-xs text-gray-400 italic">
             Tu progreso se guarda automáticamente en cada sección.
           </p>
        )}
      </div>
    </div>
  );
}