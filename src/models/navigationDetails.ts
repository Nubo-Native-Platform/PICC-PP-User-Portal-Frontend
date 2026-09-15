import { NavItem } from "./navItem";

export interface navigationContextType {
  navHistory: Array<NavItem> | [];
  setNavigationHistory: (nav: NavItem) => void;
  currentPage: NavItem | null;
  setCurrentPage: (nav: NavItem) => void;
}
