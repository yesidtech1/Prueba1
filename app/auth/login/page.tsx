import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { ArrowLeft, Activity } from "lucide-react";

export default function Page() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-gray-950 p-6 md:p-10 overflow-hidden">
      
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent dark:from-blue-900/10 -z-10" />

      {/* Botón de inicio (Estilo coherente con SignUp) */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-blue-600 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al inicio
      </Link>

      <div className="w-full max-w-md space-y-6">
        {/* Logo / Icono Central */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none">
            <Activity className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Salud<span className="text-blue-600">Vital</span>
          </h1>
        </div>

        {/* Contenedor del Formulario */}
        <div className="relative group">
          {/* Efecto de resplandor sutil al fondo */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          
          <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-gray-200/50 dark:shadow-none">
            <div className="mb-8 text-center space-y-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">¡Bienvenido de nuevo!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ingresa tus credenciales para acceder a tu historial médico
              </p>
            </div>

            {/* Componente del Formulario */}
            <LoginForm />
          </div>
        </div>

        {/* Footer simple */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          Protección de datos bajo estándares de salud internacional.
        </p>
      </div>
    </div>
  );
}