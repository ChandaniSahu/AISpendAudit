import { AITool } from "../../types/data";

export const pricingData: AITool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    category: "chat",
    plans: [
      {
        id: "chatgpt-free",
        name: "Free",
        monthlyPrice: 0,
        pricingModel: "seat",
        sourceUrl: "https://chatgpt.com/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "chatgpt-go",
        name: "Go",
        monthlyPrice: 399, // Kept original regional INR price from chatgpt.jpg
        pricingModel: "seat",
        sourceUrl: "https://chatgpt.com/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "chatgpt-plus",
        name: "Plus",
        monthlyPrice: 1999, // Kept original regional INR price from chatgpt.jpg
        pricingModel: "seat",
        sourceUrl: "https://chatgpt.com/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "chatgpt-pro",
        name: "Pro",
        monthlyPrice: 10699, // Kept original regional INR price from chatgpt.jpg
        pricingModel: "seat",
        sourceUrl: "https://chatgpt.com/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "chatgpt-business",
        name: "Business",
        monthlyPrice: 1800, // Kept original regional INR price from chatgpt.jpg
        pricingModel: "seat",
        notes: "Per user billed annually",
        sourceUrl: "https://chatgpt.com/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "openai-api",
        name: "OpenAI API",
        monthlyPrice: 2000,
        pricingModel: "usage",
        notes: "Token based pricing",
        sourceUrl: "https://openai.com/api/pricing",
        verifiedAt: "2026-05-24",
      },
    ],
  },

  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    category: "chat",
    plans: [
      {
        id: "claude-free",
        name: "Free",
        monthlyPrice: 0,
        pricingModel: "seat",
        sourceUrl: "https://claude.ai/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "claude-pro",
        name: "Pro",
        monthlyPrice: 1914, // Converted from $20 USD based on claude1.jpg / claude2.jpg
        pricingModel: "seat",
        sourceUrl: "https://claude.ai/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "claude-max",
        name: "Max",
        monthlyPrice: 9570, // Converted from $100 USD based on claude1.jpg
        pricingModel: "seat",
        notes: "Starting price",
        sourceUrl: "https://claude.ai/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "claude-team",
        name: "Team",
        monthlyPrice: 1914, // Converted from $20 USD based on claude2.jpg
        pricingModel: "seat",
        notes: "Per seat billed annually",
        sourceUrl: "https://claude.ai/pricing",
        verifiedAt: "2026-05-24",
      },
    
      {
        id: "anthropic-api",
        name: "Anthropic API",
        monthlyPrice: 3340,
        pricingModel: "usage",
        sourceUrl: "https://anthropic.com/pricing",
        verifiedAt: "2026-05-24",
      },
    ],
  },

  {
    id: "cursor",
    name: "Cursor",
    vendor: "Cursor",
    category: "coding",
    plans: [
      {
        id: "cursor-hobby",
        name: "Hobby",
        monthlyPrice: 0,
        pricingModel: "seat",
        sourceUrl: "https://cursor.com/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "cursor-pro",
        name: "Pro",
        monthlyPrice: 1914, // Converted from $20 USD based on cursor.jpg
        pricingModel: "seat",
        sourceUrl: "https://cursor.com/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "cursor-pro-plus",
        name: "Pro+",
        monthlyPrice: 5742, // Converted from $60 USD reference tier
        pricingModel: "seat",
        sourceUrl: "https://cursor.com/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "cursor-ultra",
        name: "Ultra",
        monthlyPrice: 19140, // Converted from $200 USD reference tier
        pricingModel: "seat",
        sourceUrl: "https://cursor.com/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "cursor-teams",
        name: "Teams",
        monthlyPrice: 3828, // Converted from $40 USD based on cursor.jpg
        pricingModel: "seat",
        sourceUrl: "https://cursor.com/pricing",
        verifiedAt: "2026-05-24",
      },
    ],
  },

  {
    id: "github-copilot",
    name: "GitHub Copilot",
    vendor: "GitHub",
    category: "coding",
    plans: [
      {
        id: "copilot-free",
        name: "Free",
        monthlyPrice: 0,
        pricingModel: "seat",
        sourceUrl: "https://github.com/features/copilot",
        verifiedAt: "2026-05-24",
      },
      {
        id: "copilot-pro",
        name: "Pro",
        monthlyPrice: 957, // Converted from $10 USD based on githubcopilet1.jpg
        pricingModel: "seat",
        sourceUrl: "https://github.com/features/copilot",
        verifiedAt: "2026-05-24",
      },
      {
        id: "copilot-pro-plus",
        name: "Pro+",
        monthlyPrice: 3732, // Converted from $39 USD based on githubcopilet1.jpg
        pricingModel: "seat",
        sourceUrl: "https://github.com/features/copilot",
        verifiedAt: "2026-05-24",
      },
      {
        id: "copilot-business",
        name: "Business",
        monthlyPrice: 1818, // Converted from $19 USD based on githubcopilet2.jpg
        pricingModel: "seat",
        sourceUrl: "https://github.com/features/copilot",
        verifiedAt: "2026-05-24",
      },
      {
        id: "copilot-enterprise",
        name: "Enterprise",
        monthlyPrice: 3732, // Converted from $39 USD based on githubcopilet2.jpg
        pricingModel: "seat",
        sourceUrl: "https://github.com/features/copilot",
        verifiedAt: "2026-05-24",
      },
    ],
  },

  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    category: "chat",
    plans: [
      {
        id: "gemini-free",
        name: "Free",
        monthlyPrice: 0,
        pricingModel: "seat",
        sourceUrl: "https://gemini.google/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "gemini-plus",
        name: "AI Plus",
        monthlyPrice: 399, // Kept original regional INR price from gemini.jpg
        pricingModel: "seat",
        sourceUrl: "https://gemini.google/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "gemini-pro",
        name: "AI Pro",
        monthlyPrice: 1950, // Kept original regional INR price from gemini.jpg
        pricingModel: "seat",
        sourceUrl: "https://gemini.google/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "gemini-ultra",
        name: "AI Ultra",
        monthlyPrice: 6500, // Kept original regional INR price from gemini.jpg
        pricingModel: "seat",
        sourceUrl: "https://gemini.google/pricing",
        verifiedAt: "2026-05-24",
      },
    ],
  },

  {
    id: "windsurf",
    name: "Windsurf",
    vendor: "Codeium",
    category: "coding",
    plans: [
      {
        id: "windsurf-free",
        name: "Free",
        monthlyPrice: 0,
        pricingModel: "seat",
        sourceUrl: "https://windsurf.com/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "windsurf-pro",
        name: "Pro",
        monthlyPrice: 1914, // Converted from global $20 USD tier
        pricingModel: "seat",
        sourceUrl: "https://windsurf.com/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "windsurf-max",
        name: "Max",
        monthlyPrice: 19140, // Converted from global $200 USD tier
        pricingModel: "seat",
        sourceUrl: "https://windsurf.com/pricing",
        verifiedAt: "2026-05-24",
      },
      {
        id: "windsurf-teams",
        name: "Teams",
        monthlyPrice: 3828, // Converted from global $40 USD tier
        pricingModel: "seat",
        sourceUrl: "https://windsurf.com/pricing",
        verifiedAt: "2026-05-24",
      },
    ],
  },
];