"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { getAdminStats } from "@/lib/api";

const actions = ["Manage Users", "Manage Destinations", "Moderate Reviews"] as const;

export default function AdminPage() {
  const [active, setActive] = useState<(typeof actions)[number]>("Manage Users");
  const [stats, setStats] = useState<{ users?: number; places?: number; reviews?: number; bookings?: number; preferences?: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError("");
      try {
        const response = await getAdminStats();
        setStats(response.data || response);
      } catch (err) {
        setError("Unable to load admin statistics.");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Admin Panel</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {actions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActive(item)}
              className={`glass rounded-2xl p-5 text-left transition ${active === item ? "ring-2 ring-cyan-400" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="glass mt-6 rounded-2xl p-6 text-white/80">
          <h2 className="text-xl font-semibold text-white">Platform Metrics</h2>
          {loading ? (
            <p className="mt-4">Loading statistics…</p>
          ) : error ? (
            <p className="mt-4 text-red-400">{error}</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-slate-950/80 p-5">
                <p className="text-sm uppercase text-slate-400">Users</p>
                <p className="mt-2 text-3xl font-semibold">{stats.users ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/80 p-5">
                <p className="text-sm uppercase text-slate-400">Destinations</p>
                <p className="mt-2 text-3xl font-semibold">{stats.places ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/80 p-5">
                <p className="text-sm uppercase text-slate-400">Reviews</p>
                <p className="mt-2 text-3xl font-semibold">{stats.reviews ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/80 p-5">
                <p className="text-sm uppercase text-slate-400">Bookings</p>
                <p className="mt-2 text-3xl font-semibold">{stats.bookings ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/80 p-5">
                <p className="text-sm uppercase text-slate-400">Preferences</p>
                <p className="mt-2 text-3xl font-semibold">{stats.preferences ?? 0}</p>
              </div>
            </div>
          )}
        </div>
        <div className="glass mt-6 rounded-2xl p-6 text-white/80">
          Active Section: <span className="font-semibold text-white">{active}</span>
        </div>
      </main>
    </ProtectedRoute>
  );
}
