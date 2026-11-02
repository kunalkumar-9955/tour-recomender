"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAppStore((s) => s.token);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.replace("/auth/login");
    }
  }, [mounted, token, router]);

  if (!mounted || !token) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="glass rounded-2xl p-6">
          <p className="text-white/80">Checking authentication...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
