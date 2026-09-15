export interface IssueModel {
    id: string,
    reportDate: string,
    category: string,
    categoryType: string,
    subject: string,
    priority: string,
    status: string
    description?: string,
    resolveDate?: string,
    resolution?: string,
}

export interface PastIssueModel extends IssueModel {
    resolveHr: string,
}

export interface IssuePostModel {
    subject: string,
    category: string,
    priority: string,
    description: string,
    categoryType: string,
    accountName: string,
    ticketDate: string
}