import { NavItem } from "./navItem";

export interface SideNavContextType {
  isOpen: boolean;
  currentPage: NavItem | null;
  toggleSidebar: () => void;
  setCurrentPage: (page: NavItem) => void;
}
