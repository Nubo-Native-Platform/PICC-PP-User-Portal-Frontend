export class UserFormModel {
    environmentId: string;
    registerUsername: string;
    registerEmail: string;
    registerFirstName: string;
    registerLastName: string;
    registerContactNo: string;
    registerPassword?: string;
    registerRetypePassword?: string;
    registerUserRole: string;
    registerUserStatus: string;
};

export class IssueFormModel {
    issueId?: string;
    issueCategory: string;
    issueCategoryType: string;
    issueName: string;
    issueDescription: string;
    issuePriority: string;
    issueStatus: string;
    issueResolvedDate?: string;
    issueResolutionComment?: string;
};