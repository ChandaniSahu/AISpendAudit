"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";




export default function Hero() {

const router = useRouter();

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-10 md:pt-15">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 backdrop-blur-xl animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Save up to 50% on AI subscriptions
        </div>

        {/* Main Heading */}
        <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl lg:text-8xl">
          Stop Overpaying
          <br />
          <span className="gradient-text">For AI Tools</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-300 md:text-xl">
          AI Spend Audit analyzes your entire AI tool stack and uncovers hidden savings.
          We find cheaper plans, better alternatives, and optimization opportunities
          that could save you thousands annually.
        </p>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.push("/audit")} 

            type="button"
            className="rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-8 py-4 font-bold text-black shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:shadow-emerald-500/40"
          >
            Get Started Free
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-400">
          Free audit • No credit card required • 2-minute setup
        </p>

        {/* Stats Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            { value: "$12.4M+", label: "Total Savings Discovered", color: "text-emerald-400" },
            { value: "50+", label: "AI Tools Analyzed", color: "text-blue-400" },
            { value: "8,500+", label: "Happy Users", color: "text-purple-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-6 hover-lift"
            >
              <h3 className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
