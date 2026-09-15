export interface BillingDetailsModel {
    subscribedPlan: string;
    subscribedPlanPrice: string;
    currentBillingDetails: BillDetailsModel;
    billingData: BillingDetailsItemModel[];
}

export interface BillDetailsModel {
    adjBillAmount: number;
    billAmount: number;
    billComment: string;
    billContact: string;
    billDate: string;
    billOpenBalance: number;
    billStatus: string;
    billTaxPct: number;
    id: string;
}

export interface BillingDetailsItemModel {
    id: number;
    month: string;
    logDate: string;
    usage: number;
    overUsage: number;
    billAmount: number;
    paidAmount: number;
}

