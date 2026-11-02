"use client";

import { useState } from "react";
import { generatePlan, savePreferences } from "@/lib/api";
import { useAppStore } from "@/store/app-store";

type ItineraryItem = {
  day: number;
  title: string;
  notes: string;
};

type TripPlan = {
  estimated_cost: number;
  itinerary: ItineraryItem[];
};

export default function PlannerPage() {
  const userId = useAppStore((s) => s.userId);
  const [form, setForm] = useState({ budget: 10000, days: 3, tripType: "Adventure", city: "Delhi" });
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (userId) {
        try {
          await savePreferences({
            userId,
            budget: Number(form.budget),
            groupType: "Solo",
            travelStyle: (["Adventure", "Relax", "Religious", "Nature"].includes(form.tripType)
              ? form.tripType
              : "Adventure") as "Adventure" | "Relax" | "Religious" | "Nature",
          });
        } catch {
          // Planner should still work even if preference sync fails.
        }
      }
      const data = await generatePlan(form);
      setPlan(data);
    } catch {
      setError("Trip planner is unavailable. Start the ML service and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Smart Trip Planner</h1>
      <form onSubmit={onSubmit} className="glass mt-6 grid gap-4 rounded-3xl p-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-white/75">Budget (INR)</label>
          <input
            className="w-full rounded-xl bg-white/10 p-3"
            type="number"
            placeholder="e.g. 10000"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/75">Trip Duration (Days)</label>
          <input
            className="w-full rounded-xl bg-white/10 p-3"
            type="number"
            placeholder="e.g. 3"
            value={form.days}
            onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/75">Trip Type</label>
          <input
            className="w-full rounded-xl bg-white/10 p-3"
            placeholder="e.g. Adventure / Family / Romantic"
            value={form.tripType}
            onChange={(e) => setForm({ ...form, tripType: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/75">Starting City</label>
          <input
            className="w-full rounded-xl bg-white/10 p-3"
            placeholder="e.g. Delhi"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
        <button
          disabled={loading}
          className="rounded-xl bg-cyan-500 px-4 py-3 font-semibold disabled:opacity-60 md:col-span-2"
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>
      {error ? <p className="mt-4 rounded-xl bg-red-500/20 p-3 text-sm">{error}</p> : null}
      {plan && (
        <section className="glass mt-6 rounded-3xl p-6">
          <h2 className="text-2xl font-semibold">Generated Plan</h2>
          <p className="mt-2">Estimated Cost: INR {plan.estimated_cost}</p>
          <ul className="mt-4 space-y-2">
            {plan.itinerary.map((day) => (
              <li key={day.day} className="rounded-xl bg-white/10 p-3">
                Day {day.day}: {day.title} - {day.notes}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
