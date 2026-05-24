"use client";

import { useEffect, useMemo, useState } from "react";
import { pricingData } from "@/lib/pricingData";
import { generateAudit } from "@/lib/auditEngine";

const useCases = [
  "coding",
  "writing",
  "research",
  "data",
  "mixed",
] as const;

interface ToolSpend {
  toolId: string;
  selectedPlanId: string;
  monthlySpend: number;
  seats: number;
}

interface SpendAuditForm {
  teamSize: number;
  primaryUseCase: string;
  tools: ToolSpend[];
}

const defaultForm: SpendAuditForm = {
  teamSize: 1,
  primaryUseCase: "coding",
  tools: [],
};

export default function SpendForm() {
  const [formData, setFormData] =
    useState<SpendAuditForm>(defaultForm);
  const [result, setResult] = useState<any>(
    null
  );

  useEffect(() => {
    const saved = localStorage.getItem(
      "audit-form"
    );

    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "audit-form",
      JSON.stringify(formData)
    );
  }, [formData]);

  const totalMonthlySpend = useMemo(() => {
    return formData.tools.reduce(
      (total, tool) =>
        total + Number(tool.monthlySpend || 0),
      0
    );
  }, [formData.tools]);

  const addTool = () => {
    setFormData((prev) => ({
      ...prev,
      tools: [
        ...prev.tools,
        {
          toolId: "",
          selectedPlanId: "",
          monthlySpend: 0,
          seats: 1,
        },
      ],
    }));
  };

  const removeTool = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateTool = (
    index: number,
    field: keyof ToolSpend,
    value: string | number
  ) => {
    const updatedTools = [...formData.tools];

    updatedTools[index] = {
      ...updatedTools[index],
      [field]: value,
    };

    if (field === "toolId") {
      updatedTools[index].selectedPlanId = "";
    }

    setFormData((prev) => ({
      ...prev,
      tools: updatedTools,
    }));
  };

  const getPlans = (toolId: string) => {
    return (
      pricingData.find(
        (tool) => tool.id === toolId
      )?.plans || []
    );
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    console.log("FORM DATA:");
    console.log(formData);
    const auditResult =
      generateAudit(formData);

    console.log("AUDIT RESULT:");
    console.log(auditResult);
    setResult(auditResult);

    // later:
    // router.push("/results")
    // or store audit in firebase/state
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-black">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          AI Spend Audit
        </h1>

        <p className="text-gray-600 mt-2">
          Analyze your AI stack and find
          savings opportunities.
        </p>
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* SINGLE FORM CARD */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="grid md:grid-cols-2 gap-5">

            {/* TOOL */}

            <div>
              <label className="block mb-2 font-medium">
                Tool
              </label>

              <select
                value={formData.tools[0]?.toolId || ""}
                onChange={(e) => {
                  if (formData.tools.length === 0) {
                    setFormData((prev) => ({
                      ...prev,
                      tools: [
                        {
                          toolId: e.target.value,
                          selectedPlanId: "",
                          monthlySpend: 0,
                          seats: 1,
                        },
                      ],
                    }));
                  } else {
                    updateTool(
                      0,
                      "toolId",
                      e.target.value
                    );
                  }
                }}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="">
                  Select Tool
                </option>

                {pricingData.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PLAN */}

            <div>
              <label className="block mb-2 font-medium">
                Plan
              </label>

              <select
                value={
                  formData.tools[0]
                    ?.selectedPlanId || ""
                }
                onChange={(e) => {
                  if (formData.tools.length > 0) {
                    updateTool(
                      0,
                      "selectedPlanId",
                      e.target.value
                    );
                  }
                }}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="">
                  Select Plan
                </option>

                {getPlans(
                  formData.tools[0]?.toolId || ""
                ).map((plan) => (
                  <option
                    key={plan.id}
                    value={plan.id}
                  >
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>

            {/* MONTHLY SPEND */}

            <div>
              <label className="block mb-2 font-medium">
                Monthly Spend
              </label>

              <input
                type="number"
                min={0}
                value={
                  formData.tools[0]
                    ?.monthlySpend || 0
                }
                onChange={(e) => {
                  if (formData.tools.length > 0) {
                    updateTool(
                      0,
                      "monthlySpend",
                      Number(e.target.value)
                    );
                  }
                }}
                className="w-full border rounded-xl px-4 py-3"
                placeholder="1999"
              />
            </div>

            {/* SEATS */}

            <div>
              <label className="block mb-2 font-medium">
                Seats (Actual AI Users)
              </label>

              <input
                type="number"
                min={1}
                value={
                  formData.tools[0]?.seats || 1
                }
                onChange={(e) => {
                  if (formData.tools.length > 0) {
                    updateTool(
                      0,
                      "seats",
                      Number(e.target.value)
                    );
                  }
                }}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            {/* TEAM SIZE */}

            <div>
              <label className="block mb-2 font-medium">
                Team Size
              </label>

              <input
                type="number"
                min={1}
                value={formData.teamSize}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    teamSize: Number(
                      e.target.value
                    ),
                  }))
                }
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            {/* PRIMARY USE CASE */}

            <div>
              <label className="block mb-2 font-medium">
                Primary Use Case
              </label>

              <select
                value={formData.primaryUseCase}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    primaryUseCase:
                      e.target.value,
                  }))
                }
                className="w-full border rounded-xl px-4 py-3"
              >
                {useCases.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TOTAL */}

        <div className="bg-black text-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">
                Current Monthly Spend
              </p>

              <h3 className="text-4xl font-bold mt-1">
                ₹
                {totalMonthlySpend.toLocaleString()}
              </h3>
            </div>

            <button
              type="submit"
              className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
            >
              Generate Audit
            </button>
          </div>
        </div>
      </form>
      {result && result.length > 0 && (
        <div className="mt-12 space-y-8">
          {/* ======================================== */}
          {/* TOTAL SAVINGS HERO */}
          {/* ======================================== */}

          {(() => {
            const totalMonthlySavings = result.reduce(
              (total: number, item: any) =>
                total + item.monthlySavings,
              0
            );

            const totalAnnualSavings = result.reduce(
              (total: number, item: any) =>
                total + item.annualSavings,
              0
            );

            return (
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#111827] to-black p-8 text-white shadow-2xl">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/80">
                      AI Spend Audit
                    </p>

                    <h2 className="mt-4 text-5xl font-black leading-tight lg:text-6xl">
                      ₹
                      {totalMonthlySavings.toLocaleString()}
                      <span className="text-2xl font-semibold text-gray-400 lg:text-3xl">
                        /month
                      </span>
                    </h2>

                    <p className="mt-4 text-lg text-gray-300">
                      ₹
                      {totalAnnualSavings.toLocaleString()}
                      /year optimization opportunity
                    </p>
                  </div>

                  {/* HONEST STATUS */}

                  <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    {totalMonthlySavings < 100 ? (
                      <>
                        <h3 className="text-2xl font-bold text-emerald-400">
                          Your AI Spend Looks Healthy
                        </h3>

                        <p className="mt-3 text-gray-300 leading-7">
                          We did not identify major optimization opportunities at the moment. Your current AI stack already appears reasonably optimized for your current usage patterns.
                        </p>

                        <button className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02]">
                          Notify Me About Future Optimizations
                        </button>
                      </>
                    ) : totalMonthlySavings >= 500 ? (
                      <>
                        <h3 className="text-2xl font-bold text-emerald-400">
                          Significant Savings Opportunity Detected
                        </h3>

                        <p className="mt-3 text-gray-300 leading-7">
                          Your stack may have meaningful optimization opportunities. Credex can help your team capture and manage these savings more efficiently.
                        </p>

                        <button className="mt-6 rounded-2xl bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:scale-[1.02]">
                          Explore Credex
                        </button>
                      </>
                    ) : (
                      <>
                        <h3 className="text-2xl font-bold text-emerald-400">
                          Moderate Optimization Opportunity
                        </h3>

                        <p className="mt-3 text-gray-300 leading-7">
                          Your AI tooling setup appears mostly healthy, but a few adjustments could improve cost efficiency.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ======================================== */}
          {/* TOOL BREAKDOWN */}
          {/* ======================================== */}

          <div className="space-y-6">
            {result.map((item: any, index: number) => (
              <div
                key={index}
                className="rounded-[28px] border border-white/10 bg-[#0f172a] p-7 text-white shadow-xl"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* LEFT */}

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-3xl font-black">
                        {item.toolName}
                      </h3>

                      <span
                        className={`rounded-full px-4 py-1 text-sm font-semibold ${item.action === "upgrade"
                            ? "bg-blue-500/20 text-blue-300"
                            : item.action === "downgrade"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-emerald-500/20 text-emerald-300"
                          }`}
                      >
                        {item.action.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-white/5 p-5">
                        <p className="text-sm text-gray-400">
                          Current Plan
                        </p>

                        <h4 className="mt-2 text-2xl font-bold">
                          {item.currentPlan}
                        </h4>
                      </div>

                      <div className="rounded-2xl bg-white/5 p-5">
                        <p className="text-sm text-gray-400">
                          Recommended Plan
                        </p>

                        <h4 className="mt-2 text-2xl font-bold">
                          {item.recommendedPlan}
                        </h4>
                      </div>

                      <div className="rounded-2xl bg-white/5 p-5">
                        <p className="text-sm text-gray-400">
                          Estimated Savings
                        </p>

                        <h4 className="mt-2 text-2xl font-bold text-emerald-400">
                          ₹
                          {item.monthlySavings.toLocaleString()}
                          <span className="text-base text-gray-400">
                            /month
                          </span>
                        </h4>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                      <p className="text-sm uppercase tracking-wide text-gray-400">
                        Recommendation Reason
                      </p>

                      <p className="mt-3 text-lg leading-8 text-gray-300">
                        {item.reason}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="w-full lg:max-w-sm rounded-3xl border border-white/10 bg-black/30 p-6">
                    <p className="text-sm uppercase tracking-wide text-gray-400">
                      Cost Comparison
                    </p>

                    <div className="mt-6 space-y-5">
                      <div>
                        <p className="text-sm text-gray-400">
                          Current Monthly Spend
                        </p>

                        <h4 className="mt-1 text-3xl font-black text-red-300">
                          ₹
                          {item.currentMonthlyCost.toLocaleString()}
                        </h4>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Optimized Monthly Spend
                        </p>

                        <h4 className="mt-1 text-3xl font-black text-emerald-400">
                          ₹
                          {item.optimizedMonthlyCost.toLocaleString()}
                        </h4>
                      </div>

                      <div className="border-t border-white/10 pt-5">
                        <p className="text-sm text-gray-400">
                          Annual Savings
                        </p>

                        <h4 className="mt-1 text-4xl font-black">
                          ₹
                          {item.annualSavings.toLocaleString()}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}