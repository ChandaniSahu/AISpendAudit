import { generateAudit } from "../app/lib/auditEngine";
import { SpendAuditForm } from "../types/data";

// ============================================================
// AI Spend Audit Engine — Automated Tests
// ============================================================
// These tests exercise the real generateAudit() function using
// the project's actual pricing data and business logic.
// No mocking is used — we test what the user will actually see.
// ============================================================

describe("generateAudit() — Audit Engine Logic", () => {
  // -----------------------------------------------------------
  // Test 1: Downgrade recommendation
  // -----------------------------------------------------------
  // A single writer on ChatGPT Plus with low spend should be
  // recommended to downgrade to the cheaper Go plan.
  // -----------------------------------------------------------
  test("should recommend DOWNGRADE from ChatGPT Plus to Go for a solo writer with low spend", () => {
    const input: SpendAuditForm = {
      teamSize: 1,
      primaryUseCase: "writing",
      tools: [
        {
          toolId: "chatgpt",
          selectedPlanId: "chatgpt-plus",
          monthlySpend: 2000, // below the 2500 threshold
          seats: 1,
        },
      ],
    };

    const results = generateAudit(input);

    expect(results).toHaveLength(1);
    expect(results[0].toolName).toBe("ChatGPT");
    expect(results[0].action).toBe("downgrade");
    expect(results[0].recommendedPlan).toBe("Go");
    expect(results[0].optimizedMonthlyCost).toBe(399); // Go plan price
    expect(results[0].monthlySavings).toBe(2000 - 399);
    expect(results[0].reason).toContain("lightweight");
  });

  // -----------------------------------------------------------
  // Test 2: Upgrade recommendation
  // -----------------------------------------------------------
  // A team of 10+ using ChatGPT Plus with teamSize >= 10 should
  // be recommended to upgrade to Business for shared controls.
  // -----------------------------------------------------------
  test("should recommend UPGRADE from ChatGPT Plus to Business for large teams", () => {
    const input: SpendAuditForm = {
      teamSize: 10,
      primaryUseCase: "research",
      tools: [
        {
          toolId: "chatgpt",
          selectedPlanId: "chatgpt-plus",
          monthlySpend: 5000,
          seats: 8,
        },
      ],
    };

    const results = generateAudit(input);

    expect(results).toHaveLength(1);
    expect(results[0].toolName).toBe("ChatGPT");
    expect(results[0].action).toBe("upgrade");
    expect(results[0].recommendedPlan).toBe("Business");
    expect(results[0].optimizedMonthlyCost).toBe(1800 * 8); // 1800 per seat
    expect(results[0].reason).toContain("collaborative teams");
  });

  // -----------------------------------------------------------
  // Test 3: No-savings (stay) scenario
  // -----------------------------------------------------------
  // A small coding team on Cursor Free with minimal usage should
  // get a "stay" recommendation — no upgrade/downgrade needed.
  // -----------------------------------------------------------
  test("should recommend STAY for a small team on Cursor Free with light coding usage", () => {
    const input: SpendAuditForm = {
      teamSize: 3,
      primaryUseCase: "coding",
      tools: [
        {
          toolId: "windsurf",
          selectedPlanId: "windsurf-free",
          monthlySpend: 0,
          seats: 2,
        },
      ],
    };

    const results = generateAudit(input);

    expect(results).toHaveLength(1);
    expect(results[0].toolName).toBe("Windsurf");
    expect(results[0].action).toBe("stay");
    expect(results[0].currentPlan).toBe("Free");
    expect(results[0].monthlySavings).toBe(0);
    expect(results[0].annualSavings).toBe(0);
  });

  // -----------------------------------------------------------
  // Test 4: Annual savings calculation
  // -----------------------------------------------------------
  // When a downgrade generates monthly savings, verify that the
  // annualSavings field equals monthlySavings * 12 exactly.
  // -----------------------------------------------------------
  test("should calculate annual savings as monthlySavings * 12", () => {
    const input: SpendAuditForm = {
      teamSize: 1,
      primaryUseCase: "writing",
      tools: [
        {
          toolId: "chatgpt",
          selectedPlanId: "chatgpt-plus",
          monthlySpend: 2400, // well under the 2500 threshold
          seats: 1,
        },
      ],
    };

    const results = generateAudit(input);

    expect(results).toHaveLength(1);
    expect(results[0].action).toBe("downgrade");

    const expectedMonthly = 2400 - 399; // current spend - Go price
    expect(results[0].monthlySavings).toBe(expectedMonthly);
    expect(results[0].annualSavings).toBe(expectedMonthly * 12);
    expect(results[0].annualSavings).toBeGreaterThan(0);
  });

  // -----------------------------------------------------------
  // Test 5: Invalid / empty input handling
  // -----------------------------------------------------------
  // An empty tools array should return an empty audit result.
  // -----------------------------------------------------------
  test("should return empty array when tools array is empty", () => {
    const input: SpendAuditForm = {
      teamSize: 5,
      primaryUseCase: "coding",
      tools: [],
    };

    const results = generateAudit(input);

    expect(results).toEqual([]);
    expect(results).toHaveLength(0);
  });

  // -----------------------------------------------------------
  // Test 6: Multiple tools at once (bonus)
  // -----------------------------------------------------------
  // Verify that the audit engine can handle several tools in a
  // single submission and return correct results for each.
  // -----------------------------------------------------------
  test("should audit multiple tools in one submission", () => {
    const input: SpendAuditForm = {
      teamSize: 15,
      primaryUseCase: "coding",
      tools: [
        {
          toolId: "chatgpt",
          selectedPlanId: "chatgpt-plus",
          monthlySpend: 8000,
          seats: 8,
        },
        {
          toolId: "cursor",
          selectedPlanId: "cursor-pro",
          monthlySpend: 5000,
          seats: 10,
        },
        {
          toolId: "claude",
          selectedPlanId: "claude-pro",
          monthlySpend: 3000,
          seats: 10,
        },
      ],
    };

    const results = generateAudit(input);

    expect(results).toHaveLength(3);

    // ChatGPT Plus: 8 seats + teamSize 15 => upgrade to Business
    expect(results[0].action).toBe("upgrade");
    expect(results[0].recommendedPlan).toBe("Business");

    // Cursor Pro: 10 seats + teamSize 15 => upgrade to Teams
    expect(results[1].action).toBe("upgrade");
    expect(results[1].recommendedPlan).toBe("Teams");

    // Claude Pro: 10 seats + coding => stays (research needed for upgrade)
    expect(results[2].action).toBe("stay");
    expect(results[2].recommendedPlan).toBe("Pro");
  });
});