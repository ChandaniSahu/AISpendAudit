"use client";

import { useState } from "react";
import { generateAudit } from "@/lib/auditEngine";
import { saveAudit } from "@/lib/firebase-service";

export default function SpendForm() {
  const [formData, setFormData] = useState({
    tool: "ChatGPT",
    plan: "",
    monthlySpend: "",
    seats: "",
    teamSize: "",
    useCase: "",
  });

  const [result, setResult] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const auditResult = generateAudit(formData);

    setResult(auditResult);

    await saveAudit({
      ...formData,
      ...auditResult,
    });
  };

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <form
        onSubmit={handleSubmit}
        className="grid gap-6"
      >
        <div>
          <label className="mb-2 block text-sm text-red-300">
            AI Tool
          </label>

          <select
            name="tool"
            value={formData.tool}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-[#0f172a] p-4 outline-none"
          >
            <option>ChatGPT</option>
            <option>Claude</option>
            <option>Cursor</option>
            <option>Gemini</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Current Plan
          </label>

          <input
            type="text"
            name="plan"
            placeholder="Pro / Team / Enterprise"
            value={formData.plan}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-[#0f172a] p-4 outline-none"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <input
            type="number"
            name="monthlySpend"
            placeholder="Monthly Spend ($)"
            value={formData.monthlySpend}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-[#0f172a] p-4 outline-none"
          />

          <input
            type="number"
            name="seats"
            placeholder="Seats"
            value={formData.seats}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-[#0f172a] p-4 outline-none"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <input
            type="number"
            name="teamSize"
            placeholder="Team Size"
            value={formData.teamSize}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-[#0f172a] p-4 outline-none"
          />

          <input
            type="text"
            name="useCase"
            placeholder="Coding / Research"
            value={formData.useCase}
            onChange={handleChange}
            className="rounded-2xl border border-white/10 bg-[#0f172a] p-4 outline-none"
          />
        </div>

        <button
          type="submit"
          className="rounded-2xl bg-emerald-400 px-8 py-4 text-lg font-bold text-black transition hover:scale-[1.02]"
        >
          Generate Audit
        </button>
      </form>

      {result && (
        <div className="mt-10 rounded-3xl border border-white/10 bg-[#0f172a] p-8">
          <h2 className="text-4xl font-black text-emerald-400">
            ${result.savings}/month savings
          </h2>

          <p className="mt-5 text-lg text-gray-300">
            {result.recommendation}
          </p>

          <div className="mt-6 rounded-2xl bg-white/5 p-5">
            <p className="text-gray-400">
              Annual Savings
            </p>

            <h3 className="mt-2 text-5xl font-black">
              ${result.annualSavings}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
