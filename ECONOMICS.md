# ECONOMICS.md — AI Spend Audit Unit Economics

## What a Converted Lead Is Worth to Credex

**Assumption:** Credex is a B2B spend management / credit platform. Typical revenue model is either:
- **Interchange / transaction fee:** ~1.5–2.5% on spend processed through the platform
- **SaaS subscription:** $500–$2,000/month per customer for analytics, controls, and reporting

For our model, I'll assume a blended model: median company spends $500K/year through Credex at a 2% take rate = **$10,000/year gross revenue per customer**. After cost of goods (credit risk, processing, support) at roughly 40%, **net contribution is ~$6,000/customer/year**.

A "converted lead" = someone who completes an AI Spend Audit → books a consultation with Credex → becomes a paying Credex customer.

**Value of a converted lead: $6,000/year LTV at ~85% gross retention = ~$5,100 net LTV over 3 years.**

However, most audit users won't convert. We need to think in terms of **pipe value**, not closed-won value.

If 1 in 200 audit users becomes a Credex customer, each audit user is worth **$5,100 / 200 = $25.50 in expected LTV**.

## CAC at Each Channel

| Channel | Cost Basis | Estimated Audits | Total Cost | CAC per Audit | Notes |
|---|---|---|---|---|---|
| **Indie Hackers / HN** | 0 (founder's time) | 10 | $0 | $0 | Pure organic — founder posts once |
| **X cold DMs** | 1 hr founder time (~$50) | 3 | $50 | $16.67 | Time cost only |
| **Reddit (r/SaaS)** | 0 (content post) | 15 | $0 | $0 | Content marketing — no paid promotion |
| **Slack communities** | 0 | 8 | $0 | $0 | Organic share, no ads |
| **X thread + replies** | 2 hrs (~$100) | 20 | $100 | $5.00 | Time cost only |
| **Product Hunt** | 0 (free launch) | 25 | $0 | $0 | Organic — no paid PH ads |
| **Referral loop** | 0 (built-in share) | 10 | $0 | $0 | Viral — costs nothing |
| **Credex finance channel** | 0 (existing relationships) | 25 | $0 | $0 | Unfair distribution — already trusted |
| **Total blended** | | **116** | **$150** | **$1.29** | Near-zero paid CAC |

**Key insight:** The first 100 users are essentially free to acquire. CAC only becomes a real line item once we exhaust organic channels and need paid acquisition (Google Ads, LinkedIn, sponsored posts).

## Conversion Rate Thresholds for Profitability

**The funnel:**
1. User completes audit → 100%
2. Audit user clicks "schedule a free savings consultation with Credex" → target: **8–12%**
3. Consultation → Credex credit account application → target: **20–25%**
4. Credit account application → approved and actively spending → target: **50–60%**
5. Active spender → repeat customer (3+ months) → **70%**

**End-to-end conversion (audit → repeat Credex customer):**
- Low estimate: 8% × 20% × 50% × 70% = **0.56%** (1 in 179)
- Target estimate: 12% × 25% × 60% × 70% = **1.26%** (1 in 79)
- Stretch estimate: 15% × 30% × 70% × 80% = **2.52%** (1 in 40)

**Breakeven calculation:**
- Cost to run the audit tool (infrastructure): ~$50/month for Firebase + hosting
- Cost per audit (variable): ~$0.02 for Groq API calls for AI summary
- Fixed overhead: negligible for a side tool

At **1.26% conversion** and **$6,000/customer net LTV**, each audit user is worth **$75.60 in expected revenue**.

The tool costs essentially nothing per user. So even at **0.56% conversion**, each audit user is worth **$28.56**. If CAC stays near zero through organic channels, the tool is profitable from user #1.

**The question flips:** It's not "can this be profitable?" — it's "how many audits can we drive before organic channels saturate?"

## What Would Need to Be True for $1M ARR in 18 Months

$1M ARR at $6,000/customer = **~167 paying Credex customers**.

Working backward from conversion assumptions:

**Scenario A (target 1.26% conversion):**
- Need 167 / 0.0126 = **13,254 audit users** in 18 months
- That's ~735 audits/month, or ~24 audits/day

**Scenario B (stretch 2.52% conversion):**
- Need 167 / 0.0252 = **6,627 audit users**
- That's ~368 audits/month, or ~12 audits/day

**To hit these numbers, the following must be true:**

1. **The audit tool needs 5x more tools.** Currently supports ~15 tools (ChatGPT, Gemini, Cursor, Copilot, Claude, Windsurf). Need to add Midjourney, Runway, Notion AI, Grammarly, Otter.ai, Fireflies, Jasper, Copy.ai, Perplexity, Poe, Replit, Cody, Tabnine, Amazon Q, and more. Growing to 50+ tools makes the audit relevant to more users.

2. **One organic channel must 10x.** The Credex finance channel is the most scalable — if Credex has 50 finance relationships, and each finance team runs the audit across their org (avg 50 employees), that's 2,500 audits from one channel alone. **The Credex channel alone could drive $1M ARR if conversion is at target.**

3. **Consultation booking rate must hit 12%+.** This requires the audit output to be valuable enough that users trust the recommendation and want to talk to a human. If the audit finds $3,000+/year in savings, the user is primed to listen.

4. **Marketing funnel must be built.** Need a simple newsletter ("Monthly AI Spend Report — how your costs compare to peers") that captures audit users who don't immediately convert and nurtures them over 6–12 months with market data and case studies. This could lift conversion from 1.26% to 2.5%+.

5. **Gross retention must stay at 85%+.** If Credex customers churn faster, the LTV drops and the math breaks. $1M ARR requires at least 140 active customers at any time, not just 167 ever.

**The simplest path to $1M ARR:** Credex has 50 finance relationships → each runs quarterly AI spend reviews → each review covers a 50-person engineering org → that's 10,000 audits/year at 1.26% conversion = 126 customers = **$756K ARR**. Add organic/PH/Reddit traffic for the remaining 41 customers. The goal is reachable with just the Credex channel working well.

## Summary Math

| Metric | Low | Target | Stretch |
|---|---|---|---|
| Audits/month (month 18) | 735 | 500 | 300 |
| Consultation rate | 8% | 12% | 15% |
| Close rate | 10% | 15% | 21% |
| End-to-end conversion | 0.56% | 1.26% | 2.52% |
| Paying customers (cumulative) | 167 | 167 | 167 |
| **ARR** | **$1M** | **$1M** | **$1M** |
| Months to $1M ARR | 18 | 14 | 10 |

The tool itself is a loss leader. Its purpose isn't direct revenue — it's a **trust-building top-of-funnel asset** that generates high-intent leads for Credex's core credit product. The unit economics work because the marginal cost of serving an audit user is $0.02, and the expected LTV of each user is $25–$75 at target conversion.