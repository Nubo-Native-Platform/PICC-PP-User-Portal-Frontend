
export interface IssueTrendModel {
    issueCategory?: string;
    totalIssueCount?: number;
    monthlyData: MonthlyDataModel[];
}

export interface MonthlyDataModel {
    month: string;
    resolvedIssue: number;
    reportedIssue: number;
}
