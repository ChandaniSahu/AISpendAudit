"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { AuditData } from "@/types/data";

export default function PublicAuditPage() {
    const { auditId } = useParams();
    const [auditData, setAuditData] = useState<AuditData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAudit = async () => {
            try {
                const docRef = doc(db, "audits", auditId as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as AuditData;

                    // Validate the data structure
                    if (!data.auditResult || !Array.isArray(data.auditResult)) {
                        setError("Invalid audit data structure");
                        return;
                    }

                    setAuditData(data);
                } else {
                    setError("Audit not found");
                }
            } catch (err) {
                console.error("Error fetching audit:", err);
                setError("Failed to load audit");
            } finally {
                setLoading(false);
            }
        };

        if (auditId) {
            fetchAudit();
        }
    }, [auditId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                    <div className="text-white text-xl">Loading audit...</div>
                </div>
            </div>
        );
    }

    if (error || !auditData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-3xl font-bold text-white mb-2">Audit Not Found</h1>
                    <p className="text-gray-400 text-lg">
                        {error || "The audit you're looking for doesn't exist or has been removed."}
                    </p>
                </div>
            </div>
        );
    }

    // Destructure with correct field names
    const {
        auditResult, // Note: this is the correct field name from your DB
        aiSummary,   // Note: this is the correct field name from your DB
        totalMonthlySavings,
        totalAnnualSavings,
        formData
    } = auditData;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* ======================================== */}
                {/* BRAND HEADER */}
                {/* ======================================== */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                        AI Spend Audit
                    </h1>
                    <p className="mt-4 text-gray-400 text-lg">
                        Optimization Analysis for {formData?.primaryUseCase || "your"} use case
                    </p>
                </div>

                {/* ======================================== */}
                {/* TOTAL SAVINGS HERO */}
                {/* ======================================== */}
                <div className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#111827] to-black p-8 mb-8 shadow-2xl">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/80">
                                Potential Savings Identified
                            </p>

                            <h2 className="mt-4 text-5xl font-black leading-tight lg:text-6xl">
                                ₹{totalMonthlySavings?.toLocaleString() || "0"}
                                <span className="text-2xl font-semibold text-gray-400 lg:text-3xl">
                                    /month
                                </span>
                            </h2>

                            <p className="mt-4 text-lg text-gray-300">
                                ₹{totalAnnualSavings?.toLocaleString() || "0"}/year optimization opportunity
                            </p>
                        </div>

                        {/* STATUS BADGE */}
                        <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                            {totalMonthlySavings < 100 ? (
                                <>
                                    <h3 className="text-2xl font-bold text-emerald-400">
                                        AI Spend Looks Healthy ✨
                                    </h3>
                                    <p className="mt-3 text-gray-300 leading-7">
                                        No major optimization opportunities identified. The current AI stack appears reasonably optimized.
                                    </p>
                                </>
                            ) : totalMonthlySavings >= 500 ? (
                                <>
                                    <h3 className="text-2xl font-bold text-emerald-400">
                                        Significant Savings Opportunity 🚀
                                    </h3>
                                    <p className="mt-3 text-gray-300 leading-7">
                                        Meaningful optimization opportunities detected in the current stack.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold text-emerald-400">
                                        Moderate Optimization Opportunity 📊
                                    </h3>
                                    <p className="mt-3 text-gray-300 leading-7">
                                        A few adjustments could improve cost efficiency.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ======================================== */}
                {/* AI SUMMARY */}
                {/* ======================================== */}
                {aiSummary && (
                    <div className="rounded-[28px] bg-white/5 border border-white/10 p-8 mb-8">
                        <h2 className="text-3xl font-black mb-4">
                            🤖 AI Analysis Summary
                        </h2>
                        <p className="text-lg leading-8 text-gray-300">
                            {aiSummary}
                        </p>
                    </div>
                )}

                {/* ======================================== */}
                {/* TOOL BREAKDOWN */}
                {/* ======================================== */}
                <div className="space-y-6 mb-12">
                    {auditResult && auditResult.length > 0 ? (
                        auditResult.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-[28px] border border-white/10 bg-[#0f172a] p-7 shadow-xl"
                            >
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                    {/* LEFT SECTION */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-6">
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
                                                {item.action?.toUpperCase() || "STAY"}
                                            </span>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3 mb-6">
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
                                                <p className="text-sm text-gray-400">Monthly Savings</p>
                                                <h4 className="mt-2 text-2xl font-bold text-emerald-400">
                                                    ₹{item.monthlySavings?.toLocaleString() || "0"}
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                            <p className="text-sm uppercase tracking-wide text-gray-400 mb-2">
                                                Recommendation Reason
                                            </p>
                                            <p className="text-lg leading-8 text-gray-300">
                                                {item.reason}
                                            </p>
                                        </div>
                                        <div className="mt-5">
                                            <p className="text-sm uppercase tracking-wide text-gray-400 mb-2">
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

                                    {/* RIGHT SECTION - Cost Comparison */}
                                    <div className="w-full lg:max-w-sm rounded-3xl border border-white/10 bg-black/30 p-6">
                                        <p className="text-sm uppercase tracking-wide text-gray-400 mb-6">
                                            Cost Comparison
                                        </p>

                                        <div className="space-y-5">
                                            <div>
                                                <p className="text-sm text-gray-400">Current Monthly</p>
                                                <h4 className="mt-1 text-3xl font-black text-red-300">
                                                    ₹{item.currentMonthlyCost?.toLocaleString() || "0"}
                                                </h4>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-400">Optimized Monthly</p>
                                                <h4 className="mt-1 text-3xl font-black text-emerald-400">
                                                    ₹{item.optimizedMonthlyCost?.toLocaleString() || "0"}
                                                </h4>
                                            </div>

                                            <div className="border-t border-white/10 pt-5">
                                                <p className="text-sm text-gray-400">Annual Savings</p>
                                                <h4 className="mt-1 text-4xl font-black">
                                                    ₹{item.annualSavings?.toLocaleString() || "0"}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            No audit results available
                        </div>
                    )}
                </div>

                {/* ======================================== */}
                {/* FOOTER - Brand attribution only */}
                {/* ======================================== */}
                <div className="text-center border-t border-white/10 pt-8">
                    <p className="text-gray-500">
                        Generated by AI Spend Audit Tool • {auditData.timestamp ? new Date(auditData.timestamp).toLocaleDateString() : "Recently"}
                    </p>
                </div>
            </div>
        </div>
    );
}