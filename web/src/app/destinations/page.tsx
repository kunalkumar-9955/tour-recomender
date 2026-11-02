"use client";

import { useEffect, useState } from "react";
import { DestinationCard, Destination } from "@/components/destination-card";
import { getDestinations } from "@/lib/api";

const fallbackDestinations: Destination[] = [
  {
    _id: "f1",
    name: "Goa",
    country: "India",
    budget: 12000,
    type: "Beach",
    season: "Winter",
    rating: 4.8,
    image: "https://picsum.photos/seed/goa-card/900/1200",
    description: "Beaches, cafes, nightlife, and sunsets.",
  },
  {
    _id: "f2",
    name: "Manali",
    country: "India",
    budget: 10000,
    type: "Adventure",
    season: "Summer",
    rating: 4.7,
    image: "https://picsum.photos/seed/manali-card/900/1200",
    description: "Mountains, rivers, trekking, and scenic drives.",
  },
  {
    _id: "f3",
    name: "Kerala",
    country: "India",
    budget: 14000,
    type: "Nature",
    season: "Monsoon",
    rating: 4.8,
    image: "https://picsum.photos/seed/kerala-card/900/1200",
    description: "Backwaters, tea gardens, and calm stays.",
  },
];

export default function DestinationsPage() {
  const [items, setItems] = useState<Destination[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getDestinations(query)
      .then((res) =>
        setItems(
          (res.data || []).map((d: any) => ({
            ...d,
            image: d.image || d.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          }))
        )
      )
      .catch(() => {
        const q = query.trim().toLowerCase();
        const filtered = fallbackDestinations.filter(
          (d) =>
            !q ||
            d.name.toLowerCase().includes(q) ||
            d.country.toLowerCase().includes(q) ||
            d.type.toLowerCase().includes(q)
        );
        setItems(filtered);
        setError("Live API unavailable, showing curated destinations.");
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Destinations</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by place, country, type..."
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 md:w-96"
        />
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-3xl bg-white/10" />
          ))}
        </div>
      ) : (
        <>
          {error ? <p className="mb-4 rounded-xl bg-amber-500/20 p-3 text-sm">{error}</p> : null}
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((destination) => (
              <DestinationCard key={destination._id} destination={destination} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
