"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";



export default function Navbar() {
const router = useRouter();
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
          
          <button
            onClick={() => router.push("/audit")} 
          className="rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:shadow-emerald-500/40">
            Start Free Audit
          </button>

        
      </div>

      
    </nav>
  );
}
