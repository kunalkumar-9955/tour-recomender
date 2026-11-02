"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 px-6 py-20 md:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white md:text-4xl"
        >
          Built for modern travelers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-lg text-white/75"
        >
          TourAI blends collaborative filtering with a cinematic interface — so planning feels as exciting as the trip
          itself. We obsess over visuals, motion, and clarity so you spend less time searching and more time exploring.
        </motion.p>
      </div>
    </section>
  );
}
