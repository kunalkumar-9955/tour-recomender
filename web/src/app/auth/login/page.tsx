"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { firebaseApp } from "@/lib/firebase";
import { useAppStore } from "@/store/app-store";
import { AuthShell } from "@/components/auth/auth-shell";
import { Eye, EyeOff } from "lucide-react";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { upsertUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const setToken = useAppStore((s) => s.setToken);
  const setUser = useAppStore((s) => s.setUser);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth(firebaseApp);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      const name = cred.user.displayName || email.split("@")[0] || "Traveler";
      try {
        const userRes = await upsertUser({ firebaseUid: cred.user.uid, email, name });
        const userId = userRes?.data?._id;
        setUser({ id: userId || null, email, name });
      } catch {
        setUser({ id: null, email, name });
      }
      if (remember && typeof window !== "undefined") {
        window.localStorage.setItem("tour-ai-remember", "1");
      }
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed. Check email/password.";
      setMessage(msg.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleLogin() {
    setMessage("");
    setLoading(true);
    try {
      const auth = getAuth(firebaseApp);
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      const email = cred.user.email || "";
      const name = cred.user.displayName || email.split("@")[0] || "Traveler";
      try {
        const userRes = await upsertUser({ firebaseUid: cred.user.uid, email, name });
        const userId = userRes?.data?._id;
        setUser({ id: userId || null, email, name });
      } catch {
        setUser({ id: null, email, name });
      }
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google sign in failed.";
      setMessage(msg.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your dashboard, saved trips, and AI recommendations."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-sm text-white/70">Email</label>
          <input
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">Password</label>
          <div className="relative">
            <input
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 pr-12 text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              placeholder="••••••••"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-white/80">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-white/30 bg-white/10"
            />
            Remember me
          </label>
          <Link href="/auth/forgot-password" className="text-cyan-400 hover:text-cyan-300">
            Forgot password?
          </Link>
        </div>
        {message ? (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{message}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/15" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider text-white/50">
          <span className="bg-slate-950 px-3">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          className="rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          onClick={onGoogleLogin}
          disabled={loading}
        >
          Google
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-white/60">
        No account?{" "}
        <Link href="/auth/register" className="font-semibold text-cyan-400 hover:text-cyan-300">
          Register
        </Link>
      </p>
    </AuthShell>
  );
}
