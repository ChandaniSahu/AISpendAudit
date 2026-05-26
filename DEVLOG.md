# DEVLOG.md

## Day 1 — 2026-05-21
**Hours worked:** 5

**What I did:**  
Started the project setup and created the landing page UI for the AI Spend Audit tool. Built the hero section, CTA buttons, and basic responsive layout using Tailwind CSS. Also decided the overall dark theme styling for the product.

**What I learned:**  
how we can make homepage code clean like diving homepage in several components and pass needed props

**Blockers / what I'm stuck on:**  
There is no any major blocker but very small confusion that which theme will be look good light or dark

**Plan for tomorrow:**  
Build the spend form and start collecting audit inputs from users.


## Day 2 — 2026-05-22
**Hours worked:** 6

**What I did:**  
Created the spend audit form with fields like tool name, monthly spend, seats, team size, and use case. Added localStorage persistence so users don’t lose form data on refresh. Integrated Firebase and tested storing simple audit records.

**What I learned:**  
I have already used firebase so using firebase in this project its like rebrushing the concepts

**Blockers / what I'm stuck on:**  
As i mentioned I used firebase couple of months later so i forgot to create storage rule before storing data so there is showing storage error

**Plan for tomorrow:**  
Collect pricing data and start building the audit engine logic.


## Day 3 — 2026-05-23
**Hours worked:** 7

**What I did:**  
Collected pricing information from official AI tool pricing pages and created the first version of the audit engine. Added recommendation logic to compare plans and estimate savings opportunities.

**What I learned:**  
I learned that how we can collect pricing data easily through some ai tools.

**Blockers / what I'm stuck on:**  
In some pricing pages there is written contact for pricing in some of plans

**Plan for tomorrow:**  
Improve audit calculations and redesign the result section.


## Day 4 — 2026-05-24
**Hours worked:** 6

**What I did:**  
Optimized the audit engine logic and improved the audit result UI. Added monthly savings, annual savings, recommendation cards, cost comparison sections, and different states for low savings vs high savings users.

**What I learned:**  
Learned that how to make optimized enginlogic file for any logical operation.

**Blockers / what I'm stuck on:**  
optimization of rules of engine logic take alots of time
**Plan for tomorrow:**  
Add AI summaries, lead capture, shareable URLs, and transactional email flow.


## Day 5 — 2026-05-25
**Hours worked:** 8

**What I did:**  
- Added AI-generated personalized summaries using Groq API  
- Implemented public shareable audit URLs  
- Created Firebase storage flow for audit results and lead submissions  
- Built transactional email sending route using Nodemailer  
- Added toast notifications and validation handling  
- Added homepage email collection CTA  
- Added basic bot protection using hidden honeypot field

**What I learned:**  
Learned how important graceful fallback handling is when AI APIs fail or return unexpected responsesfand I have learned honeypot.

**Blockers / what I'm stuck on:**  
no major blocker

**Plan for tomorrow:**  
Finish documentation, improve project structure, and prepare tests.


## Day 6 — 2026-05-26
**Hours worked:** 5

**What I did:**  
Worked on all required markdown documentation files including README, ARCHITECTURE, DEVLOG, REFLECTION, PRICING_DATA. Also cleaned the project structure and reviewed the overall flow.

**What I learned:**  
Writing documentation properly takes much longer than expected, especially when trying to explain technical decisions clearly.

**Blockers / what I'm stuck on:**  
Still need to improve automated testing coverage for the audit engine logic.

**Plan for tomorrow:**  
Add remaining tests, review deployment once more, and polish the UI details before final submission.


## Day 7 — 2026-05-27
**Hours worked:** 2

**What I did:**  
Final testing, deployment checks, lint cleanup, GitHub workflow setup, and small UI polish updates. Reviewed all markdown files again and verified Firebase + email flow one last time.

**What I learned:**  
Small edge-case bugs usually appear near the end of projects, especially around validation and asynchronous operations.

**Blockers / what I'm stuck on:**  
No major blockers today.

