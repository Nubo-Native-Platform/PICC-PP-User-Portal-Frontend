import { ListItem, ListItemsModel } from "@/models/listItemsModel";
import { SubscribedPlanModel } from "@/models/apimodels/subscribed-plan";
import { BillingDetailsItemModel, BillingDetailsModel, BillDetailsModel } from "@/models/apimodels/billing-details-model";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MarketplaceContributionModel, SolutionModel } from "@/models/apimodels/marketplace-contribution-model";
import { ColumnDef, CustomTableModel, RowData } from "@/models/customTableModel";
import { marketPlaceTableConfig } from "@/configs/TableConfig";
import { AccountCommunicationModel } from "@/models/apimodels/account-communication-model";
import { FieldConfig } from "@/models/formModel";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { UserModel } from "@/models/apimodels/user-model";
import { IssueModel, PastIssueModel } from "@/models/apimodels/issue-model";
import { IssueTrendModel } from "@/models/apimodels/issue-trend-model";
import { DashboardOptions } from "@/models/dashboardOptions";
import { billingDetailsConfig } from "@/configs/BillingDetailsConfig";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { IssueFormModel } from "@/models/FormModels";
import { MONTHS } from "@/constants/months";
import { DropdownOption } from "@/models/dropdownModel";
import { InputConfig } from "@/models/NNPFormModel";
import { K8sResourceModel } from "@/models/k8ResourceModel";
import CookieService from "./cookies";
import { BillingDetailsDisplayModel } from "@/models/billingDetailsDisplayModel";


export const monthOrder = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
export const SubscribedPlanToListItemsModel = (plan: SubscribedPlanModel): ListItemsModel => {
  return {
    title: `${plan.subscribedPlan} (${plan.subscribedPlanPrice})`,
    subTitle: "",
    description: "", // Assuming no description provided in SubscribedPlan
    listItems: Object.keys(plan.planComponents).map(key => {
      const component = plan.planComponents[key];
      return {
        title: `${component.componentName}${component.pricePerDay ? ` - ${component.pricePerDay}` : ''}`,
        description: "", // No description field in PlanComponent, so we leave it blank
        // subListItems: component.features.map(feature => ({
        //   title: feature
        // }))
      }
    })
  };
}

export const accordionItemToListItemsModel = (
  items: DashboardOptions[]
): ListItem[] => {
  return items.map((item) => {
    const listItem: ListItem = {
      title: item.title,
      description: item.summary || "",
      subListItems: [],
    };

    // If the item has children, convert them recursively
    if (item.children && item.children.length > 0) {
      listItem.subListItems = item.children.map((child) => ({
        title: child.title,
        url: child.link || "",
        description: child.summary || "",
      }));
    }

    return listItem;
  });
};

export const accordionItemToListItemsModelDevFrameWorks = (
  items: any[]
): ListItem[] => {
  return items.map((item) => {
    const listItem: ListItem = {
      title: item.title,
      description: item.summary || "",
      subListItems: [],
    };

    if (item.children && item.children.length > 0) {
      listItem.subListItems = item.children.map((child) => ({
        title: child.title,
        url: child.link || "",
        description: child.summary || "",
        demoLink: child.demoUrl || "",
      }));
    }

    return listItem;
  });
};



export const billingDetailsToDisplayModel = (billingDetails: BillingDetailsModel): BillingDetailsDisplayModel => {
  const sortedBillingData = sortBillingData(billingDetails.billingData);
  return {
    title: `${billingDetails.subscribedPlan} (${billingDetails.subscribedPlanPrice})`,
    currentBillAmount: billingDetails.currentBillingDetails.billAmount,
    billingSummary: currentBillingToList(billingDetails.currentBillingDetails),
    formattedBillingData: formatBillingDetailsData(sortedBillingData),
    pastBillingData: formatPastBillingToTable(sortedBillingData)
  };
};


const sortBillingData = (data: BillingDetailsItemModel[]) => {
  if (!data || data.length === 0) return [];

  const monthLookup = Object.fromEntries(
    MONTHS.map(({ month, id, alias }) => [month.toUpperCase(), { id, alias }])
  );

  return data
    .map((item) => {
      const monthInfo = monthLookup[item.month?.toUpperCase()] || { id: 999, alias: item.month };
      return { ...item, month: monthInfo.alias, _order: monthInfo.id };
    })
    .sort((a, b) => b._order - a._order)
    .map(({ _order, ...rest }) => rest); // remove helper property
}

const currentBillingToList = (
  summaryItems: BillDetailsModel
): ListItem => {
  billingDetailsConfig.map((config) => {
    config.value = summaryItems[config.field];
  });
  return {
    title: "Billing Summary",
    // description: "Breakdown of your latest bill",
    subListItems: billingDetailsConfig.map((item) => ({
      title: `${item.label} : ${item.type === 'currency' ? (CookieService.getCountryCurrency() ? CookieService.getCountryCurrency() : '$') : ''} ${item.value}`,
    })),
  };
};

