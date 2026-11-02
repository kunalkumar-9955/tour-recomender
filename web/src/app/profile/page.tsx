"use client";

import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { ProtectedRoute } from "@/components/protected-route";
import { savePreferences, saveUserProfile } from "@/lib/api";

export default function ProfilePage() {
  const wishlist = useAppStore((s) => s.wishlist);
  const userId = useAppStore((s) => s.userId);
  const [profile, setProfile] = useState({
    name: "",
    budget: "10000",
    tripType: "Solo",
    climate: "Cold",
    location: "India",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSaveProfile() {
    if (!userId) {
      setMessage("Please login again to sync profile.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await saveUserProfile(userId, {
        name: profile.name,
        country: profile.location,
        travelInterest: profile.climate,
        budget: Number(profile.budget),
      });
      await savePreferences({
        userId,
        budget: Number(profile.budget),
        groupType: (["Solo", "Couple", "Family", "Friends"].includes(profile.tripType)
          ? profile.tripType
          : "Solo") as "Solo" | "Couple" | "Family" | "Friends",
        travelStyle: (["Adventure", "Relax", "Religious", "Nature"].includes(profile.climate)
          ? profile.climate
          : "Adventure") as "Adventure" | "Relax" | "Religious" | "Nature",
      });
      setMessage("Profile and preferences saved.");
    } catch {
      setMessage("Failed to save profile. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-semibold">My Profile</h1>
        <div className="glass mt-6 rounded-3xl p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="rounded-xl bg-white/10 p-3"
              placeholder="Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <input
              className="rounded-xl bg-white/10 p-3"
              placeholder="Budget preference"
              value={profile.budget}
              onChange={(e) => setProfile({ ...profile, budget: e.target.value })}
            />
            <input
              className="rounded-xl bg-white/10 p-3"
              placeholder="Favorite trip type"
              value={profile.tripType}
              onChange={(e) => setProfile({ ...profile, tripType: e.target.value })}
            />
            <input
              className="rounded-xl bg-white/10 p-3"
              placeholder="Preferred climate"
              value={profile.climate}
              onChange={(e) => setProfile({ ...profile, climate: e.target.value })}
            />
            <input
              className="rounded-xl bg-white/10 p-3 md:col-span-2"
              placeholder="Preferred country/state"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={onSaveProfile}
            className="mt-4 rounded-xl bg-cyan-500 px-5 py-3 font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
          {message ? <p className="mt-3 text-sm text-white/80">{message}</p> : null}
        </div>

        <div className="glass mt-6 rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Saved Destinations / Wishlist</h2>
          <p className="mt-2 text-white/80">Total saved: {wishlist.length}</p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
