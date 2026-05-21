"use client";

import { useState } from "react";

export default function CTA() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thanks for signing up! Check your email for next steps.");
    setEmail("");
  };

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-400 to-blue-500 p-12 md:p-16">
          {/* Decorative Elements */}
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-black/10" />

          <div className="relative text-center">
            <h2 className="text-4xl font-black text-black md:text-5xl lg:text-6xl">
              Ready to Stop Overpaying?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-black/80">
              Join thousands of smart teams who are saving an average of 50% on 
              their AI subscriptions. Start your free audit today.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-xl border-2 border-transparent bg-white/20 px-6 py-4 text-white placeholder-white/70 backdrop-blur-sm focus:border-black focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="rounded-xl bg-black px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-gray-900"
              >
                Start Free Audit
              </button>
            </form>

            <p className="mt-4 text-sm text-black/60">
              Free forever plan available • No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
