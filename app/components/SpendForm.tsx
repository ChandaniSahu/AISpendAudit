"use client";

import { useEffect, useMemo, useState } from "react";
import { pricingData } from "@/app/lib/pricingData";
import { generateAudit } from "@/app/lib/auditEngine";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { ToolSpend, SpendAuditForm, PrimaryUseCase } from "@/types/data";

const useCases: PrimaryUseCase[] = [
  "coding",
  "writing",
  "research",
  "data",
  "mixed",
];

const defaultForm: SpendAuditForm = {
  teamSize: 0,
  primaryUseCase: "coding",
  tools: [
    {
      toolId: "",
      selectedPlanId: "",
      monthlySpend: 0,
      seats: 0,
    },
  ],
};

export default function SpendForm() {

  const [formData, setFormData] = useState<SpendAuditForm>(defaultForm);
  const [result, setResult] = useState<any>(null);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [userId, setUserId] = useState<string>("");

  // Placeholder states for lead form features to prevent crashing if declared outside snippet
  const [leadForm, setLeadForm] = useState({ email: "", company: "", role: "", website: "" });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const getUserId = () => {
      let storedUserId = localStorage.getItem("audit_user_id");

      if (!storedUserId) {
        storedUserId = uuidv4();
        localStorage.setItem("audit_user_id", storedUserId);
      }

      setUserId(storedUserId);
    };

    getUserId();
  }, []);

  const validateSpendForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.tools[0]?.toolId) {
      newErrors.tool = "Please select a tool";
    }
    if (!formData.tools[0]?.selectedPlanId) {
      newErrors.plan = "Please select a plan";
    }
    if (!formData.tools[0]?.monthlySpend || formData.tools[0]?.monthlySpend <= 0) {
      newErrors.spend = "Please enter monthly spend";
    }
    if (!formData.tools[0]?.seats || formData.tools[0]?.seats < 1) {
      newErrors.seats = "Please enter valid seats";
    }
    if (!formData.teamSize || formData.teamSize < 1) {
      newErrors.teamSize = "Please enter team size";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLeadForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!leadForm.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(leadForm.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setLeadErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleLeadSubmit = async () => {
    if (!validateLeadForm()) return; // Stop if validation fails
    try {
      if (leadForm.website) {
        setLeadSubmitted(true); // Fake success to confuse bots
        return;
      }

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

      // Clear lead form
      setLeadForm({ email: "", company: "", role: "", website: "" });
      // Show toast
      setToastMessage("✅ You’ll receive future optimization updates.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

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
      
      Important: Do NOT include any headings or titles like "AI Spend Audit Summary" in your response. Just provide the plain paragraph summary.
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
    } catch (error) {
      console.error("Error storing audit in Firebase:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSpendForm()) return; // Stop if validation fails
   

    const auditResult = generateAudit(formData);
   

    setResult(auditResult);

    // Generate AI summary
    await generateAISummary(auditResult, formData);

    // Store in Firebase (will be called after summary is set)
    setTimeout(() => {
      storeAuditInFirebase(auditResult, formData);
    }, 2000);
    setFormData(defaultForm);
    localStorage.removeItem("audit-form");

    // Show toast
    setToastMessage("✅ Audit generated successfully!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    // Scroll to summary
    setTimeout(() => {
      document.getElementById("audit-result")?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  return (
    <div className="w-full p-6 text-black">
      {/* TOAST */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[150] bg-black text-white px-6 py-4 rounded-2xl shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}
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
                  setErrors(prev => ({ ...prev, tool: "" }));
                  if (formData.tools.length === 0) {
                    setFormData((prev) => ({
                      ...prev,
                      tools: [
                        {
                          ...prev.tools[0],
                          toolId: e.target.value,
                          selectedPlanId: "",
                        },
                      ],
                    }));
                  } else {
                    updateTool(0, "toolId", e.target.value);
                  }
                }}
                className={`w-full border rounded-xl px-4 py-3 ${errors.tool ? "border-red-500" : ""}`}
              >
                <option value="">Select Tool</option>
                {pricingData.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.tool && <p className="text-red-500 text-sm mt-1">{errors.tool}</p>}
            </div>

            {/* PLAN */}
            <div>
              <label className="block mb-2 font-medium">Plan</label>
              <select
                value={formData.tools[0]?.selectedPlanId || ""}
                onChange={(e) => {
                  setErrors(prev => ({ ...prev, plan: "" }));
                  if (formData.tools.length > 0) {
                    updateTool(0, "selectedPlanId", e.target.value);
                  }
                }}
                className={`w-full border rounded-xl px-4 py-3 ${errors.plan ? "border-red-500" : ""}`}
              >
                <option value="">Select Plan</option>
                {getPlans(formData.tools[0]?.toolId || "").map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
              {errors.plan && <p className="text-red-500 text-sm mt-1">{errors.plan}</p>}
            </div>

            {/* MONTHLY SPEND */}
            <div>
              <label className="block mb-2 font-medium">Monthly Spend</label>
              <input
                type="number"
                min={0}
                value={formData.tools[0]?.monthlySpend || 0}
                onChange={(e) => {
                  setErrors(prev => ({ ...prev, spend: "" }));
                  if (formData.tools.length > 0) {
                    updateTool(0, "monthlySpend", Number(e.target.value));
                  }
                }}
                onFocus={(e) => {
                  if (formData.tools[0]?.monthlySpend === 0) {
                    e.target.select(); // This highlights the '0' so typing immediately replaces it
                  }
                }}
                className={`w-full border rounded-xl px-4 py-3 ${errors.spend ? "border-red-500" : ""}`}
                placeholder="1999"
              />
              {errors.spend && <p className="text-red-500 text-sm mt-1">{errors.spend}</p>}
            </div>

            {/* SEATS */}
            <div>
              <label className="block mb-2 font-medium">
                Seats (Actual AI Users)
              </label>
              <input
                type="number"
                min={1}
                value={formData.tools[0]?.seats}
                onChange={(e) => {
                  setErrors(prev => ({ ...prev, seats: "" }));
                  if (formData.tools.length > 0) {
                    updateTool(0, "seats", Number(e.target.value));
                  }
                }}
                onFocus={(e) => {
                  if (formData.tools[0]?.seats === 0) {
                    e.target.select(); // This highlights the '0' so typing immediately replaces it
                  }
                }}
                className={`w-full border rounded-xl px-4 py-3 ${errors.seats ? "border-red-500" : ""}`}
              />
              {errors.seats && <p className="text-red-500 text-sm mt-1">{errors.seats}</p>}
            </div>

            {/* TEAM SIZE */}
            <div>
              <label className="block mb-2 font-medium">Team Size</label>
              <input
                type="number"
                min={1}
                value={formData.teamSize || 0}
                onChange={(e) => {
                  setErrors(prev => ({ ...prev, teamSize: "" }));
                  setFormData((prev) => ({
                    ...prev,
                    teamSize: Number(e.target.value),
                  }));
                }}
                onFocus={(e) => {
                  if (formData.teamSize === 0) {
                    e.target.select(); // This highlights the '0' so typing immediately replaces it
                  }
                }}
                className={`w-full border rounded-xl px-4 py-3 ${errors.teamSize ? "border-red-500" : ""}`}
              />
              {errors.teamSize && <p className="text-red-500 text-sm mt-1">{errors.teamSize}</p>}
            </div>

            {/* PRIMARY USE CASE */}
            <div>
              <label className="block mb-2 font-medium">Primary Use Case</label>
              <select
                value={formData.primaryUseCase}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    primaryUseCase: e.target.value as PrimaryUseCase,
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
        <div id="audit-result" className="mt-12 space-y-8">
          {/* AI Summary Section */}
          {isGeneratingSummary ? (
            <div className="rounded-[28px] border border-white/10 bg-[#0f172a] p-7 text-white shadow-xl">
              <p className="text-gray-400">Generating personalized summary...</p>
            </div>
          ) : aiSummary && (
            <div className="rounded-[28px] border border-white/10 bg-[#0f172a] p-7 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-4">AI-Powered Summary</h3>
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
          {!leadSubmitted && (
            <div id="lead-form" className="rounded-[28px] border bg-white p-8 shadow-sm relative overflow-hidden">
              {/* Background subtle gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-50 to-transparent -z-0" />

              <div className="relative z-10">
                {/* Lock Icon Section */}
                <div className="flex items-start gap-5 mb-8">
                  <div className="relative group cursor-pointer" onClick={() => document.getElementById("lead-email")?.focus()}>
                    {/* Pulsing ring effect */}
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20" />

                    {/* Lock icon container */}
                    <div className="relative bg-gradient-to-br from-emerald-400 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      {/* Lock icon */}
                      <svg
                        className="w-8 h-8 text-white transition-all duration-500 group-hover:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-3xl font-black text-black flex items-center gap-2">
                      Unlock Your Shareable Report
                      <span className="inline-block animate-bounce">🔓</span>
                    </h2>
                    <p className="mt-2 text-gray-500 leading-relaxed">
                      Enter your email to generate a private link for your team.
                      Your data stays confidential — only the savings is visible publicly.
                    </p>
                  </div>
                </div>

                {/* Benefits badges */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Private & Secure
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Instantly
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Actionable Insights
                  </span>
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-5 items-start">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                    value={leadForm.website || ""}
                    onChange={(e) =>
                      setLeadForm((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                  />

                  <div className="min-h-[70px]">
                    <input
                      id="lead-email"
                      type="email"
                      placeholder="Email"
                      value={leadForm.email}
                      onChange={(e) => {
                        setLeadErrors(prev => ({ ...prev, email: "" }));
                        setLeadForm((prev) => ({ ...prev, email: e.target.value }));
                      }}
                      className={`border text-black rounded-2xl px-5 py-4 w-full ${leadErrors.email ? "border-red-500" : ""}`}
                    />
                    {leadErrors.email && <p className="text-red-500 text-sm mt-1">{leadErrors.email}</p>}
                  </div>

                  <div>
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
                      className="border text-black rounded-2xl px-5 py-4 w-full"
                    />
                  </div>

                  <div>
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
                      className="border text-black rounded-2xl px-5 py-4 w-full"
                    />
                  </div>

                  <button
                    onClick={handleLeadSubmit}
                    className="group relative rounded-2xl bg-black text-white px-6 py-4 font-semibold overflow-hidden transition-all duration-300 hover:bg-gray-900 hover:shadow-lg hover:shadow-gray-200 hover:-translate-y-0.5"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <span className="relative flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      Unlock Report
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>)}

          {/* SHAREABLE LINK */}
          {/* SHAREABLE LINK - Show after submission */}
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
                    setCopied(true);
                    setTimeout(() => setCopied(false), 500);
                  }}
                  className="rounded-2xl bg-white text-black px-6 py-4 font-semibold"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>

              {/* Divider */}
              <div className="flex flex-col justify-center items-center mt-8 pt-8 border-t border-white/10">
                <p className="text-gray-400 mb-4">
                 Think your other subscriptions might be leaking money?
                </p>
                <button
                  onClick={() => {
                    // Reset all states
                    setFormData(defaultForm);
                    setResult(null);
                    setAiSummary("");
                    setAuditId(null);
                    setLeadSubmitted(false);
                    setLeadForm({ email: "", company: "", role: "", website: "" });
                    setErrors({});
                    setLeadErrors({});
                    setCopied(false);
                    localStorage.removeItem("audit-form");

                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="rounded-2xl bg-white/10 border border-white/20 text-white px-6 py-4 font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Run a New Audit
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
