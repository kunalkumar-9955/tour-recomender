"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { firebaseApp } from "@/lib/firebase";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const auth = getAuth(firebaseApp);
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset email sent. Check your inbox and follow the link.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Request failed.";
      setMessage(msg.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your account email and we will send a secure reset link."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-sm text-white/70">Email</label>
          <input
            required
            type="email"
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-3.5 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>
      {message ? <p className="mt-4 text-sm text-white/80">{message}</p> : null}
      <p className="mt-8 text-sm text-white/60">
        <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300">
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
}
