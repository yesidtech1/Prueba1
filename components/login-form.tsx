"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const supabase = createClient();
export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  if(isLoading) return
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

      // router.push("/formulario-1");
      // router.refresh();
      router.replace("/formulario-1")

    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al iniciar sesión";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo y contraseña para acceder
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid gap-6">

              {/* 📧 Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tuemail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* 🔒 Contraseña */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* ❌ Error */}
              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}

              {/* 🚀 Botón */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </div>

            {/* Registro */}
            <div className="text-center text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/auth/sign-up"
                className="underline hover:text-primary"
              >
                Registrarse
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}