import { pricingData } from "./pricingData";
import { AuditResult, SpendAuditForm } from "../../types/data";

function getPlanPrice(
  toolId: string,
  planId: string
) {
  const tool = pricingData.find(
    (item) => item.id === toolId
  );

  if (!tool) return null;

  const plan = tool.plans.find(
    (item) => item.id === planId
  );

  return plan || null;
}

export function generateAudit(
  data: SpendAuditForm
): AuditResult[] {
  if (!data.tools?.length) {
    return [];
  }

  const results: AuditResult[] = [];

  data.tools.forEach((tool) => {
    const toolData = pricingData.find(
      (item) => item.id === tool.toolId
    );

    const selectedPlan = getPlanPrice(
      tool.toolId,
      tool.selectedPlanId
    );

    if (!toolData || !selectedPlan) {
      return;
    }

    const seats = Number(tool.seats || 1);
    const spend = Number(tool.monthlySpend || 0);
    const teamSize = Number(data.teamSize || 1);
    const useCase = data.primaryUseCase;

    let action:
      | "stay"
      | "upgrade"
      | "downgrade" = "stay";

    let recommendedPlan = selectedPlan.name;

    let optimizedMonthlyCost = spend;

    let reason =
      "Your current setup already appears reasonably optimized for your current usage pattern.";

    // =====================================================
    // CHATGPT
    // =====================================================

    if (tool.toolId === "chatgpt") {
      // FREE

      if (selectedPlan.id === "chatgpt-free") {
        if (
          (useCase === "coding" ||
            useCase === "research") &&
          seats >= 2
        ) {
          action = "upgrade";
          recommendedPlan = "Plus";
          optimizedMonthlyCost =
            1999 * seats;

          reason =
            "Coding and research workflows usually benefit from advanced reasoning, larger context windows, and higher usage limits available in Plus.";
        }
      }

      // GO

      else if (
        selectedPlan.id === "chatgpt-go"
      ) {
        if (
          (useCase === "coding" ||
            useCase === "research") &&
          seats >= 3 &&
          spend >= 1000
        ) {
          action = "upgrade";
          recommendedPlan = "Plus";
          optimizedMonthlyCost =
            1999 * seats;

          reason =
            "Your workflow appears heavier than typical lightweight usage and may benefit from advanced reasoning and expanded limits in Plus.";
        }

        else {
          action = "stay";
        }
      }

      // PLUS

      else if (
        selectedPlan.id === "chatgpt-plus"
      ) {
        if (
          useCase === "writing" &&
          seats === 1 &&
          spend <= 2500
        ) {
          action = "downgrade";
          recommendedPlan = "Go";
          optimizedMonthlyCost = 399;

          reason =
            "The current workflow appears relatively lightweight and may not require advanced reasoning and higher limits included in Plus.";
        }

        else if (
          seats >= 8 &&
          teamSize >= 10
        ) {
          action = "upgrade";
          recommendedPlan = "Business";
          optimizedMonthlyCost =
            1800 * seats;

          reason =
            "Shared workspace controls, centralized billing, and admin management become more valuable for growing collaborative teams.";
        }
      }

      // PRO

      else if (
        selectedPlan.id === "chatgpt-pro"
      ) {
        if (
          spend < 15000 &&
          teamSize < 10
        ) {
          action = "downgrade";
          recommendedPlan = "Plus";
          optimizedMonthlyCost =
            1999 * seats;

          reason =
            "Pro is typically best suited for extremely heavy AI usage. Your current setup may achieve similar results with the lower-cost Plus plan.";
        }
      }

      // BUSINESS

      else if (
        selectedPlan.id ===
        "chatgpt-business"
      ) {
        if (
          seats <= 3 &&
          teamSize <= 5
        ) {
          action = "downgrade";
          recommendedPlan = "Plus";
          optimizedMonthlyCost =
            1999 * seats;

          reason =
            "Business collaboration and governance features may be unnecessary for a very small active team.";
        }
      }
    }

    // =====================================================
    // GEMINI
    // =====================================================

    if (tool.toolId === "gemini") {
      // FREE

      if (
        selectedPlan.id === "gemini-free"
      ) {
        if (
          (useCase === "research" ||
            useCase === "data") &&
          seats >= 2
        ) {
          action = "upgrade";
          recommendedPlan = "AI Pro";
          optimizedMonthlyCost =
            1950 * seats;

          reason =
            "Research and data-heavy workflows may benefit from higher model limits and advanced Gemini capabilities available in AI Pro.";
        }
      }

      // PLUS

      else if (
        selectedPlan.id === "gemini-plus"
      ) {
        if (
          seats >= 10 &&
          useCase !== "writing"
        ) {
          action = "upgrade";
          recommendedPlan = "AI Pro";
          optimizedMonthlyCost =
            1950 * seats;

          reason =
            "Larger active usage across teams may justify higher limits and expanded feature access in AI Pro.";
        }
      }

      // ULTRA

      else if (
        selectedPlan.id === "gemini-ultra"
      ) {
        if (
          teamSize < 15 &&
          spend < 10000
        ) {
          action = "downgrade";
          recommendedPlan = "AI Pro";
          optimizedMonthlyCost =
            1950 * seats;

          reason =
            "Ultra-tier pricing may exceed the requirements of the current workflow and organization size.";
        }
      }
    }

    // =====================================================
    // CURSOR
    // =====================================================

    if (tool.toolId === "cursor") {
      if (useCase !== "coding") {
        action = "downgrade";
        recommendedPlan = "Hobby";
        optimizedMonthlyCost = 0;

        reason =
          "Cursor is primarily optimized for software engineering workflows and may provide limited value for non-coding tasks.";
      }

      else if (
        selectedPlan.id === "cursor-teams"
      ) {
        if (
          seats <= 3 &&
          teamSize <= 5
        ) {
          action = "downgrade";
          recommendedPlan = "Pro";
          optimizedMonthlyCost =
            1700 * seats;

          reason =
            "Team collaboration and centralized management features may be unnecessary for a very small engineering group.";
        }
      }

      else if (
        selectedPlan.id === "cursor-pro"
      ) {
        if (
          seats >= 10 &&
          teamSize >= 15
        ) {
          action = "upgrade";
          recommendedPlan = "Teams";
          optimizedMonthlyCost =
            3400 * seats;

          reason =
            "Larger engineering teams often benefit from shared rules, analytics, centralized billing, and collaboration workflows.";
        }
      }
    }

    // =====================================================
    // GITHUB COPILOT
    // =====================================================

    if (
      tool.toolId ===
      "github-copilot"
    ) {
      if (useCase !== "coding") {
        action = "downgrade";
        recommendedPlan = "Free";
        optimizedMonthlyCost = 0;

        reason =
          "GitHub Copilot provides the highest value in active software development workflows.";
      }

      else if (
        selectedPlan.id ===
          "copilot-enterprise" &&
        teamSize < 20
      ) {
        action = "downgrade";
        recommendedPlan = "Business";
        optimizedMonthlyCost =
          1600 * seats;

        reason =
          "Enterprise governance and advanced controls may be excessive for the current organization size.";
      }

      else if (
        selectedPlan.id ===
          "copilot-pro-plus" &&
        seats <= 2
      ) {
        action = "downgrade";
        recommendedPlan = "Pro";
        optimizedMonthlyCost =
          850 * seats;

        reason =
          "The current developer workflow may not require the expanded premium model access included in Pro+.";
      }
    }

    // =====================================================
    // CLAUDE
    // =====================================================

    if (tool.toolId === "claude") {
      if (
        selectedPlan.id === "claude-max"
      ) {
        if (
          spend < 12000 &&
          seats <= 3
        ) {
          action = "downgrade";
          recommendedPlan = "Pro";
          optimizedMonthlyCost =
            1700 * seats;

          reason =
            "Claude Max is generally best suited for extremely heavy usage and high daily workloads.";
        }
      }

      else if (
        selectedPlan.id === "claude-team"
      ) {
        if (
          seats < 5 &&
          teamSize < 8
        ) {
          action = "downgrade";
          recommendedPlan = "Pro";
          optimizedMonthlyCost =
            1700 * seats;

          reason =
            "Team collaboration functionality may not provide enough value for a small active user group.";
        }
      }

      else if (
        selectedPlan.id === "claude-pro"
      ) {
        if (
          seats >= 10 &&
          useCase === "research"
        ) {
          action = "upgrade";
          recommendedPlan = "Team";
          optimizedMonthlyCost =
            1700 * seats;

          reason =
            "Centralized management and collaboration features become more useful as research teams scale.";
        }
      }
    }
// =====================================================
    // WINDSURF
    // =====================================================

    if (tool.toolId === "windsurf") {
      // ---------------------------------
      // NON-CODING USERS
      // ---------------------------------

      if (useCase !== "coding") {
        action = "downgrade";
        recommendedPlan = "Free";
        optimizedMonthlyCost = 0;

        reason =
          "Windsurf is mainly designed for software development workflows, so the paid plan may not provide enough value for non-coding usage.";
      }

      // ---------------------------------
      // FREE
      // ---------------------------------

      else if (selectedPlan.id.includes("free")) {
        // small/light users can stay
        if (seats <= 2 && teamSize <= 3) {
          action = "stay";

          reason =
            "The free plan already appears sufficient for lightweight individual coding usage.";
        }

        // growing coding usage
        else {
          action = "upgrade";
          recommendedPlan = "Pro";
          optimizedMonthlyCost = 1700 * seats;

          reason =
            "Higher coding activity and AI-assisted development workflows may benefit from larger limits and better model access in the Pro plan.";
        }
      }

      // ---------------------------------
      // PRO
      // ---------------------------------

      else if (selectedPlan.id.includes("pro")) {
        // balanced setup
        if (seats <= 5 && teamSize <= 8) {
          action = "stay";

          reason =
            "The Pro plan already looks balanced for your current engineering workload and active usage.";
        }

        // bigger engineering teams
        else if (seats >= 6 || teamSize >= 10) {
          action = "upgrade";
          recommendedPlan = "Teams";
          optimizedMonthlyCost = 3400 * seats;

          reason =
            "Shared collaboration features, centralized billing, and analytics become more useful for larger engineering teams.";
        }
      }

      // ---------------------------------
      // MAX
      // ---------------------------------

      else if (selectedPlan.id.includes("max")) {
        // overkill for many users
        if (spend < 17000 && seats <= 3) {
          action = "downgrade";
          recommendedPlan = "Pro";
          optimizedMonthlyCost = 1700 * seats;

          reason =
            "The Max plan may be excessive unless the team relies heavily on high-volume AI coding workflows every day.";
        }

        // valid heavy usage
        else {
          action = "stay";

          reason =
            "Your current Windsurf Max setup appears justified for intensive AI-assisted engineering usage.";
        }
      }

      // ---------------------------------
      // TEAMS
      // ---------------------------------

      else if (selectedPlan.id.includes("teams")) {
        // small teams may not need it
        if (seats < 4 && teamSize < 6) {
          action = "downgrade";
          recommendedPlan = "Pro";
          optimizedMonthlyCost = 1700 * seats;

          reason =
            "The additional collaboration and administration features in Teams may be unnecessary for a smaller developer group.";
        }

        // proper teams usage
        else {
          action = "stay";

          reason =
            "The Teams plan already aligns well with your current engineering collaboration requirements.";
        }
      }
    }
  // =====================================================
    // CALCULATE FINANCIAL SAVINGS & PUSH RESULT
    // =====================================================

    const currentMonthlyCost = spend;
    const monthlySavings = Math.max(0, currentMonthlyCost - optimizedMonthlyCost);
    const annualSavings = monthlySavings * 12;

    results.push({
      toolName: toolData.name,
      currentPlan: selectedPlan.name,
      recommendedPlan,
      action,
      currentMonthlyCost,
      optimizedMonthlyCost,
      monthlySavings,
      annualSavings,
      reason,
    });
  });

  return results;
}

