"use client";

import { useState } from "react";

export default function SpendPreview() {
  const [selectedTools, setSelectedTools] = useState<string[]>([
    "ChatGPT Plus",
    "GitHub Copilot",
    "Midjourney",
  ]);

  const tools = [
    "ChatGPT Plus",
    "GitHub Copilot",
    "Midjourney",
    "Claude Pro",
    "Notion AI",
    "Jasper AI",
  ];

  const currentSpend = 840;
  const optimizedSpend = 420;
  const yearlySavings = 5040;

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool)
        ? prev.filter((t) => t !== tool)
        : [...prev, tool]
    );
  };

  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left Column */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              Savings Preview
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              See Your{" "}
              <span className="gradient-text">Potential Savings</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Select the AI tools you use and see how much you could save. 
              Our average user saves 50% on their AI subscriptions.
            </p>

            {/* Tool Selector */}
            <div className="mt-8 flex flex-wrap gap-3">
              {tools.map((tool) => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    selectedTools.includes(tool)
                      ? "bg-emerald-400 text-black"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Savings Card */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#1a1f2e] p-8 shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-5">
                <div>
                  <p className="text-sm text-gray-400">Current Monthly Spend</p>
                  <p className="text-2xl font-bold text-red-400">
                    ${currentSpend}/mo
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Tools</p>
                  <p className="font-semibold">{selectedTools.length}</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white/5 p-5">
                <div>
                  <p className="text-sm text-gray-400">Optimized Monthly Spend</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ${optimizedSpend}/mo
                  </p>
                </div>
                <div className="rounded-full bg-emerald-400/20 px-3 py-1 text-sm font-semibold text-emerald-400">
                  -50%
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 p-6 text-black">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black/80">
                      Yearly Savings
                    </p>
                    <p className="text-3xl font-black">
                      ${yearlySavings.toLocaleString()}/yr
                    </p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>

              <button className="w-full rounded-xl bg-white px-6 py-4 font-bold text-black transition-all hover:scale-105">
                Start Saving Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
