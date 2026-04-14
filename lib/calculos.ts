// lib/calculos.ts

export const calcularIPA = (ctabaco4: string, ptabaco12: string) => {
  if (!ctabaco4 || !ptabaco12) return 0;

  // 1. Obtener años fumando: Edad actual (estimada 30 si no hay) - Edad inicio
  const edadInicio = parseInt(ctabaco4);
  const edadActual = 35; // Lo ideal sería traer la fecha de nacimiento del perfil
  const añosFumando = Math.max(edadActual - edadInicio, 1);

  // 2. Mapear ptabaco12 (Cigarrillos al día) a valores numéricos
  // Tus opciones eran: 1: "10 o menos", 2: "11 a 20", 3: "21 a 30", 4: "31 o más"
  const mapeoCigarrillos: { [key: string]: number } = {
    "1": 5,   // Promedio de 10 o menos
    "2": 15,  // Promedio de 11-20
    "3": 25,  // Promedio de 21-30
    "4": 40,  // Más de 31
  };

  const cigarrillosAlDia = mapeoCigarrillos[ptabaco12] || 0;

  // 3. Fórmula: (Cigarrillos día * Años) / 20
  const resultado = (cigarrillosAlDia * añosFumando) / 20;
  return parseFloat(resultado.toFixed(2));
};

export const getRiesgoIPA = (ipa: number) => {
  if (ipa < 10) return { nivel: "Bajo", color: "text-emerald-600", bg: "bg-emerald-100", descripcion: "Riesgo mínimo de EPOC." };
  if (ipa < 20) return { nivel: "Moderado", color: "text-amber-600", bg: "bg-amber-100", descripcion: "Se recomienda valoración pulmonar." };
  return { nivel: "Alto", color: "text-rose-600", bg: "bg-rose-100", descripcion: "Riesgo elevado. Requiere seguimiento médico." };
};