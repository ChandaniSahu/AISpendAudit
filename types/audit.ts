export type UseCase =
  | "coding"
  | "writing"
  | "research"
  | "data"
  | "mixed";

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

export interface UserToolSpend {
  toolId: string;
  selectedPlanId: string;
  monthlySpend: number;
  seats: number;
}

export interface SpendAuditForm {
  tools: UserToolSpend[];
  teamSize: number;
  primaryUseCase: UseCase;
}