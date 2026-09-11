import { CustomTableModel } from "./customTableModel";
import { ListItem } from "./listItemsModel";

export interface BillingDetailsDisplayModel {
    title: string;
    currentBillAmount: number;
    billingSummary: ListItem,
    formattedBillingData: formattedBillingData,
    pastBillingData?: CustomTableModel
}

export interface formattedBillingData {
    categories: string[];
    billAmount: number[];
    paidAmount: number[];
}