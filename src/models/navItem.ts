import { SvgIconProps } from "@mui/material";

export interface NavItem {
  id: string;
  icon?: React.ComponentType<SvgIconProps>;
  path: string;
  title: string;
  element?: React.ReactNode | null;
  children?: Array<NavItem>;
  restrictedUserTypes?: ('user' | 'admin' | 'superadmin')[];
}
