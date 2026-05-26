# REFLECTION.md

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug I faced was related to form validation and state synchronization in the audit form. The issue was happening when users changed the “Seats” field before selecting a tool. Even though the UI showed a value like `1`, validation still failed and marked the field as invalid.

At first, I thought the issue was caused by React state updates not completing fast enough before validation triggered. I added multiple console logs to check the form state before submission, but the values looked correct in some cases and undefined in others. Then I suspected localStorage hydration might be overwriting the values after render, so I tested the form with localStorage disabled, but the issue still existed.

After debugging the update flow carefully, I realized the actual problem was inside this condition:

```ts
if (formData.tools.length === 0)
```
---

## 2. A decision I reversed mid-week, and what made me reverse it

At the beginning, I wanted to keep the project very lightweight by handling everything only on the frontend. My original plan was to generate the audit locally in React state without storing anything in a database.

Mid-week, I realized this approach would not properly support important assignment requirements like:
- Public shareable audit URLs
- Lead capture connected to specific audits
- Transactional confirmation emails
- Future audit retrieval and tracking

Because of that, I decided to move audit storage to Firebase and generate unique audit IDs for every result.

This change increased the complexity of the project because I had to redesign parts of the data flow and carefully separate public audit data from private lead information..

Looking back, reversing this decision was the right choice because many of the best features in the project became possible only after introducing backend storage.

---

## 3. What I would build in week 2 if I had it

If I had another full week, I would focus on making the product feel more like a real SaaS platform instead of only an MVP.

The first thing I would improve is the audit engine. Right now, the recommendations are rule-based and intentionally simple. In week 2, I would add smarter analysis like:
- Better seat utilization detection
- Identifying overlapping AI subscriptions
- Team-level optimization suggestions
- Usage-based recommendations instead of static rules

I would also improve scalability and security by moving AI generation and email handling fully to backend APIs with proper rate limiting and caching.

For user experience, I would add:
- PDF export for audit reports
- Audit history dashboard
- Slack and LinkedIn sharing support
- Improved mobile responsiveness

---

## 4. How I used AI tools

I used different AI tools for different parts of the project instead of relying on a single tool for everything.

I mainly used ChatGPT for:
- File and folder structure suggestions
- UI/theme ideas
- Markdown documentation writing suggestions
- Small debugging help


For logo generation and visual experimentation, I used Gemini to create branding ideas and logo concepts for the project.

During development, I faced a large file size and debugging issue in one component. After spending time debugging it myself and narrowing down the possible causes, I used DeepSeek to help analyze the problem further and compare optimization approaches.

I did not blindly trust AI-generated code or suggestions. Most outputs required manual changes, cleanup, and validation before being added to the project. I mainly treated AI tools as assistants to speed up repetitive tasks and brainstorming, while keeping the final implementation decisions under my control.

---

## 5. Self-rating

### Discipline — 8/10
I stayed consistent throughout the project and worked across multiple days instead of trying to finish everything at the last moment. I also kept documenting decisions and progress regularly while building features step by step.

### Code Quality — 7/10
I believe the project structure is reasonably clean and maintainable, especially for an MVP. I used TypeScript, reusable logic, and organized data flow carefully, but there are still areas where I would further separate components and reduce repeated UI code.

### Design Sense — 8/10
I focused heavily on making the audit result page feel polished, modern, and shareable since that is the core experience of the product. The savings hero section, audit cards, and dark UI theme helped the product feel more premium and screenshot-friendly.

### Problem Solving — 8/10
During development I handled multiple issues related to validation, state management, audit storage, public/private data separation, and AI summary generation. I spent time understanding root causes instead of only applying quick fixes.

### Entrepreneurial Thinking — 7/10
While building the project, I tried to think beyond just completing features by focusing on lead capture, shareable results, user trust, and viral loops. I still think I can improve more on growth strategy and long-term business thinking, but this project helped me start approaching problems more like a product builder instead of only a developer.