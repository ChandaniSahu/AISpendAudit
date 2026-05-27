# AI Spend Audit — Test Documentation

## Overview

This document describes the automated test suite for the AI Spend Audit engine. The tests verify the core audit logic in `lib/auditEngine.ts` using real pricing data — no mocking is used.

## Test File

| File | Description |
|------|-------------|
| `__tests__/auditEngine.test.ts` | Main test file for the `generateAudit()` function |

## What Each Test Covers

### Test 1: Downgrade Recommendation
- **Scenario:** A solo writer using ChatGPT Plus with a monthly spend of ₹2,000 (below the ₹2,500 threshold).
- **Expected:** The engine recommends a **downgrade** from Plus to the cheaper Go plan (₹399/seat).
- **Verifies:** `action === "downgrade"`, correct `recommendedPlan`, `optimizedMonthlyCost`, `monthlySavings`, and the `reason` message.

### Test 2: Upgrade Recommendation
- **Scenario:** A team of 10+ using ChatGPT Plus with 8 seats.
- **Expected:** The engine recommends an **upgrade** to Business (₹1,800/seat) because `seats >= 8 && teamSize >= 10`.
- **Verifies:** `action === "upgrade"`, correct `recommendedPlan` and `optimizedMonthlyCost`, and the `reason` message mentions collaborative teams.

### Test 3: No-Savings (Stay) Scenario
- **Scenario:** A small team of 3 on Windsurf Free with 2 seats and minimal usage.
- **Expected:** The engine recommends to **stay** on the current plan. Monthly and annual savings are ₹0.
- **Verifies:** `action === "stay"`, `monthlySavings === 0`, `annualSavings === 0`.

### Test 4: Annual Savings Calculation
- **Scenario:** A solo writer on ChatGPT Plus with ₹2,400 monthly spend. The engine recommends a downgrade to Go (₹399).
- **Expected:** `annualSavings` equals `monthlySavings * 12` exactly.
- **Verifies:** The financial calculation is mathematically correct.

### Test 5: Invalid / Empty Input Handling
- **Scenario:** An otherwise valid form with an empty `tools` array.
- **Expected:** The engine returns an empty array `[]`.
- **Verifies:** Edge-case robustness — the engine doesn't crash or produce invalid results.

### Test 6: Multiple Tools in One Submission
- **Scenario:** A single form submission with three tools: ChatGPT Plus (8 seats), Cursor Pro (10 seats), and Claude Pro (10 seats).
- **Expected:** Each tool is evaluated independently with correct recommendations:
  - ChatGPT → **upgrade** to Business (8 seats + teamSize 15)
  - Cursor → **upgrade** to Teams (10 seats + teamSize 15)
  - Claude → **stay** on Pro (coding use case, not research)
- **Verifies:** The engine handles concurrent tool audits correctly.

## How to Run Tests

```bash
# Run all tests with verbose output
npm test

# Run tests in watch mode (re-runs on file changes)
npx jest --watch

# Run a single test file
npx jest __tests__/auditEngine.test.ts

# Run a specific test by name
npx jest -t "downgrade"
```

## Test Output (Passing)

```
PASS  __tests__/auditEngine.test.ts
  generateAudit() — Audit Engine Logic
    ✓ should recommend DOWNGRADE from ChatGPT Plus to Go for a solo writer with low spend (5 ms)
    ✓ should recommend UPGRADE from ChatGPT Plus to Business for large teams (2 ms)
    ✓ should recommend STAY for a small team on Cursor Free with light coding usage (1 ms)
    ✓ should calculate annual savings as monthlySavings * 12 (5 ms)
    ✓ should return empty array when tools array is empty (2 ms)
    ✓ should audit multiple tools in one submission (1 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

## Project Structure

```
aispendaudit/
├── __tests__/
│   └── auditEngine.test.ts    ← Test file
├── lib/
│   ├── auditEngine.ts          ← Function under test
│   └── pricingData.ts          ← Pricing data used by the engine
├── types/
│   └── data.ts                 ← TypeScript interfaces
├── jest.config.js              ← Jest configuration
├── package.json                ← Test script: "jest --verbose"
└── TESTS.md                    ← This file
```

## Notes

- Tests use **real pricing data** from `lib/pricingData.ts` — no fixtures or mocks.
- The `ts-jest` transformer compiles TypeScript on the fly for Jest.
- `jest.config.js` is configured for a **Node environment** (no DOM needed).