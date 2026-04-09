"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUpSuccessPage() {
  const router = useRouter();

  const formularios = [
    {
      numero: "Formulario 1",
      titulo: "Formulario Uno",
      descripcion: "Accede al primer formulario",
      href: "/formulario-1",
    },
    {
      numero: "Formulario 2",
      titulo: "Formulario Dos",
      descripcion: "Accede al segundo formulario",
      href: "/formulario-2",
    },
    {
      numero: "Formulario 3",
      titulo: "Formulario Tres",
      descripcion: "Accede al tercer formulario",
      href: "/formulario-3",
    },
    {
      numero: "Formulario 4",
      titulo: "Formulario Cuatro",
      descripcion: "Accede al cuarto formulario",
      href: "/formulario-4",
    },
  ];

  return (
    <div className="min-h-svh bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        
        {/* Mensaje de éxito */}
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 h-14 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            ¡Registro completado!
          </h1>
          <p className="text-xl text-gray-600">
            Selecciona a qué formulario deseas acceder
          </p>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formularios.map((form, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-primary/30"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">
                      {form.numero}
                    </p>
                    <CardTitle className="text-2xl">
                      {form.titulo}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {form.descripcion}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  onClick={() => {
                    console.log("Ir a:", form.href);
                    router.push(form.href);
                  }}
                  className="w-full text-base py-6 flex items-center justify-center gap-2 group-hover:bg-primary transition-all"
                  size="lg"
                >
                  Abrir Formulario
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Elige uno de los formularios para continuar
        </p>
      </div>
    </div>
  );
}