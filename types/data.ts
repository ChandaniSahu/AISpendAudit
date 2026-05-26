export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number | null;
  pricingModel: "seat" | "usage" | "custom";
  yearlyDiscount?: boolean;
  notes?: string;
  recommendedFor?: string[];
  sourceUrl: string;
  verifiedAt: string;
}

export interface AITool {
  id: string;
  name: string;
  category: "chat" | "coding" | "api" | "workspace";
  vendor: string;
  logo?: string;
  plans: PricingPlan[];
}


export type PrimaryUseCase =
  | "coding"
  | "writing"
  | "research"
  | "data"
  | "mixed";


export interface ToolSpend {
  toolId: string;
  selectedPlanId: string;
  monthlySpend: number;
  seats: number;
}

export interface SpendAuditForm {
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  tools: ToolSpend[];
}

export interface AuditResult {
  toolName: string;
  currentPlan: string;
  recommendedPlan: string;
  action: "stay" | "upgrade" | "downgrade";
  currentMonthlyCost: number;
  optimizedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
}

export interface AuditData {
    auditId: string;
    createdAt?: number;
    timestamp?: string;
    auditResult: AuditResult[];
    aiSummary: string;
    totalMonthlySavings: number;
    totalAnnualSavings: number;
    formData: {
        primaryUseCase: string;
        teamSize: number;
    };
    // Hide these from public view
    lead?: {
        email: string;
        company: string;
        role: string;
    };
    userId?: string;
}
