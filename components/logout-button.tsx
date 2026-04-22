"use client";

import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  // const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return <Button onClick={logout}>Cerrar sesion</Button>;
}
