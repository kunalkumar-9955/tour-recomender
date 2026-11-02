"use client";

import { usePathname } from "next/navigation";

export function PageShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path === "/") return <>{children}</>;
  return <div className="pt-16">{children}</div>;
}
