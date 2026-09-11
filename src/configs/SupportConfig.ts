import IssueTrendSupportComponent from "@/components/support/IssueTrendSupportComponent";
import OpenIssuesSupportComponent from "@/components/support/OpenIssuesSupportComponent";
import PastIssuesSupportComponent from "@/components/support/PastIssuesSupportComponent";
import { CustomAccordionConfig } from "@/models/customAccordionOption";

export const SUPPORT_CONFIG: CustomAccordionConfig = {
    title: "",
    options: [
        {
            id: "open-issues",
            title: "Open Issues",
            url: "openIssuesUrl",
            // localhostUrl: true,
            element: OpenIssuesSupportComponent,
        },
        {
            id: "past-issues",
            title: "Past Issues",
            url: "pastIssuesUrl",
            // localhostUrl: true,
            element: PastIssuesSupportComponent,
        },
        {
            id: "issue-trend",
            title: "Issue Trend",
            url: "issueTrendUrl",
            localhostUrl: true,
            element: IssueTrendSupportComponent
        },
    ],
};