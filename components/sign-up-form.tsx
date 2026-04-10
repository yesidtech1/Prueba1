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

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    documentType: "",
    documentNumber: "",
    phone: "",
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
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.repeatPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.documentType || !formData.documentNumber || !formData.phone) {
      setError("Por favor completa todos los campos obligatorios");
      setIsLoading(false);
      return;
    }

    try {
      // 1️⃣ Crear el usuario en Supabase (Phone Auth)
      const { data, error: signUpError } = await supabase.auth.signUp({
        phone: formData.phone,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            document_type: formData.documentType,
            document_number: formData.documentNumber,
            phone: formData.phone,
          },
        },
      });

      if (signUpError) throw signUpError;

      // 2️⃣ Guardar perfil en la tabla "profiles" usando upsert para evitar errores de clave duplicada
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
              phone: formData.phone,
            },
            { onConflict: "id" } // Actualiza si ya existe
          );

        if (profileError) {
          console.error("Error al guardar perfil:", profileError);
        }
      }

      // 3️⃣ Redirigir al usuario
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>Regístrate usando tu número de teléfono</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Nombre <span className="text-red-500">*</span></Label>
                  <Input id="firstName" name="firstName" type="text" placeholder="Juan" required value={formData.firstName} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Apellido <span className="text-red-500">*</span></Label>
                  <Input id="lastName" name="lastName" type="text" placeholder="Pérez" required value={formData.lastName} onChange={handleChange} />
                </div>
              </div>

              {/* Tipo y número de documento */}
              <div className="grid gap-2">
                <Label htmlFor="documentType">Tipo de documento <span className="text-red-500">*</span></Label>
                <Select onValueChange={handleSelectChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC">Cédula de Ciudadanía (CC)</SelectItem>
                    <SelectItem value="CE">Cédula de Extranjería (CE)</SelectItem>
                    <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                    <SelectItem value="TI">Tarjeta de Identidad (TI)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="documentNumber">Número de documento <span className="text-red-500">*</span></Label>
                <Input id="documentNumber" name="documentNumber" type="text" placeholder="1234567890" required value={formData.documentNumber} onChange={handleChange} />
              </div>

              {/* Teléfono */}
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono <span className="text-red-500">*</span></Label>
                <Input id="phone" name="phone" type="tel" placeholder="+57 322 6234939" required value={formData.phone} onChange={handleChange} />
              </div>

              {/* Contraseña */}
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña <span className="text-red-500">*</span></Label>
                <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeatPassword">Repetir contraseña <span className="text-red-500">*</span></Label>
                <Input id="repeatPassword" name="repeatPassword" type="password" required value={formData.repeatPassword} onChange={handleChange} />
              </div>

              {/* Mensaje de error */}
              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* Botón */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </div>

            {/* Link para iniciar sesión */}
            <div className="mt-4 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/verify" className="underline underline-offset-4">Iniciar sesión</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}