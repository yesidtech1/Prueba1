"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  Activity, 
  CheckCircle2, 
  BarChart3, 
  ArrowLeft,
  Zap,
  AlertCircle,
  Stethoscope,
  Timer,
  ArrowRight
} from "lucide-react";
import { calcularIPA, getRiesgoIPA } from "@/lib/calculos";

const supabase = createClient();

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: encuesta } = await supabase
        .from("encuestas")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setData(encuesta);
      setLoading(false);
    };
    getStats();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse text-blue-600 font-bold text-xl tracking-tighter">
        🏥 ANALIZANDO PERFIL CLÍNICO...
      </div>
    </div>
  );

  // 1. Lógica de Dependencia
  const getDependencyLevel = () => {
    const defaultStyle = { label: "No disp.", color: "text-slate-400", bg: "bg-slate-100" };
    if (!data) return defaultStyle;

    const cigs = parseInt(data.ptabaco12) || 0;
    const time = parseInt(data.ptabaco14) || 0;

    if (cigs >= 3 || time === 1) return { label: "Alta", color: "text-rose-600", bg: "bg-rose-100" };
    if (cigs === 2) return { label: "Media", color: "text-amber-600", bg: "bg-amber-100" };
    return { label: "Baja", color: "text-emerald-600", bg: "bg-emerald-100" };
  };

  const dependency = getDependencyLevel();

  // 2. Cálculo del IPA
  const ipa = calcularIPA(data?.ctabaco4, data?.ptabaco12);
  const riesgo = getRiesgoIPA(ipa);

  // 3. Lógica de Estado Dinámico (Lo que pediste)
  const isFormCompleted = data?.is_completed || data?.current_step >= 12;
  const currentStep = data?.current_step || 1;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mi Perfil de Salud</h1>
            <p className="text-slate-500 font-medium italic">Análisis preventivo de salud respiratoria.</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:shadow-md transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </button>
        </div>

        {/* Fila Principal: IPA y Dependencia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-8 rounded-[3rem] border-2 shadow-sm ${riesgo.bg} border-white transition-all hover:shadow-lg`}>
             <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-800">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-current ${riesgo.color}`}>
                  Riesgo {riesgo.nivel}
                </span>
             </div>
             <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1">Índice Paquetes-Año (IPA)</h3>
             <div className="flex items-baseline gap-2">
                <span className={`text-6xl font-black ${riesgo.color}`}>{ipa}</span>
                <span className="text-slate-400 font-bold text-lg">p/a</span>
             </div>
             <p className="mt-4 text-slate-700 font-medium leading-tight">{riesgo.descripcion}</p>
             <div className="mt-6 h-3 w-full bg-white/60 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${ipa > 20 ? 'bg-rose-500' : ipa > 10 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min((ipa / 30) * 100, 100)}%` }}
                />
             </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm transition-all hover:shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                <Zap />
              </div>
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Dependencia Física</h3>
            </div>
            <div className="flex items-center gap-3">
               <span className={`px-6 py-2 rounded-2xl text-xl font-black ${dependency.bg} ${dependency.color}`}>
                Nivel {dependency.label}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-6 leading-relaxed">
              Basado en el tiempo del primer cigarrillo al despertar y volumen diario.
            </p>
          </div>
        </div>

        {/* Grid de Detalles Secundarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card: Intención de Cambio */}
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4">Deseo de cesación</h3>
            <p className="text-2xl font-black text-slate-800">
              {data?.ptabaco9 === '1' ? '✅ Sí, desea dejarlo' : '❌ Sin intención actual'}
            </p>
          </div>

          {/* ✅ CARD DINÁMICA: Estado de Datos (Actualizada) */}
          <div 
            onClick={() => !isFormCompleted && router.push(`/auth/formularios/formulario-${currentStep}`)}
            className={`p-6 rounded-[2.5rem] shadow-sm border transition-all cursor-pointer group ${
              isFormCompleted 
                ? 'bg-white border-slate-100' 
                : 'bg-amber-50 border-amber-100 hover:bg-amber-100'
            }`}
          >
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4">Estado del Informe</h3>
            {isFormCompleted ? (
              <div className="flex items-center gap-2 text-2xl font-black text-emerald-500">
                <CheckCircle2 className="w-6 h-6" /> Completo
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-2xl font-black text-amber-600">
                  <Timer className="w-6 h-6 animate-pulse" /> Incompleto
                </div>
                <div className="flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
                  Continuar sección {currentStep} <ArrowRight className="ml-1 w-3 h-3" />
                </div>
              </div>
            )}
          </div>

          {/* Card: Síntomas */}
          <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-4">Resumen de Alertas</h3>
            <div className="flex gap-2 flex-wrap">
              {data?.ptabaco15 && JSON.parse(data.ptabaco15).length > 0 ? (
                <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-lg text-xs font-bold">
                  {JSON.parse(data.ptabaco15).length} Síntomas detectados
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-bold italic">Sin síntomas reportados</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}