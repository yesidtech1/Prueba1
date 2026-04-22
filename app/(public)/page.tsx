import Link from "next/link";
import { AuthButton } from "@/components/auth-button"; // Ajusta la ruta según tu proyecto
import { ArrowRight, Activity, Shield, Clipboard } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* NAVBAR PERSONALIZADO */}
      <nav className="fixed top-0 w-full z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">Salud<span className="text-blue-600">Vital</span></span>
            </div>
            <div className="flex items-center gap-4">
               <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION (Lo primero que ven) */}
      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Tu salud, <span className="text-blue-600">digitalizada.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Accede a tus resultados, gestiona tus formularios médicos y mantén un control total de tu historial desde cualquier lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <Link href="/auth/inform" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
              Empezar ahora <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#info" className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center">
              Ver beneficios
            </Link>
          </div>

          {/* CARACTERÍSTICAS */}
          <div id="info" className="grid md:grid-cols-3 gap-8 text-left border-t pt-20">
            <div className="p-6 bg-blue-50 rounded-2xl">
              <Shield className="text-blue-600 w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-2">Privacidad Total</h3>
              <p className="text-gray-600">Tus datos médicos están protegidos con estándares de alta seguridad.</p>
            </div>
            <div className="p-6 bg-indigo-50 rounded-2xl">
              <Clipboard className="text-indigo-600 w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-2">Gestión de Formularios</h3>
              <p className="text-gray-600">Completa tus cuestionarios médicos de forma digital y sin papeles.</p>
            </div>
            <div className="p-6 bg-emerald-50 rounded-2xl">
              <Activity className="text-emerald-600 w-10 h-10 mb-4" />
              <h3 className="text-xl font-bold mb-2">Seguimiento en Vivo</h3>
              <p className="text-gray-600">Visualiza estadísticas y progresos de tus exámenes en tiempo real.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}