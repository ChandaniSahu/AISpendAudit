# METRICS.md — AI Spend Audit Metrics

## North Star Metric

**Number of completed audits.**

Not signups. Not page views. Not "users who started the form." Completed audits.

**Why this is the North Star:**
- A completed audit is the single strongest signal of intent. Someone who finishes the audit has (a) experienced the core value proposition firsthand, (b) seen their potential savings in dollars, and (c) proven they're willing to invest 2 minutes of attention.
- Every audit completion creates a shareable asset (the report URL) that drives organic distribution.
- A completed audit is the only prerequisite for Credex lead conversion. No one converts to a Credex consultation without first completing an audit.
- It's a leading indicator for every downstream business outcome — consultations booked, credit accounts opened, revenue generated.

At this stage (pre-seed, pre-distribution), nothing else matters more than proving people will complete the audit and find value. If we hit 1,000 completed audits in the first 90 days, we'll have enough signal to know whether the funnel economics work.

## 3 Input Metrics That Drive the North Star

**1. Audit start → completion rate (conversion efficiency)**
- Target: >60% of users who start the form complete it
- Current baseline (if tests exist): N/A — need to instrument
- Why: If this is low, the form is too long, confusing, or the perceived effort outweighs the perceived value. A drop below 40% means either the tool coverage is too narrow (user can't find their stack) or the UX is broken.
- How to move it: Reduce form friction (auto-suggest tools, pre-fill common plans), show a live "savings estimate" as they add each tool, add progress bar

**2. Audit completion → report shared (distribution efficiency)**
- Target: >15% of users share their report (click share button, copy link, send to finance)
- Why: This is the zero-cost growth engine. Each share brings new users without spend. If this is below 5%, the report output isn't impressive enough, share UI is buried, or there's no incentive.
- How to move it: Add social-share-friendly output ("I saved $X/year — see your savings"), make share button prominent post-audit, add "compare with your team" prompt

**3. Inbound tool requests per week (coverage signal)**
- Target: >5 unique tool requests per week within 8 weeks of launch
- Why: The biggest risk to completion rate is "my tool isn't listed." If we're not getting tool requests, either no one is hitting coverage gaps (unlikely) or users are bouncing silently without requesting. Both are bad. Tool requests are a direct signal of which tools to add next and a proxy for user engagement depth.
- How to move it: Add "didn't find your tool?" button at tool selection step, prioritize requests with upvote system, publish public roadmap of upcoming tool additions

## What I'd Instrument First

**Day 1 — before shipping anything else, instrument these events:**

1. **`audit_form_opened`** — User lands on the audit form page
2. **`tool_added`** — User adds a tool to their stack (include `tool_id` parameter so we can see which tools are being searched for but not found)
3. **`tool_not_found`** — User searched for a tool that's not in our database. This is the most important event to catch coverage gaps.
4. **`audit_completed`** — User finishes and sees results
5. **`report_shared`** — User copies share link, emails report, or clicks social share
6. **`consultation_clicked`** — User clicks "book a free savings review" CTA inside the audit results
7. **`tool_requested`** — User submits a request for a tool not in our database

**Instrumentation approach:**
- Use Firebase Analytics (already in the stack) for event tracking — zero additional cost
- Set up a simple Google Data Studio dashboard that refreshes daily showing:
  - Daily completed audits (line chart)
  - Completion rate (gauge)
  - Top 10 tools added (bar chart)
  - Tool requests by tool name (table)
  - Share rate (percentage + count)
- Create a Slack webhook that posts to #metrics channel whenever `audit_completed` fires, so the team feels every single completion in real time during the first 90 days

**Week 2 instrumentation addition:**
- Add UTM parameter tracking to understand which distribution channels drive the highest-quality audits (highest completion rate, highest share rate)
- Add `referrer` capture to see if people are coming from shared report URLs

## What Number Triggers a Pivot Decision

**Hard pivot signal: Fewer than 200 completed audits in the first 90 days (<2.2/day).**

**Why 200:** If we can't get ~2–3 people per day to complete a 2-minute form about a problem they demonstrably have, one of three things is true:
1. The pain of "managing AI subscriptions" isn't real enough for people to invest 2 minutes
2. The tool coverage is too narrow for most users to find their stack
3. The form UX is fundamentally broken

**Action on pivot signal:**
- Week 4 check: If <50 completed audits in first 30 days, do a qualitative audit-run with 5 users via screen share to understand where they're dropping off
- Week 8 check: If <120 completed audits in first 60 days, the issue is likely #1 (pain not real) or #3 (UX). Conduct 10 more user interviews specifically about the form experience.
- Day 90 decision: If <200 audits completed, pivot options:
  - **Pivot A (channel):** If audits are low but tool requests are high (>50 requests), the problem is distribution, not product. Double down on Credex finance channel.
  - **Pivot B (scope):** If tool requests are low (<10 total), the tool doesn't cover enough tools. Need to manually add 20+ more tools before re-launching.
  - **Pivot C (problem):** If completion rate is >60% but total audits are <200, the problem is simply not enough people visiting the site. This is a distribution failure, not a product failure — but at this stage, we can't spend on distribution, so the product needs a built-in viral mechanism that isn't working.

**Secondary pivot signal: Share rate below 5% with >200 audits completed.**
If people complete the audit but don't share, the output isn't remarkable enough. The output needs to feel like a reveal ("I can't believe I was overpaying by THIS much"). If it's just a table of numbers, no one shares it. Redesign the audit report to be more visual, more surprising, and more ego-relevant ("Here's how your AI spend compares to your peers").

**Green flag that kills the pivot:**
If we hit 1,000 completed audits in the first 90 days with >15% share rate and >50 unique tool requests, the product clearly has product-market fit for the free audit tool. The only question becomes how efficiently it converts to Credex revenue, which is a separate sales/marketing question — not a product question.