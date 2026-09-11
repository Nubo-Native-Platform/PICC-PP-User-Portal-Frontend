import AccountCommunicationComponent from "@/components/shared/AccountCommunicationComponent";
import { CustomAccordionConfig } from "../models/customAccordionOption";
import BillingDetailsAccountComponent from "@/components/account/BillingDetailsAccountComponent";
import ManagePlanComponent from "@/components/account/ManagePlanComponent";
import UserAccountComponent from "@/components/account/UserAccountComponent";
import MarketplaceContributionComponent from "@/components/home/MarketplaceContributionComponent";
import ContributedSolutionComponent from "@/components/account/ContributedSolutionComponent";
import AccountDetailsBillingFormComponent from "@/components/account/AccountDetailsBillingFormComponent";
import AccountDetailsPersonalFormComponent from "@/components/account/AccountDetailsPersonalFormComponent";
import AccountDetailsCredentialsFormComponent from "@/components/account/AccountDetailsCredentialsFormComponent";
import ProxyConfigComponent from "@/components/ProxyconfigComponent";

export const ACCOUNT_DETAILS: CustomAccordionConfig = {
  title: "Account Details",
  options: [
    {
      id: "manage-plan",
      title: "Manage Plan",
      url: "subscribedComponentUrl",
      additionalUrls: ["getPlans"],
      additionalUrlService: "nnpConf",
      // style: {
      //   headerBg: "!bg-[var(--component-color-primary)]",
      //   headerColor: "text-[var(--text-color-secondary)]",
      // },
      localhostUrl: false,
      element: ManagePlanComponent,
    },
    {
      id: "billing-details",
      title: "Billing Details",
      url: "billingDetailsUrl",
      // style: {
      //   headerBg: "!bg-[var(--component-color-primary)]",
      //   headerColor: "text-[var(--text-color-secondary)]",
      // },
      localhostUrl: false,
      element: BillingDetailsAccountComponent,
    },
    {
      id: "account-communication",
      title: "Account Communication",
      url: "accountCommunicationUrl",
      // style: {
      //   headerBg: "!bg-[var(--component-color-primary)]",
      //   headerColor: "text-[var(--text-color-secondary)]",
      // },
      localhostUrl: false,
      element: AccountCommunicationComponent
    },
    {
      id: "user-accounts",
      title: "Additional User Accounts",
      url: "userListUrl",
      service: "nnpConf",
      // style: {
      //   headerBg: "!bg-[var(--component-color-primary)]",
      //   headerColor: "text-[var(--text-color-secondary)]",
      // },
      localhostUrl: false,
      element: UserAccountComponent,
    },
    {
      id: "proxy-config",
      title: "Proxy Configuration",
      url: "getProxyConfig",
      // style: {
      //   headerBg: "!bg-[var(--component-color-primary)]",
      //   headerColor: "text-[var(--text-color-secondary)]",
      // },
      localhostUrl: false,
      element: ProxyConfigComponent,
    },
  ],
};


export const MARKETPLACE_DETAILS: CustomAccordionConfig = {
  title: "Marketplace Contribution Details",
  options: [
    {
      id: "contributed-solution",
      title: "Contributed Solution",
      url: "marketplaceContributionUrl",
      // style: {
      //   headerBg: "!bg-[var(--component-color-primary)]",
      // },
      localhostUrl: true,
      element: ContributedSolutionComponent
    },
    {
      id: "solution-performance",
      title: "Solutions Performance",
      url: "marketplaceContributionUrl",
      // style: {
      //   headerBg: "!bg-[var(--component-color-primary)]",
      // },
      localhostUrl: true,
      element: MarketplaceContributionComponent
    },
  ],
};
export const ACCOUNT_MANAGEMENT: CustomAccordionConfig = {
  title: "Manage your Account",
  options: [
    {
      id: "account-details",
      title: "Account Details",
      url: "accountDetails",
      // style: {
      //   headerBg: "!bg-[var(--component-color-primary)]",
      //   headerColor: "text-[var(--text-color-secondary)]",
      // },
      //localhostUrl: true,
      element: AccountDetailsPersonalFormComponent,
    },
    // {
    //   id: "billing-details",
    //   title: "Account Billing Details",
    //   url: "/nnp/billing-details",
    //   localhostUrl: true,
    //   element: AccountDetailsBillingFormComponent,
    // },
    {
      id: "account-credentials",
      title: "Account Credentials",
      url: "accountDetails",
      // style: {
      //   headerBg: "!bg-[var(--component-color-primary)]",
      //   headerColor: "text-[var(--text-color-secondary)]",
      // },
      element: AccountDetailsCredentialsFormComponent
    },
  ],
};
