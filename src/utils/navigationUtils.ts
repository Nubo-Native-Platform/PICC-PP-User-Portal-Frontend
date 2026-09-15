import { navData } from "../configs/navConfig";
import { NavItem } from "../models/navItem";

export const findNavItemByPath = (path: string): NavItem => {
  const foundItem = findItemByPath(navData, path);
  return foundItem ? foundItem : navData[0];
};

const findItemByPath = (data: NavItem[], path: string): NavItem | undefined => {
  for (const item of data) {
    if (item.path === path) {
      return item;
    } else if (item.children) {
      return findItemByPath(item.children, path);
    }
  }
};
