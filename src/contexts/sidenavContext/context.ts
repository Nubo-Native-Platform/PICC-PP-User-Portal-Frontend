import { createContext, useContext, useState } from "react";
import { SideNavContextType } from "@/models/SidenavDetails";
import { NavItem } from "@/models/navItem";

export const SidenavContext = createContext<SideNavContextType>({
    isOpen: true,
    currentPage: { id: "default", title: "Home", path: "/" },
    toggleSidebar: () => { },
    setCurrentPage: (_page: NavItem) => { },
});

export const useSideNavDetails = (): SideNavContextType => {
    const context = useContext(SidenavContext);
    if (!context) {
        throw new Error("useSideNav must be used within a SideNavContextProvider");
    }
    return context;
};