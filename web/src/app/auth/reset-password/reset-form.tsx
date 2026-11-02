"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { firebaseApp } from "@/lib/firebase";
import { confirmPasswordReset, getAuth } from "firebase/auth";

export function ResetPasswordForm() {
  const search = useSearchParams();
  const [oobCode, setOobCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const code = search.get("oobCode") || search.get("token");
    if (code) setOobCode(code);
  }, [search]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (!oobCode) {
      setMessage("Missing reset code. Open the reset link from your email.");
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth(firebaseApp);
      await confirmPasswordReset(auth, oobCode, password);
      setMessage("Password updated. You can log in now.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Reset failed.";
      setMessage(msg.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Set a new password" subtitle="Open the email link and set a new password.">
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-sm text-white/70">New password</label>
          <input
            required
            type="password"
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">Confirm password</label>
          <input
            required
            type="password"
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        {message ? (
          <p className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm text-white/90">{message}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-3.5 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
      <p className="mt-6 text-sm text-white/60">
        <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300">
          Go to login
        </Link>
      </p>
    </AuthShell>
  );
}
