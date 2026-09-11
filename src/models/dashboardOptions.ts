export interface DashboardOptions {
  id: string;
  title: string;
  link: string;
  queryParams?: unknown;
  fragment?: string;
  userTypes?: string[];
  summary?: string;
  children?: DashboardOptions[];
  isListView?: boolean;
}
