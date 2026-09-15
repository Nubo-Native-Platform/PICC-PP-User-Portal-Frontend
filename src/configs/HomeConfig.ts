import { UserModel } from "../models/apimodels/user-model";
import { CustomAccordionConfig, customAccordionOption } from "../models/customAccordionOption";
import MultiPieChartCont from "../components/charts/MultiPieChartCont";
import Account from "../containers/Account";
import BarChartCont from "../components/charts/StackChartCont";
import PieLineBarChartCont from "../components/charts/PieLineBarChartCont";
import SubscribedPlan from "../components/home/SubscribedComponent";
import ApiGatewayChartCont from "../components/charts/ApiGatewayChartCont";
import BillingDetailsComponent from "@/components/home/BillingDetailsComponent";
import MarketplaceContributionComponent from "@/components/home/MarketplaceContributionComponent";
import AccountCommunicationComponent from "@/components/shared/AccountCommunicationComponent";
import { DashboardOptions } from "@/models/dashboardOptions";
import MultiLineChartCont from "@/components/charts/MultiLineChartCont";

interface DashboardAdminOption {
  id: string;
  title: string;
  link: string;
  userType?: string[]; // Optional because some items use `userTypes`
  userTypes?: string[]; // Some objects may have `userTypes` instead of `userType`
  home?: boolean;
  children?: DashboardOptions[];
}

const DASHBOARD_ADMIN_OPTIONS: DashboardAdminOption[] = [
  {
    id: 'master-env-config',
    title: "Master Environment Configuration",
    link: "/nnp/env-conf",
    userTypes: ["SUPERADMIN"],
    // icon: { icon: 'home', pack: 'eds' },
    home: true,
  },
  {
    id: 'env-mgmt',
    title: "Environment Management",
    link: "/nnp/env-mgmt",
    userType: ["SUPERADMIN", "ADMIN"],
    // queryParams: {envId: this.eiimpEnvService.get().envId}
  },
  {
    id: 'access-request-mgmt',
    title: "Access Request Management",
    link: "/nnp/access-request-management",
    userType: ["SUPERADMIN", "ADMIN"],
  },
  {
    id: 'user-access',
    title: "User Access",
    link: "/nnp/user-access",
    userType: ["SUPERADMIN", "ADMIN"],
  },
];

