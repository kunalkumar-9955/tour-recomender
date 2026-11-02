"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { createBooking, saveDestinationForUser } from "@/lib/api";

export type Destination = {
  _id: string;
  name: string;
  city?: string;
  state?: string;
  country: string;
  budget: number;
  type: string;
  season: string;
  rating: number;
  image: string;
  description: string;
  bookingUrl?: string;
};

export function DestinationCard({ destination }: { destination: Destination }) {
  const { wishlist, toggleWishlist } = useAppStore();
  const userId = useAppStore((s) => s.userId);
  const [status, setStatus] = useState("");
  const inWishlist = useMemo(
    () => wishlist.some((item) => item._id === destination._id),
    [wishlist, destination._id]
  );

  async function handleWishlistToggle() {
    toggleWishlist(destination);
    if (!userId) return;
    try {
      await saveDestinationForUser(userId, {
        externalId: destination._id,
        placeName: destination.name,
        city: destination.city || "",
        state: destination.state || "",
        country: destination.country,
        category: destination.type,
        rating: destination.rating,
        budget: destination.budget,
        imageUrl: destination.image,
        description: destination.description,
        bestSeason: destination.season,
      });
    } catch {
      // Keep local wishlist responsive even if backend save fails.
    }
  }

  async function handleBook() {
    if (userId) {
      try {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 3);
        await createBooking({
          userId,
          place: {
            externalId: destination._id,
            placeName: destination.name,
            city: destination.city || "",
            state: destination.state || "",
            country: destination.country,
            category: destination.type,
            rating: destination.rating,
            budget: destination.budget,
            imageUrl: destination.image,
            description: destination.description,
            bestSeason: destination.season,
          },
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          travelersCount: 1,
          paymentStatus: "pending",
        });
        setStatus("Booking saved");
      } catch {
        setStatus("Booking save failed");
      }
    }
    window.open(destination.bookingUrl || "https://www.booking.com", "_blank");
  }

  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="glass rounded-3xl p-4"
    >
      <img
        src={destination.image}
        alt={destination.name}
        className="h-48 w-full rounded-2xl object-cover"
      />
      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold">{destination.name}</h3>
        <p className="text-sm text-white/70">
          {destination.country} • {destination.type} • {destination.season}
        </p>
        <p className="line-clamp-2 text-sm text-white/80">{destination.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span>INR {destination.budget.toLocaleString()}</span>
          <span>{destination.rating.toFixed(1)}★</span>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleWishlistToggle}
            className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
          >
            {inWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
          </button>
          <button
            type="button"
            onClick={handleBook}
            className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-medium"
          >
            Book
          </button>
        </div>
        {status ? <p className="text-xs text-white/70">{status}</p> : null}
      </div>
    </motion.article>
  );
}
