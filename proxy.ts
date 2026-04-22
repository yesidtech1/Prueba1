import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
     // Usa la ANON_KEY aquí
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value, options) => {
          res.cookies.set({ name: key, value, ...options });
        },
        remove: (key, options) => {
          res.cookies.set({ name: key, value: "", ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = req.nextUrl;

  // --- CONFIGURACIÓN DE RUTAS ---

  // 1. La raíz "/" ahora es SIEMPRE pública (Tu Landing Page)
  const isHomePage = pathname === "/";

  // 2. Rutas de autenticación (Login/Registro)
  const authRoutes = ["/auth/login", "/auth/sign-up", "/auth/forgot-password"];
  const isAuthPage = authRoutes.some(route => pathname.startsWith(route));

  // 3. Rutas que requieren estar logueado (Dashboard, Formularios, etc.)
  // Aquí es donde proteges tu app real
  const isProtectedRoute = pathname.startsWith("/auth/inform") || 
                           pathname.startsWith("/auth/formularios") ||
                           pathname.startsWith("/auth/sign-up-success");

  // --- LÓGICA DE REDIRECCIÓN ---

  // 🔒 CASO 1: Si intenta entrar a una ruta PROTEGIDA y NO está logueado
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 🔁 CASO 2: Si YA está logueado e intenta ir al login o sign-up
  // Lo mandamos a su panel de control o página de éxito
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/auth/inform", req.url)); 
  }

  // ✅ En cualquier otro caso (como la Home "/"), permitimos el paso
  return res;
}

export const config = { 
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"], 
};