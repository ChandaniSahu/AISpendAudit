"use client";

import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0F1E]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Image
      src="/logo1.png"
      alt="AI Spend Audit Logo"
      width={40}
      height={40}
      className="h-14 w-30 object-contain"
      priority
    />

        
        {/* CTA Button */}
        <div className="hidden items-center gap-4 md:flex">
          <button className="rounded-xl bg-white/5 px-6 py-2.5 text-sm font-medium hover:bg-white/10 transition-all">
            Sign In
          </button>
          <button className="rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:shadow-emerald-500/40">
            Start Free Audit
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0A0F1E]/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-3">
            <a
              href="#features"
              className="block py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="block py-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            <button className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-3 font-semibold text-black transition-all hover:scale-105">
              Start Free Audit
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
