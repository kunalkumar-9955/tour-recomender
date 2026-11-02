"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const sideImage =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=85";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative hidden overflow-hidden lg:block"
        >
          <Image src={sideImage} alt="Travel" fill className="object-cover" priority sizes="50vw" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-cyan-950/40 to-slate-950/80" />
          <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">TourAI</p>
            <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight">Travel smarter. Feel every destination.</h2>
            <p className="mt-4 max-w-sm text-white/75">
              Premium recommendations, itineraries, and visuals — built like a real startup product.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col justify-center px-6 py-16 pt-24 lg:px-14 lg:pt-16">
          <Link href="/" className="mb-8 text-sm text-cyan-400 hover:text-cyan-300">
            ← Back to home
          </Link>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            {subtitle ? <p className="mt-2 text-white/70">{subtitle}</p> : null}
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
