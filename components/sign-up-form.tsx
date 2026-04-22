"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock,  
  AlertCircle, 
  Loader2 
} from "lucide-react";

import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
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

    setIsLoading(true);
    setError(null);

    try {
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

      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          document_type: formData.documentType,
          document_number: formData.documentNumber,
          email: formData.email,
        });
      }
      router.push("/auth/sign-up-success");
    } catch (error: any) {
      setError(error.message || "Ocurrió un error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full max-w-md mx-auto", className)} {...props}>
      {/* Botón Volver al Inicio */}
      <Link 
        href="/" 
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors w-fit mb-2 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al inicio
      </Link>

      <Card className="border-t-4 border-t-blue-600 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Crear cuenta</CardTitle>
          <CardDescription>
            Ingresa tus datos para unirte a SaludVital
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-5">
            
            {/* Sección: Identidad */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm border-b pb-1">
                <User className="w-4 h-4" /> Datos Personales
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input name="firstName" placeholder="Ej. Juan" onChange={handleChange} required />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input name="lastName" placeholder="Ej. Pérez" onChange={handleChange} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="grid gap-1.5 sm:col-span-1">
                  <Label>Tipo</Label>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">C.C.</SelectItem>
                      <SelectItem value="CE">C.E.</SelectItem>
                      <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5 sm:col-span-2">
                  <Label>Número de documento</Label>
                  <Input name="documentNumber" placeholder="1000..." onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Sección: Cuenta */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm border-b pb-1">
                <Lock className="w-4 h-4" /> Seguridad
              </div>
              
              <div className="grid gap-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input name="email" type="email" className="pl-9" placeholder="nombre@ejemplo.com" onChange={handleChange} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Contraseña</Label>
                  <Input name="password" type="password" onChange={handleChange} required />
                </div>
                <div className="grid gap-1.5">
                  <Label>Repetir</Label>
                  <Input name="repeatPassword" type="password" onChange={handleChange} required />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-bold shadow-md shadow-blue-200 transition-all active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Crear mi cuenta"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
                Inicia sesión aquí
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}