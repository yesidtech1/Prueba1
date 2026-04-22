"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor ingresa correo y contraseña");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          throw new Error("Correo o contraseña incorrectos");
        }
        throw error;
      }

      router.refresh();
      router.replace("/auth/inform");

    } catch (error: any) {
      setError(error.message || "Ocurrió un error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <CardContent className="p-0">
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Campo: Email */}
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Correo Electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                className="pl-9 h-11 border-gray-200 focus:border-blue-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Campo: Password */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" id="password" className="text-sm font-semibold">
                Contraseña
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-blue-600 hover:underline underline-offset-4"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                className="pl-9 h-11 border-gray-200 focus:border-blue-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Botón de Acción */}
          <Button 
            type="submit" 
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validando...
              </>
            ) : (
              "Ingresar ahora"
            )}
          </Button>

          {/* Separador visual opcional */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">O</span>
            </div>
          </div>

          {/* Enlace a Registro */}
          <div className="text-center text-sm text-gray-500">
            ¿Nuevo en SaludVital?{" "}
            <Link
              href="/auth/sign-up"
              className="font-bold text-blue-600 hover:underline underline-offset-4"
            >
              Crea tu cuenta gratis
            </Link>
          </div>

        </form>
      </CardContent>
    </div>
  );
}