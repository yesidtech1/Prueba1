// app/auth/layout.tsx
import { LogoutButton } from "@/components/logout-button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Botón de Logout posicionado en la parte superior derecha */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 rounded-2xl p-1">
          <LogoutButton />
        </div>
      </div>

      {/* Aquí se renderizan tus páginas (formulario-1, formulario-2, etc.) */}
      <main>
        {children}
      </main>
    </div>
  );
}