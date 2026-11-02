"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='1200'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop stop-color='#0f172a' offset='0'/>
          <stop stop-color='#0b3b5a' offset='1'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#e2e8f0' font-family='Arial' font-size='42'>Travel Destination</text>
    </svg>`
  );

const places = [
  {
    name: "Goa",
    rating: 4.8,
    desc: "Beaches, nightlife, and coastal charm.",
    img: "https://picsum.photos/seed/goa/900/1200",
  },
  {
    name: "Kashmir",
    rating: 4.9,
    desc: "Valleys, shikaras, and snow-capped peaks.",
    img: "https://picsum.photos/seed/kashmir/900/1200",
  },
  {
    name: "Manali",
    rating: 4.7,
    desc: "Mountains, adventure, and crisp air.",
    img: "https://picsum.photos/seed/manali/900/1200",
  },
  {
    name: "Kerala",
    rating: 4.8,
    desc: "Backwaters, tea estates, and serenity.",
    img: "https://picsum.photos/seed/kerala/900/1200",
  },
  {
    name: "Bali",
    rating: 4.9,
    desc: "Temples, rice terraces, and island vibes.",
    img: "https://picsum.photos/seed/bali/900/1200",
  },
  {
    name: "Dubai",
    rating: 4.8,
    desc: "Skyline luxury and desert adventures.",
    img: "https://picsum.photos/seed/dubai/900/1200",
  },
  {
    name: "Switzerland",
    rating: 4.9,
    desc: "Alps, lakes, and timeless elegance.",
    img: "https://picsum.photos/seed/switzerland/900/1200",
  },
];

export function PopularDestinations() {
  return (
    <section id="destinations" className="relative scroll-mt-24 px-6 py-24 md:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Popular Destinations</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">
            Hand-picked visuals to inspire your next escape. Tap Explore to find AI-matched trips.
          </p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {places.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== FALLBACK_IMAGE) img.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-bold text-white">{p.name}</h3>
                    <span className="rounded-full bg-amber-400/90 px-2.5 py-0.5 text-sm font-semibold text-slate-900">
                      ★ {p.rating}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-white/80">{p.desc}</p>
                  <Link
                    href="/destinations"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-cyan-500 py-2.5 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
