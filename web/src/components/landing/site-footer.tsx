"use client";

import Link from "next/link";
import { Github, Instagram, Twitter } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-white/10 bg-slate-950 px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div>
          <p className="text-xl font-bold text-white">
            Tour<span className="text-cyan-400">AI</span>
          </p>
          <p className="mt-3 text-sm text-white/60">
            Premium AI travel recommendations. Built for explorers who want more than generic lists.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Quick links</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link href="/" className="hover:text-cyan-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/destinations" className="hover:text-cyan-300">
                Destinations
              </Link>
            </li>
            <li>
              <Link href="/planner" className="hover:text-cyan-300">
                Trip Planner
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-cyan-300">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Account</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link href="/auth/login" className="hover:text-cyan-300">
                Login
              </Link>
            </li>
            <li>
              <Link href="/auth/register" className="hover:text-cyan-300">
                Register
              </Link>
            </li>
            <li>
              <Link href="/auth/forgot-password" className="hover:text-cyan-300">
                Forgot password
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Contact</p>
          <p className="mt-4 text-sm text-white/70">hello@tourai.app</p>
          <p className="text-sm text-white/70">+91 90000 00000</p>
          <div className="mt-4 flex gap-3">
            <a href="#" className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-8 text-center text-sm text-white/50">
        © {new Date().getFullYear()} TourAI. All rights reserved.
      </p>
    </footer>
  );
}
