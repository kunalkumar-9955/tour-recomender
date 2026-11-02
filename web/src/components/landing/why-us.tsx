"use client";

import { motion } from "framer-motion";
import { Brain, Wallet, Map, Gem, Heart, CloudSun } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Recommendations", desc: "Collaborative filtering tuned to your taste." },
  { icon: Wallet, title: "Budget Planner", desc: "Trips that respect your spending comfort." },
  { icon: Map, title: "Smart Itinerary", desc: "Day-wise plans with must-see stops." },
  { icon: Gem, title: "Hidden Gems", desc: "Beyond the obvious tourist trails." },
  { icon: Heart, title: "Mood Based Trips", desc: "Romance, solo, family, or adventure." },
  { icon: CloudSun, title: "Real-Time Weather", desc: "Pack and plan with live conditions." },
];

export function WhyUs() {
  return (
    <section id="features" className="scroll-mt-24 border-y border-white/10 bg-slate-950/50 px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">Why Choose Us</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">
            Everything you expect from a modern travel platform — polished, fast, and intelligent.
          </p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl transition hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-cyan-500/30 to-teal-600/20 p-3">
                <f.icon className="h-7 w-7 text-cyan-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-white/70">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
