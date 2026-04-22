"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { 
  LogOut, 
  User, 
  Settings, 
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function UserButton() {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Intentamos sacar el nombre de los metadatos que guardamos en el registro
        const name = user.user_metadata?.first_name || user.email?.split('@')[0];
        setUserName(name);
      }
    };
    getUserData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-all outline-none group">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
            {userName?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">
              {userName || "Usuario"}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 shadow-xl border-slate-100">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-bold leading-none text-slate-900">Mi Cuenta</p>
            <p className="text-xs leading-none text-slate-500">Gestiona tu perfil de salud</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-slate-100" />
        
        <DropdownMenuItem onClick={() => router.push('/dashboard')} className="rounded-xl cursor-pointer gap-2 p-3">
          <LayoutDashboard className="w-4 h-4 text-blue-600" />
          <span className="font-medium">Panel Principal</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="rounded-xl cursor-pointer gap-2 p-3">
          <Settings className="w-4 h-4 text-slate-500" />
          <span className="font-medium">Configuración</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-100" />

        <DropdownMenuItem 
          onClick={handleSignOut}
          className="rounded-xl cursor-pointer gap-2 p-3 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-bold">Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}