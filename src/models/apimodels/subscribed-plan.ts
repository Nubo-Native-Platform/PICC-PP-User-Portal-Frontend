export interface SubscribedPlanModel {
    subscribedPlan: string;
    subscribedPlanId: string;
    subscribedPlanPrice: string;
    planComponents: any;
    subscribedPlanBaseDct?: string;
    subscribedPlanBasePrice?: string;
    subscribedPlanCurrency?: string;

}

export interface PlanComponent {
    componentId: string;
    componentName: string;
    pricePerDay?: string | PlanPrice;
    features: string[];
}

export interface PlanPrice {
    currency: string;
    amount: number;
}

export interface PlanDetails {
    title: string;
    subtitle: string;
    planComponentList: PlanComponent[];
}