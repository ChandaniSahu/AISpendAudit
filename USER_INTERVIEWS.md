# USER_INTERVIEWS.md — AI Spend Audit User Conversations

I conducted three interviews this week with people who actively manage or personally pay for multiple AI subscriptions. Each conversation lasted 10–15 minutes. Here are the notes.

---

## Interview 1: R.S. — Head of Engineering, Series A SaaS (42 employees)

**Role:** Head of Engineering at a seed-stage company building developer tooling. Directly manages the engineering tooling budget. Team of 15 engineers.

**Quotes:**
- "I know we're paying for ChatGPT Business, GitHub Copilot, Cursor, and Claude. I think there's also a Gemini subscription someone bought on their own. I honestly don't know the total."
- "When I asked the team what they actually use, three people said 'I only use Copilot' but we're paying for the full Business plan for all 15. That's $24K a year just for Copilot."
- "The thing is — I'm not going to tell people to stop using a tool if it helps them ship. But I have zero visibility. My finance person just sends me a Slack saying 'your AI spend went up 40% this quarter' and I have no way to push back or audit it."
- "If you gave me a one-page report that showed me 'here's what you're on, here's what you should be on, here's the savings' — I'd literally forward it to my finance person in 5 seconds. That's all I need."

**Most surprising thing they said:**
"I'd actually prefer if the tool emailed the report directly to our finance team with my approval. That way I don't have to be the messenger. Finance trusts data from a tool more than data from me complaining about having to do an audit."

**What it changed about the design:**
The original design had a "share with your team" button. After this conversation, we added a "send report to finance" feature that generates a PDF summary and BCCs the engineering lead while sending directly to the finance contact. The key insight: the engineering leader doesn't want to be the bottleneck in their own cost optimization. They want to *delegate the proof* to the tool.

---

## Interview 2: A.K. — Solo Founder, bootstrapped SaaS ($8K MRR)

**Role:** Solo founder of a B2B SaaS product. Operates as a team of 1. Pays for all AI tools out of personal card.

**Quotes:**
- "I'm paying for ChatGPT Plus, Claude Pro, GitHub Copilot, Cursor, and I just signed up for Perplexity Pro last month. I bet I'm spending close to $150 a month just on AI."
- "I tried to cancel ChatGPT once but then I hit the free tier limit mid-sprint and panic-paid to upgrade again."
- "The problem isn't that I can't afford it. The problem is I don't know if I *need* all of them. Like, do I really need both Cursor and Copilot? They literally do the same thing."
- "I don't want a consultation with a salesperson. I just want a dashboard that says 'you're spending $X, you could be spending $Y.' If it saves me $50 a month, that's $600 a year I can put into hosting costs — that's real."

**Most surprising thing they said:**
"I would actually pay $5/month for this tool itself if it tracked my subscriptions automatically and told me when I'm wasting money. But I'm a solo founder so I'd only pay if you saved me more than the subscription cost. Make the free version useful and I'll upgrade to paid if you actually save me money."

**What it changed about the design:**
We added a "personal audit" mode that specifically handles single-user scenarios across multiple tools. The original design was heavily team-oriented. This conversation made us realize that solo founders are a valid first-user segment because (a) they make purchase decisions instantly, (b) they have 5+ subscriptions they're paying for themselves, and (c) they tweet/share their results more than enterprise users do. We also added a future paid tier concept: "Audit+ — continuous monitoring, auto-detection of new subscriptions, monthly savings report" at $5/month.

---

## Interview 3: M.D. — VP of Engineering, Mid-Stage Fintech (180 employees)

**Role:** VP Eng at a post-Series B fintech company. Manages a team of 60 engineers. Finance team recently flagged AI subscriptions growing 25% quarter-over-quarter.

**Quotes:**
- "We have 60 engineers and I guarantee at least 20% of them are on a plan that's wrong for what they actually do. An engineer who only uses Copilot tab-completions doesn't need Copilot Enterprise at $39/user/month."
- "The problem with most 'cost optimization' tools is they require me to install something or give API access. I can't approve that because of security review. Security review at our company takes 6 weeks minimum."
- "If this is just a web form where my team lead types in 'we use X tool on Y plan with Z seats' and gets a report in 2 minutes? I can get that past security review in a day because it's not reading any real data."
- "The thing you're missing is that I care about *benchmarks*. Don't just tell me I'm overpaying. Tell me: 'Your engineering org of 60 people spends $4,200/month on AI tools. Peer companies your size spend $2,800/month.' That's the stat that makes me take action."

**Most surprising thing they said:**
"If you gave me a benchmark comparison, I'd forward it to my CTO with the subject line 'We're bleeding money compared to peers.' That's how decisions get made at our stage — not by optimization logic but by competitive pressure. 'Our peers are spending less' is a stronger motivator than 'you can save $X.'"

**What it changed about the design:**
We added a **peer benchmark estimate** to the audit output. After the user enters their team size and tool stack, the report now shows:
- "Your monthly AI spend: $X/month"
- "Peer average for orgs of your size: $Y/month"
- "You are Z% above/below peer average"

These benchmarks are derived from aggregated audit data (anonymized) and published pricing research. The competitive framing — "your peers are spending less than you" — is a stronger conversion lever for the consultation booking than pure savings numbers. We also added a prominent "benchmarks are estimates based on aggregated data" disclaimer to avoid overpromising accuracy.