const formatBillingDetailsData = (data: BillingDetailsItemModel[]) => {
  const sortedData = [...data].sort((a, b) => a.id - b.id);

  const categories = sortedData.map((d) => d.month);
  const billAmount = sortedData.map((d) => d.billAmount);
  const paidAmount = sortedData.map((d) => d.paidAmount);

  return { categories, billAmount, paidAmount };
}


export const marketPlaceContributionToTableModel = (
  planData: MarketplaceContributionModel
): CustomTableModel => {
  const data = planData.solutions;
  const colDef = generateMPCColumnDef(data);
  const rows = generateMPCRows(data);
  return { colDef, rows };
}

function generateMPCColumnDef(data: SolutionModel[]): ColumnDef[] {
  const monthsSet = new Set<string>();
  data.forEach((item) =>
    item.monthlyData.forEach((m) => monthsSet.add(m.month))
  );

  const monthColumns: ColumnDef[] = Array.from(monthsSet).map((month) => ({
    field: month,
    headerName: month,
  }));

  return [...marketPlaceTableConfig.staticColumns, ...monthColumns];
}

function generateMPCRows(data: SolutionModel[]): RowData[] {
  let idCounter = 1;
  const rows: RowData[] = [];

  data.forEach((entry) => {
    marketPlaceTableConfig.types.forEach((type) => {
      const row: RowData = {
        id: `row-${idCounter++}`,
        [marketPlaceTableConfig.groupByField]: entry.solution,
        [marketPlaceTableConfig.typeField]: type,
      };

      entry.monthlyData.forEach((m) => {
        row[m.month] = type === "usage" ? m.usage : m.revenue;
      });

      rows.push(row);
    });
  });

  return rows;
}

export const AccountCommunicationToTableModel = (data: AccountCommunicationModel[]): CustomTableModel => {
  const colDef = generateAccColumnDef(data);
  const rows = generateTablegRows(data);
  return { colDef, rows };

}

const generateAccColumnDef = (data: AccountCommunicationModel[]): ColumnDef[] => {
  const colDef: ColumnDef[] = [
    {
      field: "date",
      headerName: "Date",
    },
    {
      field: "type",
      headerName: "Type",
    },
    {
      field: "category",
      headerName: "Category",
    },
    // {
    //   field: "action",
    //   headerName: "Action",
    // },
    {
      field: "message",
      headerName: "Message",
      maxLength: 50,
    },
    {
      field: "details",
      type: "link",
      icon: InfoOutlinedIcon,
      style: { cellColor: 'var(--text-color-link)' },
      headerName: "Details",
    },
  ];

  return colDef;
};

export function formatPlanChangeFormConfig(
  configTemplate: FieldConfig[],
  allPlans: any[],
  subscribedPlan: any
): FieldConfig[] {
  const planOptions = allPlans.map((plan) => {
    return { label: `${plan.hostPlanName} : $${plan.hostPlanBasePr} ${plan.hostDefaultDct ? ` [ disc: ${plan.hostDefaultDct}% ]` : ''}`, value: plan.hostPlanid }
  });
  const selectedPlanPrice = subscribedPlan.subscribedPlanPrice;
  // const selectedComponentNames = subscribedPlan.planComponentList.map(
  //   (comp: any) => comp.componentName
  // );

  return configTemplate.map((field) => {
    switch (field.name) {
      case "plan":
        return {
          ...field,
          options: planOptions,
        };
      case "components":
        return {
          ...field,
          // value: selectedComponentNames,
          // options: selectedComponentNames,
        };
      case "monthlyCost":
        return {
          ...field,
          value: selectedPlanPrice,
        };
      default:
        return field;
    }
  });
}


export const formatPastBillingToTable = (
  data: BillingDetailsItemModel[]
): CustomTableModel => {
  const colDef = generatePastBillingColumnDef(data);
  const rows = generateTablegRows(data);
  return { colDef, rows };
};

const generatePastBillingColumnDef = (data: BillingDetailsItemModel[]): ColumnDef[] => {
  const colDef: ColumnDef[] = [
    {
      field: "month",
      type: "string",
      headerName: "Month",
    },
    {
      field: "billAmount",
      type: "number",
      headerName: `Bill Amount (${CookieService.getCountryCurrency() ? CookieService.getCountryCurrency() : ''})`,
    },
    {
      field: "paidAmount",
      type: "number",
      headerName: `Paid Amount (${CookieService.getCountryCurrency() ? CookieService.getCountryCurrency() : ''})`,
    },
    {
      field: "invoiceUrl",
      headerName: "Invoice",
      type: "link",
      icon: DescriptionOutlinedIcon
    },
  ];

  return colDef;
};

