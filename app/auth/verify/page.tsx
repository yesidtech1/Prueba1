"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 📱 obtenemos el teléfono desde la URL
  const phone = searchParams.get("phone");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    if (!phone) {
      setError("Falta el número de teléfono");
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: "sms",
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/auth/sign-up"); // 👈 aquí lo mandas a tus formularios
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <h2>Verificar código</h2>

      <input
        type="text"
        placeholder="Código OTP"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button type="submit">Verificar</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}