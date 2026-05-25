"use client";

import { useEffect, useMemo, useState } from "react";
import { pricingData } from "@/lib/pricingData";
import { generateAudit } from "@/lib/auditEngine";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";





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

// Generate or retrieve unique user ID
const getUserId = (): string => {
  let userId = localStorage.getItem("audit_user_id");
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem("audit_user_id", userId);
  }
  return userId;
};

export default function SpendForm() {
  const [formData, setFormData] = useState<SpendAuditForm>(defaultForm);
  const [result, setResult] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [userId] = useState<string>(getUserId());

  // Placeholder states for lead form features to prevent crashing if declared outside snippet
  const [leadForm, setLeadForm] = useState({ email: "", company: "", role: "" });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [auditId, setAuditId] = useState<string | null>(null);


  const handleLeadSubmit = async () => {
    try {
      if (!auditId) {
        console.error("Missing audit ID");
        return;
      }

      const auditRef = doc(db, "audits", auditId);

      // 1. Update Firestore with lead data
      await updateDoc(auditRef, {
        lead: {
          email: leadForm.email,
          company: leadForm.company,
          role: leadForm.role,
        },
        leadSubmitted: true,
        aiSummary,
        leadSubmittedAt: Date.now(),
      });

      // 2. Send email
      const totalMonthlySavings = result.reduce(
        (total: number, item: any) => total + item.monthlySavings, 0
      );

      const totalAnnualSavings = result.reduce(
        (total: number, item: any) => total + item.annualSavings, 0
      );

      await fetch("/api/send-audit-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: leadForm.email,
          shareableLink: `${window.location.origin}/audit/${auditId}`,
          totalMonthlySavings,
          totalAnnualSavings,
        }),
      });

      console.log("Lead submitted & email sent");
      setLeadSubmitted(true);
    } catch (error) {
      console.error("Lead submit error:", error);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("audit-form");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("audit-form", JSON.stringify(formData));
  }, [formData]);

  const totalMonthlySpend = useMemo(() => {
    return formData.tools.reduce(
      (total, tool) => total + Number(tool.monthlySpend || 0),
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
      tools: prev.tools.filter((_, i) => i !== index),
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
    return pricingData.find((tool) => tool.id === toolId)?.plans || [];
  };

  // Groq API call for AI summary
  const generateAISummary = async (auditResult: any, formData: SpendAuditForm) => {
    setIsGeneratingSummary(true);

    try {
      const groqApiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

      if (!groqApiKey) {
        throw new Error("Groq API key not found");
      }

      const totalMonthlySavings = auditResult.reduce(
        (total: number, item: any) => total + item.monthlySavings,
        0
      );

      const totalAnnualSavings = auditResult.reduce(
        (total: number, item: any) => total + item.annualSavings,
        0
      );

      const prompt = `Generate a concise, personalized summary (around 100 words) for an AI spend audit. 
      The user has a team of ${formData.teamSize} people, primarily using AI tools for ${formData.primaryUseCase}.
      They currently spend ₹${totalMonthlySpend.toLocaleString()}/month on AI tools.
      Potential monthly savings: ₹${totalMonthlySavings.toLocaleString()}
      Potential annual savings: ₹${totalAnnualSavings.toLocaleString()}
      
      Tools analyzed:
      ${auditResult.map((item: any) =>
        `${item.toolName}: ${item.currentPlan} → ${item.recommendedPlan} (save ₹${item.monthlySavings}/month)`
      ).join('\n')}
      
      Make it actionable and encouraging. If savings are minimal, acknowledge their good optimization.`;

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 200,
            temperature: 0.7,
          }),
        });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      const summary = data.choices[0]?.message?.content || generateFallbackSummary(auditResult);
      setAiSummary(summary);
    } catch (error) {
      console.error("Error generating AI summary:", error);
      // Fallback to templated summary
      const fallbackSummary = generateFallbackSummary(result);
      setAiSummary(fallbackSummary);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const generateFallbackSummary = (auditResult: any) => {
    const totalMonthlySavings = auditResult.reduce(
      (total: number, item: any) => total + item.monthlySavings,
      0
    );

    const toolCount = auditResult.length;

    if (totalMonthlySavings < 100) {
      return `Your AI tool stack appears well-optimized with ${toolCount} ${toolCount === 1 ? 'tool' : 'tools'} in use. We found minimal savings opportunities, suggesting you've made smart choices in your AI spending. Continue monitoring as new pricing options emerge.`;
    } else if (totalMonthlySavings >= 500) {
      return `We identified significant optimization potential across your ${toolCount}-tool AI stack. By adjusting plans and exploring credit-based alternatives, you could save approximately ₹${totalMonthlySavings.toLocaleString()}/month. This represents a meaningful opportunity to reduce costs without sacrificing functionality.`;
    } else {
      return `Your AI tooling setup has moderate optimization opportunities. While your current choices are reasonable, we found ${toolCount} ${toolCount === 1 ? 'area' : 'areas'} where plan adjustments could yield monthly savings of about ₹${totalMonthlySavings.toLocaleString()}. These changes maintain your current capabilities while improving cost efficiency.`;
    }
  };

  // Store audit in Firebase
  const storeAuditInFirebase = async (auditResult: any, formData: SpendAuditForm) => {
    try {
      const auditData = {
        userId: userId,
        timestamp: new Date().toISOString(),
        formData: {
          teamSize: formData.teamSize,
          primaryUseCase: formData.primaryUseCase,
          tools: formData.tools,
          totalMonthlySpend: totalMonthlySpend,
        },
        auditResult: auditResult.map((item: any) => ({
          toolName: item.toolName,
          currentPlan: item.currentPlan,
          recommendedPlan: item.recommendedPlan,
          action: item.action,
          monthlySavings: item.monthlySavings,
          annualSavings: item.annualSavings,
          reason: item.reason,
          currentMonthlyCost: item.currentMonthlyCost,
          optimizedMonthlyCost: item.optimizedMonthlyCost,
        })),
        totalMonthlySavings: auditResult.reduce(
          (total: number, item: any) => total + item.monthlySavings,
          0
        ),
        totalAnnualSavings: auditResult.reduce(
          (total: number, item: any) => total + item.annualSavings,
          0
        ),
        aiSummary: aiSummary,
      };

      const docRef = await addDoc(collection(db, "audits"), auditData);
      setAuditId(docRef.id);
      console.log("Audit stored successfully with ID:", userId);
    } catch (error) {
      console.error("Error storing audit in Firebase:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("FORM DATA:");
    console.log(formData);

    const auditResult = generateAudit(formData);
    console.log("AUDIT RESULT:");
    console.log(auditResult);

    setResult(auditResult);

    // Generate AI summary
    await generateAISummary(auditResult, formData);

    // Store in Firebase (will be called after summary is set)
    setTimeout(() => {
      storeAuditInFirebase(auditResult, formData);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-black">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">AI Spend Audit</h1>
        <p className="text-gray-600 mt-2">
          Analyze your AI stack and find savings opportunities.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SINGLE FORM CARD */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="grid md:grid-cols-2 gap-5">
            {/* TOOL */}
            <div>
              <label className="block mb-2 font-medium">Tool</label>
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
                    updateTool(0, "toolId", e.target.value);
                  }
                }}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="">Select Tool</option>
                {pricingData.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PLAN */}
            <div>
              <label className="block mb-2 font-medium">Plan</label>
              <select
                value={formData.tools[0]?.selectedPlanId || ""}
                onChange={(e) => {
                  if (formData.tools.length > 0) {
                    updateTool(0, "selectedPlanId", e.target.value);
                  }
                }}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="">Select Plan</option>
                {getPlans(formData.tools[0]?.toolId || "").map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>

            {/* MONTHLY SPEND */}
            <div>
              <label className="block mb-2 font-medium">Monthly Spend</label>
              <input
                type="number"
                min={0}
                value={formData.tools[0]?.monthlySpend || 0}
                onChange={(e) => {
                  if (formData.tools.length > 0) {
                    updateTool(0, "monthlySpend", Number(e.target.value));
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
                value={formData.tools[0]?.seats || 1}
                onChange={(e) => {
                  if (formData.tools.length > 0) {
                    updateTool(0, "seats", Number(e.target.value));
                  }
                }}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            {/* TEAM SIZE */}
            <div>
              <label className="block mb-2 font-medium">Team Size</label>
              <input
                type="number"
                min={1}
                value={formData.teamSize}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    teamSize: Number(e.target.value),
                  }))
                }
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            {/* PRIMARY USE CASE */}
            <div>
              <label className="block mb-2 font-medium">Primary Use Case</label>
              <select
                value={formData.primaryUseCase}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    primaryUseCase: e.target.value,
                  }))
                }
                className="w-full border rounded-xl px-4 py-3"
              >
                {useCases.map((item) => (
                  <option key={item} value={item}>
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
              <p className="text-sm opacity-80">Current Monthly Spend</p>
              <h3 className="text-4xl font-bold mt-1">
                ₹{totalMonthlySpend.toLocaleString()}
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
          {/* AI Summary Section */}
          {isGeneratingSummary ? (
            <div className="rounded-[28px] border border-white/10 bg-[#0f172a] p-7 text-white shadow-xl">
              <p className="text-gray-400">Generating personalized summary...</p>
            </div>
          ) : aiSummary && (
            <div className="rounded-[28px] border border-white/10 bg-[#0f172a] p-7 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-4">AI-Powered Analysis</h3>
              <p className="text-lg leading-8 text-gray-300">{aiSummary}</p>
            </div>
          )}

          {/* TOTAL SAVINGS HERO */}
          {(() => {
            const totalMonthlySavings = result.reduce(
              (total: number, item: any) => total + item.monthlySavings,
              0
            );

            const totalAnnualSavings = result.reduce(
              (total: number, item: any) => total + item.annualSavings,
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
                      ₹{totalMonthlySavings.toLocaleString()}
                      <span className="text-2xl font-semibold text-gray-400 lg:text-3xl">
                        /month
                      </span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                      ₹{totalAnnualSavings.toLocaleString()}/year optimization opportunity
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
                        <button
                          onClick={() => {
                            document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02]">
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
                        <button
                          onClick={() => {
                            document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="mt-6 rounded-2xl bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:scale-[1.02]">
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

          {/* TOOL BREAKDOWN */}
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
                      <h3 className="text-3xl font-black">{item.toolName}</h3>
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
                        <p className="text-sm text-gray-400">Current Plan</p>
                        <h4 className="mt-2 text-2xl font-bold">
                          {item.currentPlan}
                        </h4>
                      </div>

                      <div className="rounded-2xl bg-white/5 p-5">
                        <p className="text-sm text-gray-400">Recommended Plan</p>
                        <h4 className="mt-2 text-2xl font-bold text-emerald-400">
                          {item.recommendedPlan}
                        </h4>
                      </div>

                      <div className="rounded-2xl bg-white/5 p-5">
                        <p className="text-sm text-gray-400">Estimated Savings</p>
                        <h4 className="mt-2 text-2xl font-bold text-emerald-400">
                          ₹{item.monthlySavings.toLocaleString()}
                          <span className="text-base text-gray-400">/month</span>
                        </h4>
                      </div>
                    </div>

                    {/* RECOMMENDATION REASON */}
                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                      <p className="text-sm uppercase tracking-wide text-gray-400">
                        Recommendation Reason
                      </p>
                      <p className="mt-3 text-lg leading-8 text-gray-300">
                        {item.reason}
                      </p>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm uppercase tracking-wide text-emerald-400 mb-2">
                        Recommended Action
                      </p>

                      <div className="mt-3">
                        {item.action === "upgrade" && (
                          <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-4 text-blue-200">
                            Upgrade from{" "}
                            <span className="font-bold">{item.currentPlan}</span>
                            {" "}to{" "}
                            <span className="font-bold">{item.recommendedPlan}</span>
                            {" "}for better scalability and team workflows.
                          </div>
                        )}

                        {item.action === "downgrade" && (
                          <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-4 text-yellow-200">
                            Downgrade from{" "}
                            <span className="font-bold">{item.currentPlan}</span>
                            {" "}to{" "}
                            <span className="font-bold">{item.recommendedPlan}</span>
                            {" "}to reduce unnecessary spending.
                          </div>
                        )}

                        {item.action === "stay" && (
                          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-200">
                            Keep{" "}
                            <span className="font-bold">{item.currentPlan}</span>
                            {" "}— your current plan is already optimized.
                          </div>
                        )}
                      </div>
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
                          ₹{item.currentMonthlyCost.toLocaleString()}
                        </h4>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">
                          Optimized Monthly Spend
                        </p>
                        <h4 className="mt-1 text-3xl font-black text-emerald-400">
                          ₹{item.optimizedMonthlyCost.toLocaleString()}
                        </h4>
                      </div>

                      <div className="border-t border-white/10 pt-5">
                        <p className="text-sm text-gray-400">
                          Annual Savings
                        </p>
                        <h4 className="mt-1 text-4xl font-black">
                          ₹{item.annualSavings.toLocaleString()}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* LEAD CAPTURE */}
          <div id="lead-form" className="rounded-[28px] border bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-black text-black">
              Stay Updated
            </h2>
            <p className="mt-2 text-gray-500">
              Get notified when new optimization opportunities apply to your stack.
            </p>

            <div className="mt-8 grid md:grid-cols-2 gap-5">
              <input
                type="email"
                placeholder="Email"
                value={leadForm.email}
                onChange={(e) =>
                  setLeadForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="border text-black rounded-2xl px-5 py-4"
              />

              <input
                type="text"
                placeholder="Company"
                value={leadForm.company}
                onChange={(e) =>
                  setLeadForm((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                className="border text-black rounded-2xl px-5 py-4"
              />

              <input
                type="text"
                placeholder="Role"
                value={leadForm.role}
                onChange={(e) =>
                  setLeadForm((prev) => ({
                    ...prev,
                    role: e.target.value,
                  }))
                }
                className="border text-black rounded-2xl px-5 py-4"
              />

              <button
                onClick={handleLeadSubmit}
                className="rounded-2xl bg-black text-white px-6 py-4 font-semibold"
              >
                Submit
              </button>
            </div>
          </div>

          {/* SHAREABLE LINK */}
          {leadSubmitted && auditId && (
            <div className="rounded-[28px] bg-black text-white p-8">
              <h2 className="text-3xl font-black">
                Share Audit Result
              </h2>
              <p className="mt-3 text-gray-400">
                Share this public audit with your team.
              </p>

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <input
                  readOnly
                  value={`${window.location.origin}/audit/${auditId}`}
                  className="flex-1 rounded-2xl bg-white/10 border border-white/10 px-5 py-4"
                />

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/audit/${auditId}`
                    );
                  }}
                  className="rounded-2xl bg-white text-black px-6 py-4 font-semibold"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