const generateUserColumnDef = (data: UserModel[]): ColumnDef[] => {
  const colDef: ColumnDef[] = [
    {
      field: "userId",
      type: "string",
      headerName: "User Id",
    },
    {
      field: "emailId",
      type: "string",
      headerName: "Email",
    },
    {
      field: "contactNumber",
      type: "string",
      headerName: "Contact Number",
    },
    {
      field: "roleLabel",
      type: "string",
      headerName: "Role",
    },
    {
      field: "userStatus",
      type: "string",
      headerName: "Status",
    },
    {
      field: "editUser",
      type: "link",
      headerName: "Edit",
      icon: EditNoteOutlinedIcon
    },
    {
      field: "userAccess",
      type: "link",
      headerName: "Access",
      icon: KeyOutlinedIcon
    },
  ];

  return colDef;
};

const generateMarketContributionColumnDef = (): ColumnDef[] => {
  const colDef: ColumnDef[] = [
    {
      field: "solution",
      type: "string",
      headerName: "Solution",
    },
    {
      field: "domain",
      type: "string",
      headerName: "Domain",
    },
    {
      field: "subDomain",
      type: "string",
      headerName: "Sub Domain",
    },
    {
      field: "certified",
      type: "string",
      headerName: "Certified",
    },
    {
      field: "activeFrom",
      type: "date",
      headerName: "Active From",
    },
    {
      field: "availableTill",
      type: "date",
      headerName: "Available Till",
    },
    {
      field: "status",
      type: "string",
      headerName: "Status",
    },
    {
      field: "",
      type: "link",
      headerName: "Manage",
      icon: EditNoteOutlinedIcon
    },
  ];

  return colDef;
};

const generatePastIssueColumnDef = () => {
  const colDef: ColumnDef[] = [
    {
      field: "id",
      type: "string",
      headerName: "ID",
    },
    {
      field: "reportDate",
      type: "string",
      headerName: "Report Date",
    },
    {
      field: "resolveDate",
      type: "string",
      headerName: "Resolve Date",
    },
    {
      field: "resolveHr",
      type: "string",
      headerName: "Resolution (H)",
    },
    {
      field: "category",
      type: "string",
      headerName: "Category",
    },
    {
      field: "subject",
      type: "string",
      headerName: "Subject",
    },
    {
      field: "priority",
      type: "string",
      headerName: "Priority",
    },
    {
      field: "status",
      type: "string",
      headerName: "Status",
    },
    {
      field: "details",
      type: "link",
      icon: InfoOutlinedIcon,
      style: { cellColor: 'var(--text-color-link)' },
      headerName: "Details"
    },
    // {
    //   field: "",
    //   type: "link",
    //   headerName: "Re-Open",
    //   icon: EditNoteOutlinedIcon
    // },
  ];

  return colDef;
}

const generateIssueColumnDef = () => {
  const colDef: ColumnDef[] = [
    {
      field: "id",
      type: "string",
      headerName: "ID",
    },
    {
      field: "reportDate",
      type: "string",
      headerName: "Report Date",
    },
    {
      field: "category",
      type: "string",
      headerName: "Category",
    },
    {
      field: "categoryType",
      type: "string",
      headerName: "Category Type",
    },
    {
      field: "subject",
      type: "string",
      headerName: "Subject",
    },
    {
      field: "priority",
      type: "string",
      headerName: "Priority",
    },
    {
      field: "status",
      type: "string",
      headerName: "Status",
    },
    {
      field: "editIssue",
      type: "link",
      headerName: "Action",
      icon: EditNoteOutlinedIcon
    },
  ];

  return colDef;
}


const generateTablegRows = (data: any[]): RowData[] => {
  const rows: RowData[] = data.map((item, index) => ({
    id: `row-${index + 1}${item.id ? `-${item.id}` : ''}`,
    ...item,
  }));

  return rows;
}

export const UserModelToTableModel = (data: UserModel[], userRoles: DropdownOption[]): CustomTableModel => {
  const colDef = generateUserColumnDef(data);

  data.forEach(user => {
    const role = userRoles.find(role => role.value === user.roleId);
    if (role) {
      user.roleLabel = role.label;
    }
  });
  const rows = generateTablegRows(data);
  return { colDef, rows };
};

export const marketPlaceContributionModelToTableModel = (data: SolutionModel[]): CustomTableModel => {
  const colDef = generateMarketContributionColumnDef();
  const rows = generateTablegRows(data);
  return { colDef, rows };
};

export const issueModelToTableModel = (data: IssueModel[]): CustomTableModel => {
  const colDef = generateIssueColumnDef();
  const rows = generateTablegRows(data);
  return { colDef, rows };
};

