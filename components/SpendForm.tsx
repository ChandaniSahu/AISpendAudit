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

    const auditResult =
      generateAudit(formData);

    console.log("AUDIT RESULT:");
    console.log(auditResult);

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
        {/* TEAM SECTION */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-5">
            Team Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
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
                value={
                  formData.primaryUseCase
                }
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

        {/* TOOLS SECTION */}

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-semibold">
              AI Tools
            </h2>

            <button
              type="button"
              onClick={addTool}
              className="bg-black text-white px-4 py-2 rounded-xl"
            >
              + Add Tool
            </button>
          </div>

          <div className="space-y-5">
            {formData.tools.map(
              (tool, index) => {
                const plans = getPlans(
                  tool.toolId
                );

                return (
                  <div
                    key={index}
                    className="border rounded-2xl p-5 "
                  >
                    <div className="grid lg:grid-cols-4 gap-4">
                      {/* TOOL */}

                      <div>
                        <label className="block mb-2 text-sm font-medium ">
                          Tool
                        </label>

                        <select
                          value={tool.toolId}
                          onChange={(e) =>
                            updateTool(
                              index,
                              "toolId",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-xl px-4 py-3"
                        >
                          <option value="">
                            Select Tool
                          </option>

                          {pricingData.map(
                            (item) => (
                              <option
                                key={item.id}
                                value={item.id}
                              >
                                {item.name}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      {/* PLAN */}

                      <div>
                        <label className="block mb-2 text-sm font-medium">
                          Plan
                        </label>

                        <select
                          value={
                            tool.selectedPlanId
                          }
                          onChange={(e) =>
                            updateTool(
                              index,
                              "selectedPlanId",
                              e.target.value
                            )
                          }
                          className="w-full border rounded-xl px-4 py-3"
                        >
                          <option value="">
                            Select Plan
                          </option>

                          {plans.map((plan) => (
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
                        <label className="block mb-2 text-sm font-medium">
                          Monthly Spend
                        </label>

                        <input
                          type="number"
                          min={0}
                          value={
                            tool.monthlySpend
                          }
                          onChange={(e) =>
                            updateTool(
                              index,
                              "monthlySpend",
                              Number(
                                e.target.value
                              )
                            )
                          }
                          className="w-full border rounded-xl px-4 py-3"
                          placeholder="1999"
                        />
                      </div>

                      {/* SEATS */}

                      <div>
                        <label className="block mb-2 text-sm font-medium">
                          Seats
                        </label>

                        <input
                          type="number"
                          min={1}
                          value={tool.seats}
                          onChange={(e) =>
                            updateTool(
                              index,
                              "seats",
                              Number(
                                e.target.value
                              )
                            )
                          }
                          className="w-full border rounded-xl px-4 py-3"
                        />
                      </div>
                    </div>

                    {/* REMOVE */}

                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          removeTool(index)
                        }
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              }
            )}
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
    </div>
  );
}