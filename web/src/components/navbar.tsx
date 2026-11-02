"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";

const links = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/#features", label: "Features" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const token = useAppStore((s) => s.token);
  const setToken = useAppStore((s) => s.setToken);
  const pathname = usePathname();

  async function handleLogout() {
    const auth = getAuth(firebaseApp);
    await signOut(auth);
    setToken(null);
  }

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled || pathname !== "/"
          ? "border-b border-white/10 bg-slate-950/90 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "border-b border-transparent bg-white/[0.07] backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Tour<span className="text-cyan-400">AI</span>
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-medium text-white/90 md:flex">
          {links.map((l) => (
            <li key={l.href + l.label}>
              <Link href={l.href} className="transition hover:text-cyan-300">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {token ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-white/90 hover:text-cyan-300"
            >
              Dashboard
            </Link>
          ) : null}
          {!token ? (
            <>
              <Link
                href="/auth/login"
                className="rounded-xl border border-white/25 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-500/25 transition hover:brightness-110"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
            >
              Logout
            </button>
          )}
          <button
            type="button"
            className="rounded-full border border-white/20 bg-white/10 p-2.5 text-white transition hover:bg-white/20"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {!mounted ? (
              <span className="block h-4 w-4" />
            ) : isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            className="rounded-full border border-white/20 bg-white/10 p-2 text-white"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/95 px-5 py-4 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-3 text-sm font-medium text-white">
            {links.map((l) => (
              <li key={l.href + l.label}>
                <Link href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
            {!token ? (
              <>
                <Link href="/auth/login" onClick={() => setOpen(false)} className="pt-2">
                  Login
                </Link>
                <Link href="/auth/register" onClick={() => setOpen(false)}>
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <li>
                  <button type="button" onClick={() => { handleLogout(); setOpen(false); }}>
                    Logout
                  </button>
                </li>
              </>
            )}
            <li className="pt-2">
              <button
                type="button"
                className="text-white/80"
                onClick={() => setTheme(isDark ? "light" : "dark")}
              >
                {mounted ? (isDark ? "Light mode" : "Dark mode") : "Theme"}
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
