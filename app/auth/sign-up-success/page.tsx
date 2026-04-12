"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function SignUpSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-svh bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      
      <div className="text-center space-y-8 max-w-md w-full">

        {/* ✅ Icono */}
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* 🧠 Texto */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Todo listo!
          </h1>
          <p className="text-gray-600">
            Ya puedes comenzar tu cuestionario
          </p>
        </div>

        {/* 🚀 BOTÓN PRINCIPAL */}
        <Button
          onClick={() => router.push("/auth/formulario-1")}
          className="w-full text-lg py-6 flex items-center justify-center gap-2"
          size="lg"
        >
          Iniciar cuestionario
          <ArrowRight className="w-5 h-5" />
        </Button>

      </div>
    </div>
  );
}

