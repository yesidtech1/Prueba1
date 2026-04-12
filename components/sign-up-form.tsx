"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    documentType: "",
    documentNumber: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, documentType: value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.documentType ||
      !formData.documentNumber ||
      !formData.email 
    ) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 🔐 Registro con email
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            document_type: formData.documentType,
            document_number: formData.documentNumber,
          },
        },
      });

      if (signUpError) throw signUpError;

      // 📦 Guardar perfil
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: data.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              document_type: formData.documentType,
              document_number: formData.documentNumber,
              email: formData.email,
            },
            { onConflict: "id" }
          );

        if (profileError) {
          console.error("Error al guardar perfil:", profileError);
        }
      }

      router.push("/auth/sign-up-success");

    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear la cuenta"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>
            Regístrate con tu correo electrónico
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Nombre *</Label>
                  <Input
                    name="firstName"
                    placeholder="Juan"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Apellido *</Label>
                  <Input
                    name="lastName"
                    placeholder="Pérez"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Documento */}
              <div className="grid gap-2">
                <Label>Tipo de documento *</Label>
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC">Cédula (CC)</SelectItem>
                    <SelectItem value="CE">Extranjería (CE)</SelectItem>
                    <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                    <SelectItem value="TI">Tarjeta (TI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Número de documento *</Label>
                <Input
                  name="documentNumber"
                  placeholder="1234567890"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* 📧 EMAIL (principal ahora) */}
              <div className="grid gap-2">
                <Label>Correo *</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="tuemail@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* 🔒 Password */}
              <div className="grid gap-2">
                <Label>Contraseña *</Label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Repetir contraseña *</Label>
                <Input
                  name="repeatPassword"
                  type="password"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* Botón */}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </div>

            {/* Login */}
            <div className="mt-4 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/login" className="underline">
                Iniciar sesión
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}

