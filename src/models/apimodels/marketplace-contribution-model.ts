export interface MarketplaceContributionModel {
    subscribedPlan: string;
    subscribedPlanPrice?: string;
    solutions: SolutionModel[];
}

export interface SolutionModel {
    solution: string;
    domain?: string;
    subDomain?: string;
    certified?: boolean;
    ActiveForms?: string;
    availableTill?: string;
    status?: 'Active' | 'Inactive' | 'Pending';
    monthlyData: MonthlyDataModel[];
}

export interface MonthlyDataModel {
    month: string;
    usage: number;
    revenue: number;
}