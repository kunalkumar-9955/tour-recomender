"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const reviews = [
  { name: "Priya S.", place: "Mumbai", text: "Recommendations felt like Netflix for travel — spot on for our honeymoon." },
  { name: "Arjun K.", place: "Bangalore", text: "Budget filter + itinerary saved us hours. Looks like a real product, not a demo." },
  { name: "Neha R.", place: "Delhi", text: "The UI is gorgeous. Found Manali alternatives I would never have searched myself." },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="px-6 py-24 md:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Travelers Love TourAI</h2>
        <p className="mt-3 text-white/70">Real feedback from early explorers</p>
        <div className="relative mt-12 min-h-[200px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-10 backdrop-blur-xl">
          <Quote className="mx-auto mb-4 h-10 w-10 text-cyan-400/80" />
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-lg text-white/90 md:text-xl">&ldquo;{reviews[i].text}&rdquo;</p>
              <p className="mt-6 text-sm font-medium text-cyan-300">
                {reviews[i].name} · {reviews[i].place}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-center gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Review ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-cyan-400" : "w-2 bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
