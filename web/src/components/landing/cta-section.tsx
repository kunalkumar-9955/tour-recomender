"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CtaSection() {
  return (
    <section className="px-6 py-20 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-cyan-600/40 via-slate-900/90 to-teal-900/50 p-12 text-center shadow-2xl shadow-cyan-900/20 md:p-16"
      >
        <h2 className="text-3xl font-bold text-white md:text-4xl">Ready for your next adventure?</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/80">
          Join thousands of travelers who plan smarter with AI-driven picks and stunning visuals.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/auth/register"
            className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-lg transition hover:bg-cyan-50"
          >
            Register Now
          </Link>
          <Link
            href="/destinations"
            className="rounded-2xl border border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Explore Destinations
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
