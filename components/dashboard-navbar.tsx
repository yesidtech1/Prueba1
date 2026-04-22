// components/dashboard-navbar.tsx
import { UserButton } from "./user-botton";// Tu componente de perfil
import { Activity, Bell } from "lucide-react";
import Link from "next/link";

export function DashboardNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">Panel Salud</span>
        </Link>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <UserButton /> {/* Aquí va el botón para cerrar sesión */}
        </div>
      </div>
    </nav>
  );
}