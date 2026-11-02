"use client";

import { useAppStore } from "@/store/app-store";
import { ProtectedRoute } from "@/components/protected-route";

export default function WishlistPage() {
  const wishlist = useAppStore((s) => s.wishlist);
  const removeWishlist = useAppStore((s) => s.removeWishlist);

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="glass mt-6 rounded-3xl p-6 text-white/80">
            No saved destinations yet. Use "Save to Wishlist" on destination cards.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {wishlist.map((item) => (
              <div key={item._id} className="glass rounded-2xl p-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="mt-1 text-sm text-white/70">
                  {item.country} • {item.type} • {item.season}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => window.open(item.bookingUrl || "https://www.booking.com", "_blank")}
                    className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-medium"
                  >
                    Book Now
                  </button>
                  <button
                    type="button"
                    onClick={() => removeWishlist(item._id)}
                    className="rounded-xl bg-white/10 px-3 py-2 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
