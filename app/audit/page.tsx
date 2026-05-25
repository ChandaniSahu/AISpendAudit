"use client";

import SpendForm from "@/components/SpendForm";

export default function AuditPage() {
  return (
    <main className="min-h-screen bg-[#081120] px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h1 className="text-5xl font-black text-emerald-400">
            AI Spend Audit
          </h1>

          <p className="mt-6 text-lg text-gray-300">
            Discover hidden AI subscription waste instantly.
          </p>
        </div>

        <div className="-mt-5">
          <SpendForm />
        </div>
      </div>
    </main>
  );
}
