"use client";

import { motion } from "framer-motion";
import { UserPlus, Sliders, Sparkles } from "lucide-react";

const steps = [
  { icon: UserPlus, n: "01", title: "Create Account", text: "Sign up in seconds and secure your profile." },
  { icon: Sliders, n: "02", title: "Set Preferences", text: "Budget, mood, climate, and dream regions." },
  { icon: Sparkles, n: "03", title: "Get Smart Recommendations", text: "AI ranks places you will actually love." },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center text-3xl font-bold text-white md:text-4xl"
        >
          How It Works
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-8 pt-12"
            >
              <span className="absolute left-8 top-6 text-5xl font-black text-white/10">{s.n}</span>
              <div className="mb-4 inline-flex rounded-2xl bg-cyan-500/20 p-3">
                <s.icon className="h-8 w-8 text-cyan-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-white/70">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
