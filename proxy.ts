import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value, options) => {
          res.cookies.set(key, value, options);
        },
        remove: (key, options) => {
          res.cookies.set(key, "", options);
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  // 🔓 Rutas públicas (NO requieren login)
  const authRoutes = [
    "/auth/login",
    "/auth/sign-up",
  ];

  const isAuthPage = authRoutes.includes(pathname);

  const publicRoutes = [
    "/auth/login",
    "/auth/sign-up",
    "/auth/callback",
    "/auth/forgot-password",
  ];

  const isPublic = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 🔒 Si NO está logueado y quiere ir a ruta privada
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 🔁 Si está logueado y entra a login → lo mandas al dashboard
//   if (user && pathname.startsWith("/auth")) {
//   const isGoingToSuccess = pathname === "/auth/sign-up-success";
//   const isGoingToForgotPassword = pathname === "/auth/forgot-password";

//   if (!isGoingToSuccess && !isGoingToForgotPassword) {
//     return NextResponse.redirect(new URL("/auth/sign-up-success", req.url));
//   }
// }
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/auth/sign-up-success", req.url));
  }


  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], };

