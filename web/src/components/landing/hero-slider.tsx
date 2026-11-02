"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    alt: "Mountain landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
    alt: "Tropical beach",
  },
  {
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80",
    alt: "City skyline",
  },
  {
    src: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80",
    alt: "Forest trail",
  },
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80",
    alt: "Luxury resort pool",
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index].src}
            alt={slides[index].alt}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 pb-24 pt-32 text-center md:px-12">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-cyan-300/90"
        >
          AI Tour Recommender
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
        >
          Discover Your Next Dream Destination
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-white/85 md:text-xl"
        >
          Get AI-powered personalized travel recommendations based on your mood, budget, and interests.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/destinations"
              className="inline-block rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-cyan-400/40"
            >
              Explore Now
            </Link>
          </motion.div>
          <Link
            href="/auth/register"
            className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Get Started
          </Link>
        </motion.div>
        <div className="mt-12 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-10 bg-cyan-400" : "w-2 bg-white/40 hover:bg-white/60"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
