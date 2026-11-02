"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  _id: string;
  name: string;
  country: string;
  budget: number;
  type: string;
  season: string;
  rating: number;
  description: string;
  image: string;
  bookingUrl?: string;
};

type AppState = {
  token: string | null;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  wishlist: WishlistItem[];
  setToken: (token: string | null) => void;
  setUser: (user: { id: string | null; email: string | null; name: string | null }) => void;
  toggleWishlist: (item: WishlistItem) => void;
  removeWishlist: (id: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      token: null,
      userId: null,
      userEmail: null,
      userName: null,
      wishlist: [],
      setToken: (token) => set({ token }),
      setUser: (user) => set({ userId: user.id, userEmail: user.email, userName: user.name }),
      toggleWishlist: (item) => {
        const exists = get().wishlist.some((w) => w._id === item._id);
        if (exists) {
          set({ wishlist: get().wishlist.filter((w) => w._id !== item._id) });
        } else {
          set({ wishlist: [item, ...get().wishlist] });
        }
      },
      removeWishlist: (id) => set({ wishlist: get().wishlist.filter((w) => w._id !== id) }),
    }),
    { name: "tour-ai-store" }
  )
);
