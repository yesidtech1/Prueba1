import Link from "next/link";
import { AuthButton } from "./auth-button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform">
            🏥
          </div>
          <span className="text-xl font-bold tracking-tight dark:text-white">
            Salud<span className="text-blue-600">Vital</span>
          </span>
        </Link>

        {/* Botón de Acceso */}
        <div className="flex items-center gap-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}