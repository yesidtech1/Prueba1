// app/(dashboard)/layout.tsx
import { DashboardNavbar } from "@/components/dashboard-navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Un navbar más compacto y funcional para el dashboard */}
      <DashboardNavbar /> 
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {children}
      </div>
    </div>
  );
}