export const pastIssueModelToTableModel = (data: PastIssueModel[]): CustomTableModel => {
  const colDef = generatePastIssueColumnDef();
  const rows = generateTablegRows(data);
  return { colDef, rows };
};



export const issueTrendToBarChartData = (
  data: IssueTrendModel[],
  valueKey: "reportedIssue" | "resolvedIssue" | "averageResolveTime"
) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { categories: [], series: [] };
  }

  const categories = extractSortedMonths(data);

  const series = data.map(issue => {
    const monthMap = new Map(issue.monthlyData.map(m => [m.month, m[valueKey]]));
    return {
      name: issue.issueCategory || "Unknown",
      data: categories.map(month => monthMap.get(month) ?? 0)
    };
  });

  return { categories, series };
};


export const extractSortedMonths = (data: IssueTrendModel[]): string[] => {
  const monthSet = new Set<string>();
  data.forEach(issue => {
    issue.monthlyData.forEach(m => monthSet.add(m.month));
  });

  // Define month order
  const monthOrder = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  return Array.from(monthSet).sort(
    (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
  );
};


export const portalStatsToLineChartData = (portalStats: any[]) => {
  if (!portalStats || portalStats.length === 0) {
    return {
      categories: [],
      cpuSeriesData: [],
      memSeriesData: [],
      storageSeriesData: [],
    };
  }

  // Sort by usageDate, then by hour- for proper timeline
  const sortedData = [...portalStats].sort((a, b) => {
    if (a.usageDate === b.usageDate) {
      return a.hour - b.hour;
    }
    return a.usageDate < b.usageDate ? -1 : 1;
  });

  // X-axis categories → e.g. ["16:00", "17:00", ...]
  const categories = sortedData.map(item => `${item.hour}:00`);

  // CPU series
  const cpuSeriesData = [
    { name: "Avg CPU", data: sortedData.map(item => item.avgCpu) },
    { name: "Max CPU", data: sortedData.map(item => item.maxCpu) },
  ];

  // Memory series
  const memSeriesData = [
    { name: "Avg Memory", data: sortedData.map(item => item.avgMem) },
    { name: "Max Memory", data: sortedData.map(item => item.maxMem) },
  ];

  // Storage series
  const storageSeriesData = [
    { name: "Avg Storage", data: sortedData.map(item => item.avgStorage) },
    { name: "Max Storage", data: sortedData.map(item => item.maxStorage) },
  ];

  return {
    categories,
    cpuSeriesData,
    memSeriesData,
    storageSeriesData,
  };
};

export const tableModelToUserFormModel = (row) => {
  const editUser = {
    environmentId: row.envId,
    registerUsername: row.userId,
    registerEmail: row.emailId,
    registerFirstName: row.firstName,
    registerLastName: row.lastName,
    registerContactNo: row.contactNumber,
    registerUserRole: row.roleId,
    registerUserStatus: row.userStatus,
    // registerPassword: row.password,
    // registerRetypePassword: row.password
  };
  return editUser;
}

export const tableModelToIssueFormModel = (row: IssueModel) => {
  const editIssue: IssueFormModel = {
    issueId: row.id,
    issueCategory: row.category,
    issueCategoryType: row.categoryType,
    issueName: row.subject,
    issueDescription: row.description,
    issuePriority: row.priority,
    issueStatus: row.status,
    issueResolvedDate: row.resolveDate,
    issueResolutionComment: row.resolution,
  };
  return editIssue;
}

export const kubernetesDetailsToTableRows = (data: any[]) => {
  return data.map((item, index) => {
    const servicesFormatted = (item.services || [])
      .map((svc: any) => svc.endPoints.join(", "))
      .join(", ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      id: `row-${index + 1}${item.id ? `-${item.id}` : ""}`,
      memory: `${item.memoryConsumed.value} ${item.memoryConsumed.unit}`,
      cpu: `${item.cpuConsumed.value} ${item.cpuConsumed.unit}`,
      servicesFormatted,
      ...item,
    };
  });
};

export const resourcesModelToFormConfig = (resources: Record<string, K8sResourceModel[]>): FieldConfig[] => {
  const formConfig: FieldConfig[] = [];

  // Loop through all keys except deploymentName
  Object.entries(resources).forEach(([key, value]) => {
    if (key === "deploymentName" || !Array.isArray(value)) return;

    const options = value.map((item: K8sResourceModel) => ({
      label: item.resourceName,
      value: item.resourceName,
      disabled: item.willBeForceDeleted,
    }));

    const values = value.filter(opt => opt.willBeForceDeleted).map(opt => opt.resourceName);

    formConfig.push({
      name: key,
      label: key,
      type: "checkbox",
      options,
      value: values,
    });
  });

  formConfig.push({ label: "Delete", name: "deleteBtn", type: "button", buttonType: "submit", value: null });

  return formConfig;
};
