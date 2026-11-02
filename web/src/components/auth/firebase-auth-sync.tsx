"use client";

import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "@/lib/firebase";
import { useAppStore } from "@/store/app-store";
import { upsertUser, setAuthToken } from "@/lib/api";

export function FirebaseAuthSync() {
  const setToken = useAppStore((s) => s.setToken);
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setToken(null);
        setAuthToken(null);
        setUser({ id: null, email: null, name: null });
        return;
      }
      const idToken = await user.getIdToken();
      setToken(idToken);
      setAuthToken(idToken);
      try {
        const response = await upsertUser({
          firebaseUid: user.uid,
          email: user.email || "",
          name: user.displayName || user.email?.split("@")[0] || "Traveler",
        });
        const id = response?.data?._id || null;
        setUser({ id, email: user.email || null, name: user.displayName || null });
      } catch {
        setUser({ id: null, email: user.email || null, name: user.displayName || null });
      }
    });

    return () => unsubscribe();
  }, [setToken, setUser]);

  return null;
}
