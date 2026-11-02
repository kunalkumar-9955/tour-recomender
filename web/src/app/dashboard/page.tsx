"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Sparkles, MapPinned, CalendarCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { getBookings, getPreferences, getRecommendations, getSavedDestinations } from "@/lib/api";
import { ProtectedRoute } from "@/components/protected-route";
import { useAppStore } from "@/store/app-store";

type RecommendationPoint = {
  name: string;
  score: number;
};

export default function DashboardPage() {
  const userId = useAppStore((s) => s.userId);
  const [recommendations, setRecommendations] = useState<RecommendationPoint[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [preference, setPreference] = useState<{ groupType?: string; travelStyle?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadDashboard() {
      setLoading(true);
      const recommendationKey = userId || "demo-user";
      const recPromise = getRecommendations(recommendationKey);
      const savedPromise = userId ? getSavedDestinations(userId) : Promise.resolve({ data: [] });
      const bookingsPromise = userId ? getBookings(userId) : Promise.resolve({ data: [] });
      const prefPromise = userId ? getPreferences(userId) : Promise.resolve({ data: null });

      const [recResult, savedResult, bookingResult, prefResult] = await Promise.allSettled([
        recPromise,
        savedPromise,
        bookingsPromise,
        prefPromise,
      ]);

      if (!mounted) return;

      if (recResult.status === "fulfilled") {
        setRecommendations(recResult.value.recommendations ?? []);
      } else {
        setRecommendations([]);
      }

      if (savedResult.status === "fulfilled") {
        setSavedCount(Array.isArray(savedResult.value.data) ? savedResult.value.data.length : 0);
      } else {
        setSavedCount(0);
      }

      if (bookingResult.status === "fulfilled") {
        setBookingCount(Array.isArray(bookingResult.value.data) ? bookingResult.value.data.length : 0);
      } else {
        setBookingCount(0);
      }

      if (prefResult.status === "fulfilled") {
        setPreference(prefResult.value.data || null);
      } else {
        setPreference(null);
      }

      setLoading(false);
    }

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const performanceTrend = recommendations.map((item, idx) => ({
    name: `W${idx + 1}`,
    score: Number((item.score * (0.92 + idx * 0.02)).toFixed(2)),
  }));

  const avgScore =
    recommendations.length > 0
      ? Math.round(
          (recommendations.reduce((sum, item) => sum + Number(item.score || 0), 0) / recommendations.length) * 20
        )
      : 0;

  const stats = [
    { label: "Saved Places", value: String(savedCount), icon: MapPinned, accent: "from-cyan-500/20 to-teal-500/5" },
    { label: "Trips Completed", value: String(bookingCount), icon: CalendarCheck, accent: "from-indigo-500/20 to-sky-500/5" },
    { label: "Recommendation Hits", value: `${recommendations.length || 0}`, icon: Sparkles, accent: "from-emerald-500/20 to-teal-500/5" },
    { label: "AI Travel Score", value: `${avgScore}/100`, icon: TrendingUp, accent: "from-fuchsia-500/20 to-cyan-500/5" },
  ];

  const activityItems = [
    `Saved destinations synced: ${savedCount}`,
    `Total bookings recorded: ${bookingCount}`,
    preference
      ? `Preference: ${preference.groupType || "Traveler"} • ${preference.travelStyle || "Adventure"}`
      : "Preference profile not set yet",
  ];

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-semibold">Your Travel Intelligence Dashboard</h1>
            <p className="mt-2 text-sm text-white/65">
              Live recommendations, trip confidence, and trend insights in one place.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            {loading ? "Syncing insights..." : "Insights updated just now"}
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className={`glass rounded-2xl bg-gradient-to-br ${item.accent} p-5`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/70">{item.label}</p>
                  <Icon className="h-4 w-4 text-cyan-300" />
                </div>
                <p className="mt-3 text-2xl font-bold">{item.value}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass h-80 rounded-3xl p-6 lg:col-span-2"
          >
            <p className="mb-3 text-lg font-medium">Recommendation Confidence</p>
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={recommendations}>
                <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(148, 163, 184, 0.25)",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="score" fill="#22d3ee" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="glass rounded-3xl p-6"
          >
            <p className="text-lg font-medium">Recent Activity</p>
            <div className="mt-4 space-y-4 text-sm text-white/80">
              {activityItems.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  {item}
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="glass mt-5 h-64 rounded-3xl p-6"
        >
          <p className="mb-3 text-lg font-medium">AI Performance Trend</p>
          <ResponsiveContainer width="100%" height="84%">
            <AreaChart data={performanceTrend}>
              <defs>
                <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(148, 163, 184, 0.25)",
                  borderRadius: "12px",
                }}
              />
              <Area type="monotone" dataKey="score" stroke="#22d3ee" fill="url(#scoreFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.section>
        
        <div className="mt-4 text-right text-xs text-white/50">
          Professional mode enabled: animated cards, charts, and activity feed.
        </div>
      </main>
    </ProtectedRoute>
  );
}
