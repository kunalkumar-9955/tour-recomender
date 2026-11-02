"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { firebaseApp } from "@/lib/firebase";
import { useAppStore } from "@/store/app-store";
import { savePreferences, saveUserProfile, upsertUser } from "@/lib/api";
import { AuthShell } from "@/components/auth/auth-shell";
import { Eye, EyeOff } from "lucide-react";
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";

const interests = ["Adventure", "Romantic", "Solo", "Family", "Nature", "Luxury"];

export default function RegisterPage() {
  const router = useRouter();
  const setToken = useAppStore((s) => s.setToken);
  const setUser = useAppStore((s) => s.setUser);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm: "",
    country: "",
    travelInterest: "Adventure",
    budgetPreference: "15000",
    terms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!form.terms) {
      setMessage("Please accept the terms to continue.");
      return;
    }
    if (form.password !== form.confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth(firebaseApp);
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });
      const idToken = await cred.user.getIdToken();
      setToken(idToken);
      try {
        const userRes = await upsertUser({
          firebaseUid: cred.user.uid,
          email: form.email,
          name: form.name,
        });
        const userId = userRes?.data?._id;
        setUser({ id: userId || null, email: form.email, name: form.name });
        if (userId) {
          await saveUserProfile(userId, {
            name: form.name,
            mobile: form.mobile,
            country: form.country,
            travelInterest: form.travelInterest,
            budget: Number(form.budgetPreference),
          });
          await savePreferences({
            userId,
            budget: Number(form.budgetPreference),
            groupType: "Solo",
            travelStyle: (["Adventure", "Relax", "Religious", "Nature"].includes(form.travelInterest)
              ? form.travelInterest
              : "Adventure") as "Adventure" | "Relax" | "Religious" | "Nature",
          });
        }
      } catch {
        // Firebase signup should still succeed even if backend DB is temporarily unavailable.
      }
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed. Try a different email.";
      setMessage(msg.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleSignup() {
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
      const msg = err instanceof Error ? err.message : "Google sign-up failed.";
      setMessage(msg.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Tell us a bit about you — we will personalize recommendations from day one."
    >
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-white/70">Full name</label>
          <input
            required
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">Email</label>
          <input
            required
            type="email"
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">Mobile</label>
          <input
            required
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            placeholder="+91 …"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">Country</label>
          <input
            required
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            placeholder="India"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">Travel interest</label>
          <select
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            value={form.travelInterest}
            onChange={(e) => setForm({ ...form, travelInterest: e.target.value })}
          >
            {interests.map((i) => (
              <option key={i} value={i} className="bg-slate-900">
                {i}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-white/70">Budget preference (INR)</label>
          <input
            required
            type="number"
            min={1000}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            value={form.budgetPreference}
            onChange={(e) => setForm({ ...form, budgetPreference: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">Password</label>
          <div className="relative">
            <input
              required
              type={showPw ? "text" : "password"}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 pr-12 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              onClick={() => setShowPw((s) => !s)}
              aria-label="Toggle password"
            >
              {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/70">Confirm password</label>
          <input
            required
            type={showPw ? "text" : "password"}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-white/75 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => setForm({ ...form, terms: e.target.checked })}
            className="mt-1 rounded border-white/30 bg-white/10"
          />
          I accept the terms of service and privacy policy.
        </label>
        {message ? (
          <p className="sm:col-span-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {message}
          </p>
        ) : null}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Register"}
          </button>
        </div>
      </form>

      <button
        type="button"
        className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-medium text-white hover:bg-white/10"
        onClick={onGoogleSignup}
        disabled={loading}
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-white/60">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-cyan-400 hover:text-cyan-300">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