export const getDashboardAdminOptions = () => {
  const adminOptions: DashboardAdminOption = {
    id: "admin-options",
    title: "Administration",
    link: "/nnp",
    children: [],
  };
  const adminOptionsChildren = DASHBOARD_ADMIN_OPTIONS;
  adminOptions.children = adminOptionsChildren;
  return adminOptions;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DASHBOARD_PLATFORM_OPTIONS: CustomAccordionConfig = {
  title: "Platform Dashboard",
  options: [
    {
      id: "platform-usage",
      title: "Platform Usage",
      url: "last24UsageMemory",
      // style: {
      //   headerBg: "!bg-[#888888]",
      //   headerColor: "text-[#ffffcc]",
      // },
      element: MultiLineChartCont,
    },
    {
      id: "log-generation",
      title: "Log Generation",
      url: "last24Log",
      // style: {
      //   headerBg: "!bg-[#bbbbbb]",
      // },
      element: BarChartCont,
    },
    {
      id: "pipeline-execution",
      title: "Pipeline Execution",
      url: "last24PipelineUsage",
      // style: {
      //   headerBg: "!bg-[#bbbbbb]",
      // },
      element: PieLineBarChartCont,
    },
    {
      id: "api-gateway",
      title: "API Gateway",
      url: "last24ApiGatewayUsage",
      // style: {
      //   headerBg: "!bg-[#bbbbbb]",
      // },
      element: ApiGatewayChartCont,
    },
  ]
};

export const DASHBOARD_ACCOUNT_OPTIONS: CustomAccordionConfig = {
  title: "Account Overview",
  options: [
    {
      id: "account-details",
      title: "Subscribed Components",
      url: "subscribedComponentUrl",
      // style: {
      //   headerBg: "!bg-[#888888]",
      //   headerColor: "text-[#ffffcc]",
      // },
      localhostUrl: false,
      element: SubscribedPlan,
    },
    {
      id: "billing-details",
      title: "Billing Details",
      url: "billingDetailsUrl",
      // style: {
      //   headerBg: "!bg-[#bbbbbb]",
      //   headerColor: "text-[#ffffcc]"
      // },
      localhostUrl: false,
      element: BillingDetailsComponent,
    },
    {
      id: "market-place",
      title: "Market Place Contribution",
      url: "marketplaceContributionUrl",
      // style: {
      //   headerBg: "!bg-[#bbbbbb]",
      // },
      localhostUrl: true,
      element: MarketplaceContributionComponent,
    },
    {
      id: "account-communication",
      title: "Account Comunication",
      url: "accountCommunicationUrl",
      // style: {
      //   headerBg: "!bg-[#bbbbbb]",
      // },
      localhostUrl: false,
      element: AccountCommunicationComponent
    },
  ]
};

export type FeatureIconMappingValue = string | string[];

const PLATFORM_ICONS = [
  "/feature_svg/comp1.png",
  "/feature_svg/comp2.png",
  "/feature_svg/comp3.png",
  "/feature_svg/comp4.png",
];
const SOFTWARE_ICONS = [
  "/feature_svg/dev1.png",
  "/feature_svg/dev2.png",
  "/feature_svg/dev3.png",
  "/feature_svg/dev4.png",
];
const DEVOPS_ICONS = [
  "/feature_svg/devops1.png",
  "/feature_svg/devops2.png",
];
const API_ICONS = [
  "/feature_svg/api1.png",
  "/feature_svg/api2.png",
];
const DMS_ICONS = [
  "/feature_svg/dms1.png",
  "/feature_svg/dms2.png",
];

export const FEATURE_ICON_MAPPING: Record<string, FeatureIconMappingValue> = {
  "infrastructure insight": "/feature_svg/infra1.png",
  "application logs": "/feature_svg/infra2.png",
  "environment management": "/feature_svg/infra3.png",
  "security management": "/feature_svg/infra4.png",

  "platform component": PLATFORM_ICONS,
  "platform components": PLATFORM_ICONS,
  "platform base components": PLATFORM_ICONS,
  "platform base component": PLATFORM_ICONS,
  "integration component": "/feature_svg/comp1.png",
  "integration components": "/feature_svg/comp1.png",
  "integration": "/feature_svg/comp1.png",
  "data processing and visualization": "/feature_svg/comp2.png",
  "data processing and visualization component": "/feature_svg/comp2.png",
  "data processing component": "/feature_svg/comp2.png",
  "data visualization": "/feature_svg/comp2.png",
  "data visualization component": "/feature_svg/comp2.png",
  "data persistence": "/feature_svg/comp3.png",
  "data persistence component": "/feature_svg/comp3.png",
  "development component": "/feature_svg/comp4.png",
  "development components": "/feature_svg/comp4.png",
  "deployment component": "/feature_svg/comp4.png",
  "deployment components": "/feature_svg/comp4.png",
  "software development": SOFTWARE_ICONS,
  "software development tools": SOFTWARE_ICONS,
  "enterprise low code": "/feature_svg/dev2.png",
  "low code utility": "/feature_svg/dev2.png",
  "dms component": "/feature_svg/dms1.png",
  "dms solution": "/feature_svg/dms2.png",
  "dms solution component": "/feature_svg/dms2.png",
  "api management": API_ICONS,
  "api lifecycle management": API_ICONS,
  "api gateway": API_ICONS,
  "api registry": API_ICONS,
  "data management": DMS_ICONS,
  "information management": DMS_ICONS,
  "data management solution": DMS_ICONS,
  "data": DMS_ICONS,
  "information": DMS_ICONS,
};

const FEATURE_ICON_KEYWORD_PATTERNS: Array<[RegExp, FeatureIconMappingValue]> = [
  [/\b(platform|base component|platform component|platform components)\b/, PLATFORM_ICONS],
  [/\b(software development|enterprise low code|low code utility|development)\b/, SOFTWARE_ICONS],
  [/\b(devsecops|devops|lifecycle automation|security pipeline|security dashboard|pipeline)\b/, DEVOPS_ICONS],
  [/\b(api lifecycle management|api management|api gateway|api registry|api analytics)\b/, API_ICONS],
  [/\b(data management|information management|dms|reporting|grafana|superset|spark)\b/, DMS_ICONS],
];

export const getFeatureIcon = (
  titleKey: string,
  index: number = 0
): string | undefined => {
  const normalizedTitle = titleKey.trim().toLowerCase();
  const exactEntry = FEATURE_ICON_MAPPING[normalizedTitle];

  if (typeof exactEntry === "string") {
    return exactEntry;
  }
  if (Array.isArray(exactEntry)) {
    return exactEntry[index % exactEntry.length];
  }

  const sortedKeys = Object.keys(FEATURE_ICON_MAPPING).sort((a, b) => b.length - a.length);
  const matchedKey = sortedKeys.find(
    (key) => normalizedTitle.includes(key) || key.includes(normalizedTitle)
  );

  if (matchedKey) {
    const matchedEntry = FEATURE_ICON_MAPPING[matchedKey];
    return typeof matchedEntry === "string"
      ? matchedEntry
      : matchedEntry[index % matchedEntry.length];
  }

  for (const [pattern, icons] of FEATURE_ICON_KEYWORD_PATTERNS) {
    if (pattern.test(normalizedTitle)) {
      return icons[index % icons.length];
    }
  }

  return undefined;
};
